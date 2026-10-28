from datetime import datetime
from typing import List, Optional, Tuple
from app.schemas import TaskItem, PlanRebalanceResponse, ScheduleConflict

class AdaptivePlanner:
    @staticmethod
    def _parse_deadline(deadline_str: Optional[str]) -> Optional[datetime]:
        if not deadline_str:
            return None
        for fmt in ("%Y-%m-%d", "%Y-%m-%dT%H:%M", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%d %H:%M"):
            try:
                return datetime.strptime(deadline_str[:19], fmt)
            except ValueError:
                continue
        return None

    @classmethod
    def rebalance(
        cls,
        tasks: List[TaskItem],
        energy: str = "medium",
        available_minutes: int = 180
    ) -> PlanRebalanceResponse:
        """
        Deterministic, testable adaptive planning algorithm.
        Reorders open tasks according to deadlines, priorities, and current energy.
        Identifies time conflicts without mutating user data silently.
        """
        # Separate completed vs open tasks (Rule 1: Never reschedule completed tasks)
        completed_tasks = [t for t in tasks if t.status == "completed"]
        open_tasks = [t for t in tasks if t.status != "completed"]

        # Calculate total required time for open tasks
        total_open_minutes = sum(t.estimated_duration for t in open_tasks)
        has_time_conflict = total_open_minutes > available_minutes

        conflicts: List[ScheduleConflict] = []
        if has_time_conflict:
            conflicts.append(
                ScheduleConflict(
                    task_id="summary_conflict",
                    title="Time Capacity Exceeded",
                    message=(
                        f"Your planned tasks total {total_open_minutes} minutes, which exceeds your "
                        f"available focus budget of {available_minutes} minutes by {total_open_minutes - available_minutes} minutes. "
                        f"Consider focusing on top-priority tasks or adjusting time estimates."
                    )
                )
            )

        # Priority weights
        priority_map = {"high": 3, "normal": 2, "low": 1}

        # Sorting logic:
        # We calculate a deterministic urgency score for open tasks
        # Factors:
        # 1. Deadline proximity (nearer = higher score)
        # 2. Priority weight (high = 3, normal = 2, low = 1)
        # 3. Energy factor:
        #    - If energy == 'low': favor shorter tasks (<= 30 mins) to enable low-friction starts
        #    - If energy == 'high': favor longer/high-priority tasks
        #    - If energy == 'medium': balanced
        
        now = datetime.now()

        def compute_sort_key(task: TaskItem) -> Tuple[float, int, int]:
            p_val = priority_map.get(task.priority.lower(), 2)
            d_val = 99999.0
            dl_obj = cls._parse_deadline(task.deadline)
            if dl_obj:
                diff_hours = (dl_obj - now).total_seconds() / 3600.0
                d_val = max(diff_hours, 0.0)

            # Energy bonus for selecting the next task
            duration = task.estimated_duration
            energy_score = 0.0
            if energy == "low":
                # Prefer shorter, manageable tasks
                if duration <= 25:
                    energy_score = 10.0
                elif duration <= 45:
                    energy_score = 5.0
                else:
                    energy_score = 1.0
            elif energy == "high":
                # High energy can handle heavier or high priority tasks
                energy_score = p_val * 4.0 + (duration / 20.0)
            else: # medium
                energy_score = p_val * 3.0

            # Composite sort tuple:
            # We want:
            # - High priority tasks with near deadlines first
            # We return: (energy_and_priority_score descending, deadline ascending, duration)
            composite_urgency = (p_val * 100.0) - (min(d_val, 500.0) * 0.5) + energy_score
            return (-composite_urgency, int(d_val), duration)

        # Sort open tasks
        sorted_open = sorted(open_tasks, key=compute_sort_key)

        # Assign scheduled_order safely
        ordered_all: List[TaskItem] = []
        order_idx = 1
        for t in sorted_open:
            item_copy = t.model_copy()
            item_copy.scheduled_order = order_idx
            ordered_all.append(item_copy)
            order_idx += 1

        # Keep completed tasks at the end without changing their status or details
        for t in completed_tasks:
            item_copy = t.model_copy()
            ordered_all.append(item_copy)

        # Determine recommended next task and explanation
        recommended_id = None
        recommendation_reason = ""
        energy_note = ""

        if sorted_open:
            top_task = sorted_open[0]
            recommended_id = top_task.id
            reasons = []

            if top_task.priority == "high":
                reasons.append("it is marked as high priority")
            if top_task.deadline:
                reasons.append("has an upcoming deadline")

            if energy == "low":
                energy_note = (
                    "Since your energy is low, the planner elevated approachable or shorter tasks "
                    "to help you build momentum without exhaustion."
                )
                if top_task.estimated_duration <= 30:
                    reasons.append(f"its shorter duration ({top_task.estimated_duration}m) fits low-battery mode")
            elif energy == "high":
                energy_note = (
                    "Your high energy allows tackling challenging and impactful items directly."
                )
            else:
                energy_note = (
                    "With balanced medium energy, your plan balances priority and deadline urgency."
                )

            joined_reasons = " and ".join(reasons) if reasons else "it provides the most balanced entry point"
            recommendation_reason = f"Recommended '{top_task.title}' next because {joined_reasons}."
        else:
            recommendation_reason = "All planned tasks are complete! Great work today."
            energy_note = "Take a well-deserved rest in the Reset Room."

        return PlanRebalanceResponse(
            ordered_tasks=ordered_all,
            recommended_next_task_id=recommended_id,
            recommendation_reason=recommendation_reason,
            total_planned_minutes=total_open_minutes,
            available_minutes=available_minutes,
            has_time_conflict=has_time_conflict,
            conflicts=conflicts,
            energy_adaptation_note=energy_note
        )

adaptive_planner = AdaptivePlanner()
