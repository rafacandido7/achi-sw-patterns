import pika
from app.config import env

class RabbitMQ:
    def __init__(self):
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters(
                host=env.rabbitmq_host,
                port=env.rabbitmq_port,
                credentials=pika.PlainCredentials(env.rabbitmq_user, env.rabbitmq_password)
            )
        )
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue=env.rabbitmq_queue_name)

    def send_to_queue(self, message: str) -> None:
        self.channel.basic_publish(
            exchange='',
            routing_key=env.rabbitmq_queue_name,
            body=message
        )
        print(f"Sent {message} to queue")
