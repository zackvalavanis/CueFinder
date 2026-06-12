from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
from app.config import settings
import logging


router = APIRouter(prefix="/api/search", tags=["search"])


GOOGLE_API_KEY = settings.GOOGLE_MAPS_API_KEY


class AddressRequest(BaseModel):
    address: str


class LatLng(BaseModel):
    lat: float
    lng: float


logger = logging.getLogger(__name__)


@router.post("/geocode")
async def geocode(body: AddressRequest):
    async with httpx.AsyncClient() as client:
        res = await client.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            params={"address": body.address, "key": GOOGLE_API_KEY},
        )
    data = res.json()
    print("GEOCODE RESPONSE:", data)  # check terminal
    if data["status"] != "OK":
        raise HTTPException(status_code=400, detail=f"Geocode failed: {data['status']}")

    location = data["results"][0]["geometry"]["location"]
    return {"lat": location["lat"], "lng": location["lng"]}


@router.post("/nearby")
async def nearby(body: LatLng):
    async with httpx.AsyncClient() as client:
        res = await client.get(
            "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
            params={
                "location": f"{body.lat},{body.lng}",
                "rankby": "distance",  # replaces radius
                "keyword": "bar pool table billiards",
                "key": GOOGLE_API_KEY,
            },
        )
    data = res.json()

    if data["status"] not in ("OK", "ZERO_RESULTS"):
        raise HTTPException(status_code=400, detail="Places search failed")

    results = []
    for place in data.get("results", []):
        place_id = place.get("place_id")
        results.append(
            {
                "name": place.get("name"),
                "address": place.get("vicinity"),
                "place_id": place_id,
                "rating": place.get("rating"),
                "maps_url": f"https://www.google.com/maps/place/?q=place_id:{place_id}",
            }
        )

    return {"results": results}


@router.get("/autocomplete")
async def autocomplete(input: str):
    async with httpx.AsyncClient() as client:
        res = await client.get(
            "https://maps.googleapis.com/maps/api/place/autocomplete/json",
            params={
                "input": input,
                "types": "address",
                "key": GOOGLE_API_KEY,
            },
        )
    data = res.json()
    predictions = [
        {"description": p["description"], "place_id": p["place_id"]}
        for p in data.get("predictions", [])
    ]
    return {"predictions": predictions}
