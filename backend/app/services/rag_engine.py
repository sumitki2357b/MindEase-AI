import json
import re
from typing import List
from pathlib import Path
from app.config import settings
from app.schemas import StrategyRecord

class RAGEngine:
    def __init__(self, strategies_path: Path = settings.STRATEGIES_FILE):
        self.strategies_path = strategies_path
        self._strategies: List[StrategyRecord] = []
        self._load_strategies()

    def _load_strategies(self):
        if not self.strategies_path.exists():
            self._strategies = []
            return
        with open(self.strategies_path, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
            self._strategies = [StrategyRecord(**item) for item in raw_data]

    def get_all_strategies(self) -> List[StrategyRecord]:
        return self._strategies

    def retrieve(self, difficulty: str, description: str = "", limit: int = 3) -> List[StrategyRecord]:
        if not self._strategies:
            self._load_strategies()

        norm_diff = (difficulty or "").strip().lower().replace(" ", "_")
        # Map common human labels to canonical tags
        tag_aliases = {
            "i_don't_know_how_to_begin": "beginning",
            "the_task_feels_overwhelming": "overwhelm",
            "i'm_afraid_of_getting_it_wrong": "perfectionism",
            "i'm_distracted": "distraction",
            "i'm_mentally_tired": "low_energy",
            "my_current_approach_isn't_working": "ineffective_approach",
            "i_need_a_break": "break",
            "something_else": "beginning",
            "tired": "low_energy",
            "exhausted": "low_energy",
            "perfectionist": "perfectionism"
        }
        target_tag = tag_aliases.get(norm_diff, norm_diff)

        # Tokenize description and difficulty
        combined_text = f"{difficulty} {description}".lower()
        query_tokens = set(re.findall(r"\b\w{3,}\b", combined_text))

        scored_records: list[tuple[float, StrategyRecord]] = []

        for strat in self._strategies:
            score = 0.0

            # 1. Direct or alias difficulty tag match
            for tag in strat.difficulty_tags:
                if tag == target_tag or tag in target_tag or target_tag in tag:
                    score += 3.5
                    break

            # 2. Keyword overlap
            for kw in strat.keywords:
                kw_lower = kw.lower()
                if kw_lower in combined_text:
                    score += 1.5
                else:
                    kw_words = set(kw_lower.split())
                    if kw_words.intersection(query_tokens):
                        score += 0.8

            # 3. Text search in explanation and suggested action
            for token in query_tokens:
                if token in strat.explanation.lower():
                    score += 0.4
                if token in strat.suggested_action.lower():
                    score += 0.4

            if score > 0:
                record_copy = strat.model_copy()
                record_copy.score = round(score, 2)
                scored_records.append((score, record_copy))

        # Sort highest score first
        scored_records.sort(key=lambda x: x[0], reverse=True)

        results = [rec for _, rec in scored_records[:limit]]

        # Fallback if no matching records found
        if not results and self._strategies:
            fallback = self._strategies[0].model_copy()
            fallback.score = 1.0
            results = [fallback]

        return results

rag_engine = RAGEngine()
