import json
import uuid
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List, Optional

from backend.config import settings
from backend.services.serpapi_service import SerpApiService
from backend.services.scoring_service import ScoringService
from backend.services.ai_agent_service import AiAgentService

class MarketAnalysisService:
    def __init__(self):
        self.serpapi_service = SerpApiService(api_key=settings.SERPAPI_API_KEY)
        self.history_file = settings.HISTORY_FILE
        self._ensure_history_file()

    def _ensure_history_file(self):
        self.history_file.parent.mkdir(parents=True, exist_ok=True)
        if not self.history_file.exists():
            # Seed with benchmark items
            initial_history = [
                {
                    "id": "analysis-seed-1",
                    "category": "Specialty Coffee Shop",
                    "location": "Bangalore, Karnataka, India",
                    "sub_location": "Koramangala & Indiranagar",
                    "radius_km": 5.0,
                    "demographic": "College students, remote software engineers & young professionals",
                    "budget": "₹5,00,000 - ₹15,00,000",
                    "goal": "Start a Brand-New Business",
                    "date": "2026-10-04",
                    "overall_score": 82,
                    "recommendation": "ENTER",
                    "confidence": 84,
                    "is_demo": True
                },
                {
                    "id": "analysis-seed-2",
                    "category": "Artisan Sourdough Bakery",
                    "location": "Bandra West, Mumbai, India",
                    "sub_location": "Pali Hill & Perry Road",
                    "radius_km": 3.0,
                    "demographic": "Affluent health-conscious families and creatives",
                    "budget": "₹15,00,000+",
                    "goal": "Expand an Existing Business",
                    "date": "2026-10-02",
                    "overall_score": 71,
                    "recommendation": "INVESTIGATE",
                    "confidence": 80,
                    "is_demo": True
                },
                {
                    "id": "analysis-seed-3",
                    "category": "CrossFit & Functional Training Gym",
                    "location": "Hauz Khas, New Delhi, India",
                    "sub_location": "Green Park & SDA Market",
                    "radius_km": 4.5,
                    "demographic": "High net-worth urbanites & corporate professionals",
                    "budget": "₹15,00,000+",
                    "goal": "Find an Underserved Market Gap",
                    "date": "2026-09-28",
                    "overall_score": 46,
                    "recommendation": "AVOID",
                    "confidence": 89,
                    "is_demo": True
                }
            ]
            with open(self.history_file, "w", encoding="utf-8") as f:
                json.dump(initial_history, f, indent=2)

    def run_analysis(
        self,
        category: str,
        location: str,
        sub_location: str = "",
        radius_km: float = 5.0,
        demographic: str = "",
        budget: str = "₹5,00,000 - ₹15,00,000",
        goal: str = "Start a Brand-New Business",
        use_live_serpapi: bool = True
    ) -> Dict[str, Any]:
        """
        Execute full end-to-end market intelligence pipeline.
        """
        # Step 1: SerpApi Maps Competitors with accurate neighborhood geolocation
        maps_data = self.serpapi_service.fetch_maps_competitors(
            category=category,
            location=location,
            radius_km=radius_km,
            sub_location=sub_location
        )
        
        # Step 2: SerpApi Shopping Pricing
        shopping_data = self.serpapi_service.fetch_shopping_pricing(category, location)
        
        # Step 3: SerpApi Demand Trends
        demand_data = self.serpapi_service.fetch_demand_trends(category, location)
        
        # Step 4: Explainable Scoring
        scores = ScoringService.calculate_scores(maps_data, shopping_data, demand_data, goal)
        
        # Step 5: AI Synthesis
        intelligence = AiAgentService.generate_intelligence(
            category=category,
            location=location,
            demographic=demographic,
            budget=budget,
            goal=goal,
            scores=scores,
            maps_data=maps_data,
            shopping_data=shopping_data,
            demand_data=demand_data
        )

        analysis_id = f"analysis-{uuid.uuid4().hex[:8]}"
        created_at = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

        target_coords = maps_data.get("target_coordinates")
        if not target_coords:
            from backend.services.serpapi_service import get_city_coords
            target_coords = list(get_city_coords(f"{sub_location} {location}"))

        result = {
            "id": analysis_id,
            "created_at": created_at,
            "category": category,
            "location": location,
            "sub_location": sub_location,
            "radius_km": radius_km,
            "target_coordinates": target_coords,
            "demographic": demographic,
            "budget": budget,
            "goal": goal,
            "is_demo": maps_data.get("is_demo", True),
            "scores": scores,
            "competitors": maps_data.get("competitors", []),
            "pricing": shopping_data,
            "demand": demand_data,
            "intelligence": intelligence,
            "meta": {
                "engine_version": "MarketPilot Agent-Orchestrator v4.19",
                "serpapi_status": "Connected" if not maps_data.get("is_demo") else "Demo Data (Not Live)",
                "total_signals_analyzed": len(maps_data.get("competitors", [])) + len(shopping_data.get("items", [])) + 12
            }
        }

        # Save to history
        self._save_to_history(result)

        return result

    def get_history(self) -> List[Dict[str, Any]]:
        self._ensure_history_file()
        try:
            with open(self.history_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []

    def _save_to_history(self, analysis_result: Dict[str, Any]):
        history = self.get_history()
        summary_entry = {
            "id": analysis_result["id"],
            "category": analysis_result["category"],
            "location": analysis_result["location"],
            "sub_location": analysis_result.get("sub_location", ""),
            "radius_km": analysis_result.get("radius_km", 5.0),
            "demographic": analysis_result.get("demographic", ""),
            "budget": analysis_result.get("budget", ""),
            "goal": analysis_result.get("goal", ""),
            "date": analysis_result["created_at"][:10],
            "overall_score": analysis_result["scores"]["overall_score"],
            "recommendation": analysis_result["scores"]["recommendation"],
            "confidence": analysis_result["scores"]["confidence"],
            "is_demo": analysis_result.get("is_demo", True),
            "full_data": analysis_result
        }
        # Prepend latest
        history.insert(0, summary_entry)
        try:
            with open(self.history_file, "w", encoding="utf-8") as f:
                json.dump(history[:50], f, indent=2)
        except Exception as e:
            print(f"Error saving history: {e}")

    def get_analysis_by_id(self, analysis_id: str) -> Optional[Dict[str, Any]]:
        history = self.get_history()
        for item in history:
            if item.get("id") == analysis_id:
                if "full_data" in item:
                    return item["full_data"]
                return self.run_analysis(
                    category=item.get("category", "Specialty Coffee Shop"),
                    location=item.get("location", "Bangalore, India"),
                    budget=item.get("budget", "₹5,00,000 - ₹15,00,000"),
                    goal=item.get("goal", "Start a Brand-New Business")
                )
        # Default fallback
        return self.run_analysis("Specialty Coffee Shop", "Bangalore, Karnataka, India")
