from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta

class StuckRadarConfig(BaseModel):
    enabled: bool = True
    inactivity_seconds: int = 120
    repeated_request_limit: int = 3
    repeated_request_window_seconds: int = 600
    dismissal_cooldown_seconds: int = 600

class ObserverCheckResult(BaseModel):
    should_prompt: bool
    trigger_reason: Optional[str] = None
    explanation: Optional[str] = None

class StuckRadarEngine:
    def __init__(self, config: Optional[StuckRadarConfig] = None):
        self.config = config or StuckRadarConfig()

    def evaluate(
        self,
        seconds_inactive: int,
        request_timestamps: List[datetime],
        dismissal_timestamps: List[datetime],
        last_prompt_dismissed_at: Optional[datetime] = None,
        is_session_active: bool = False
    ) -> ObserverCheckResult:
        if not self.config.enabled or not is_session_active:
            return ObserverCheckResult(should_prompt=False)

        now = datetime.now()

        # Check dismissal cooldown
        if last_prompt_dismissed_at:
            cooldown_delta = timedelta(seconds=self.config.dismissal_cooldown_seconds)
            if now - last_prompt_dismissed_at < cooldown_delta:
                return ObserverCheckResult(should_prompt=False)

        # 1. Inactivity threshold check
        if seconds_inactive >= self.config.inactivity_seconds:
            return ObserverCheckResult(
                should_prompt=True,
                trigger_reason="inactivity",
                explanation=f"Offered after {seconds_inactive}s without in-app interaction during an active focus block."
            )

        # 2. Repeated requests within window
        window_delta = timedelta(seconds=self.config.repeated_request_window_seconds)
        recent_requests = [t for t in request_timestamps if now - t < window_delta]
        if len(recent_requests) >= self.config.repeated_request_limit:
            return ObserverCheckResult(
                should_prompt=True,
                trigger_reason="repeated_requests",
                explanation="Offered after multiple intervention requests were explored in a short period."
            )

        # 3. Repeated dismissals within window
        recent_dismissals = [t for t in dismissal_timestamps if now - t < window_delta]
        if len(recent_dismissals) >= self.config.repeated_request_limit:
            return ObserverCheckResult(
                should_prompt=True,
                trigger_reason="repeated_dismissals",
                explanation="Offered after several options were dismissed, to check if a restful break is better right now."
            )

        return ObserverCheckResult(should_prompt=False)

stuck_radar_engine = StuckRadarEngine()
