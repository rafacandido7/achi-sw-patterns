from pydantic import BaseModel

class Position(BaseModel):
    latitude: float
    longitude: float
    timestamp: str
    plate: str
    key_type: str

    class Config:
        extra = "forbid"  # Pode ser "allow" ou "ignore", dependendo do comportamento desejado.

    def __repr__(self):
        return f"Position(latitude={self.latitude}, longitude={self.longitude}, timestamp={self.timestamp}, plate={self.plate})"
