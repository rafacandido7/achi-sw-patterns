from app.infra.rabbitmq import RabbitMQ
from app.domain.position import Position
import json
from datetime import datetime

class SendPositionToQueue:
    def __init__(self, rabbitmq: RabbitMQ):
        self.rabbitmq = rabbitmq

    def execute(self, position: Position):
        if isinstance(position.timestamp, str):
            timestamp = datetime.strptime(position.timestamp, '%Y-%m-%d %H:%M:%S UTC')
            timestamp = timestamp.isoformat()
        else:
            timestamp = position.timestamp.isoformat()
        message = json.dumps({
            "plate": position.plate,
            "latitude": position.latitude,
            "longitude": position.longitude,
            "timestamp": timestamp,
            "key_type": position.key_type
        })
        self.rabbitmq.send_to_queue(message)
