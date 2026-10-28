import json
import logging
from typing import Optional, List
from app.config import settings
from app.schemas import InterventionRequest, InterventionResponse, StrategyRecord
from app.services.rag_engine import rag_engine

logger = logging.getLogger(__name__)

# Pre-defined deterministic fallbacks for each difficulty category
BUILTIN_GUIDANCE = {
    "beginning": {
        "acknowledgement": "Starting is often the steepest hill. It is completely normal for a blank screen to feel heavy.",
        "action_title": "The 2-Minute Physical Entry",
        "action_steps": [
            "Open the relevant document or book and set a visible timer for 2 minutes.",
            "Type or write only the title, today's date, or one imperfect sentence.",
            "When the 2 minutes end, give yourself permission to step back or keep writing if momentum sparked."
        ],
        "why_this_fits": "Shrinking the initial threshold to a low-friction action bypasses executive initiation resistance."
    },
    "overwhelm": {
        "acknowledgement": "When everything feels urgent at once, your mind naturally feels saturated. Let's create some breathing room.",
        "action_title": "Single-Track Narrowing",
        "action_steps": [
            "Write down all the competing thoughts on a scrap piece of paper so they are outside your head.",
            "Select only the single smallest sub-piece of your task and hide the rest of the paper.",
            "Focus only on this single slice for the next 15 minutes."
        ],
        "why_this_fits": "De-escalating cognitive clutter restores working memory capacity so you can focus on one tangible thing."
    },
    "perfectionism": {
        "acknowledgement": "High standards are admirable, but demanding perfection on draft one creates paralyzing resistance.",
        "action_title": "Permitted Disposable Draft",
        "action_steps": [
            "Label a new blank page 'Temporary Scratch Draft - Nobody Reads This'.",
            "Write three rough points in casual, imperfect language without editing or backspacing.",
            "Acknowledge that rough material is raw fuel you can refine later with ease."
        ],
        "why_this_fits": "Separating drafting from evaluation unlocks flow and eliminates the pressure of an initial standard."
    },
    "distraction": {
        "acknowledgement": "Attentional drift happens easily in digital study spaces. You don't need to fight it with brute willpower.",
        "action_title": "Digital Horizon Reset",
        "action_steps": [
            "Minimize all unrelated browser tabs and put your phone face-down out of arm's reach.",
            "Take one deep breath and note the immediate physical surface beneath your hands.",
            "Work on your active task in a protected 10-minute sprint."
        ],
        "why_this_fits": "Removing peripheral attentional triggers protects your finite executive reserves."
    },
    "low_energy": {
        "acknowledgement": "Your energy is low right now, and that is a valid physical reality. Pushing hard against an empty tank brings exhaustion.",
        "action_title": "Gentle Maintenance Mode",
        "action_steps": [
            "Switch from high-effort writing/calculating to gentle reviewing: skim an outline or listen to a summary.",
            "If even skimming feels heavy, visit the Reset Room or take a 10-minute rest away from screens.",
            "Remember that preserving your baseline allows higher quality work later."
        ],
        "why_this_fits": "Adapting task intensity to your current bio-energy prevents burnout and resentment."
    },
    "ineffective_approach": {
        "acknowledgement": "If pushing in one direction feels like hitting a brick wall, that wall is telling you to look for a doorway.",
        "action_title": "The Sideways Lateral Shift",
        "action_steps": [
            "Step back from the exact calculation or paragraph that isn't working.",
            "Try explaining the core concept aloud in everyday slang, or sketch a quick diagram with boxes and arrows.",
            "Check an alternate reference or lecture example to see how others framed the entry."
        ],
        "why_this_fits": "Shifting modalities (e.g. from linear text to verbal or visual sketches) activates different neural pathways."
    },
    "break": {
        "acknowledgement": "You asked for a break, and we fully honor that. Rest is an essential part of productive living, not a reward you have to earn.",
        "action_title": "True Sensory Recovery",
        "action_steps": [
            "Step away from your desk and study screen completely.",
            "Drink a glass of water, look at greenery out a window, or try a gentle session in the Reset Room.",
            "Return only when you genuinely feel ready."
        ],
        "why_this_fits": "Sensory downtime allows the brain's default mode network to consolidate learning and recover stamina."
    },
    "something_else": {
        "acknowledgement": "Productivity obstacles are nuanced and unique. Let's take a calm, grounded step forward.",
        "action_title": "Calm Baseline Check-in",
        "action_steps": [
            "Take 30 seconds to breathe and ground yourself in your chair.",
            "Clarify in one sentence: 'What is the easiest single thing that would count as progress right now?'",
            "Give yourself permission to do just that one thing."
        ],
        "why_this_fits": "Grounding your current state restores agency and clarifies the next immediate horizon."
    }
}

class GeminiService:
    def __init__(self):
        self._client = None
        self._init_client()

    def _init_client(self):
        api_key = settings.GEMINI_API_KEY
        if api_key and api_key != "YOUR_GEMINI_API_KEY_HERE":
            try:
                from google import genai
                self._client = genai.Client(api_key=api_key)
                logger.info("Google GenAI client successfully initialized.")
            except Exception as e:
                logger.warning(f"Could not initialize Google GenAI client: {e}")
                self._client = None
        else:
            self._client = None

    def is_configured(self) -> bool:
        return self._client is not None

    def generate_intervention(
        self,
        request: InterventionRequest,
        retrieved_strategies: List[StrategyRecord]
    ) -> InterventionResponse:
        """
        Generates an intervention either via Gemini Developer API (if configured)
        or via the robust built-in RAG guidance fallback.
        """
        # Normalize difficulty
        raw_diff = request.difficulty.lower()
        diff_key = "something_else"
        for key in BUILTIN_GUIDANCE.keys():
            if key in raw_diff or raw_diff in key:
                diff_key = key
                break

        strategy_ids = [s.id for s in retrieved_strategies]

        # Check if Gemini client is active
        if not self._client:
            return self._build_fallback(
                diff_key=diff_key,
                request=request,
                retrieved_strategies=retrieved_strategies,
                strategy_ids=strategy_ids,
                reason="Gemini API key is not configured. Using local built-in guidance."
            )

        # Call Gemini Developer API using the official google-genai SDK
        try:
            from google.genai import types

            # Format retrieved strategies for RAG context
            strat_context = "\n".join([
                f"- Strategy [{s.id}] {s.title}: {s.explanation} Suggested Action: {s.suggested_action}"
                for s in retrieved_strategies
            ])

            task_info = f"Task: {request.task_title or 'Current study task'} (Subject: {request.task_subject or 'General'})"
            user_note = f"User note: {request.description}" if request.description else ""

            system_instruction = (
                "You are MindEase AI, an adaptive, compassionate student productivity companion. "
                "The student is encountering friction initiating or continuing their task. "
                "Guidelines: "
                "1. Offer a supportive, non-clinical tone. Do NOT diagnose medical or psychological conditions. "
                "2. Provide ONE primary, highly actionable micro-step grounded in the retrieved strategies. "
                "3. Never shame, guilt, or urge extreme marathons. "
                "4. Respond strictly in valid JSON matching the requested schema."
            )

            prompt = (
                f"Student State:\n"
                f"- Difficulty: {request.difficulty}\n"
                f"- Reported Energy: {request.energy}\n"
                f"- {task_info}\n"
                f"{user_note}\n\n"
                f"Retrieved Strategy Material (ground your suggestions in these):\n"
                f"{strat_context}\n\n"
                "Return a JSON object with these exact keys:\n"
                "- acknowledgement (1-2 sentences warmly validating the obstacle)\n"
                "- action_title (a clear, inviting name for the action)\n"
                "- action_steps (list of 2-3 concrete, realistic bullet points)\n"
                "- why_this_fits (explanation of why this fits the user's difficulty and energy)\n"
                "- strategy_ids (list of strategy IDs from the retrieved strategies you drew from)"
            )

            model_name = settings.GEMINI_MODEL or "gemini-3.5-flash-lite"
            
            response = self._client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    response_mime_type="application/json",
                    temperature=0.3,
                    max_output_tokens=600,
                ),
            )

            if response and response.text:
                data = json.loads(response.text)
                return InterventionResponse(
                    acknowledgement=data.get("acknowledgement", BUILTIN_GUIDANCE[diff_key]["acknowledgement"]),
                    action_title=data.get("action_title", BUILTIN_GUIDANCE[diff_key]["action_title"]),
                    action_steps=data.get("action_steps", BUILTIN_GUIDANCE[diff_key]["action_steps"]),
                    why_this_fits=data.get("why_this_fits", BUILTIN_GUIDANCE[diff_key]["why_this_fits"]),
                    strategy_ids=data.get("strategy_ids", strategy_ids),
                    generation_source="gemini",
                    fallback_reason=None,
                    retrieved_strategies=retrieved_strategies
                )
            else:
                raise ValueError("Empty response received from Gemini.")

        except Exception as e:
            logger.warning(f"Gemini API request encountered an error, falling back to local guidance: {e}")
            return self._build_fallback(
                diff_key=diff_key,
                request=request,
                retrieved_strategies=retrieved_strategies,
                strategy_ids=strategy_ids,
                reason=f"Gemini service notice ({type(e).__name__}). Using local built-in guidance."
            )

    def _build_fallback(
        self,
        diff_key: str,
        request: InterventionRequest,
        retrieved_strategies: List[StrategyRecord],
        strategy_ids: List[str],
        reason: str
    ) -> InterventionResponse:
        guidance = BUILTIN_GUIDANCE.get(diff_key, BUILTIN_GUIDANCE["something_else"])

        # Enhance with top retrieved strategy if available
        steps = list(guidance["action_steps"])
        if retrieved_strategies and retrieved_strategies[0].suggested_action:
            top_strat = retrieved_strategies[0]
            steps.append(f"Recommended practice ({top_strat.title}): {top_strat.suggested_action}")

        why_text = guidance["why_this_fits"]
        if request.energy == "low":
            why_text += " Configured specifically for low-battery capacity."
        elif request.energy == "high":
            why_text += " Tailored to capitalize on your current high stamina."

        return InterventionResponse(
            acknowledgement=guidance["acknowledgement"],
            action_title=guidance["action_title"],
            action_steps=steps,
            why_this_fits=why_text,
            strategy_ids=strategy_ids,
            generation_source="local_fallback",
            fallback_reason=reason,
            retrieved_strategies=retrieved_strategies
        )

gemini_service = GeminiService()
