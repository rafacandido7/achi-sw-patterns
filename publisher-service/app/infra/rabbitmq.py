import pika
from app.config import env

class RabbitMQ:
    def __init__(self):
        self.connection_params = pika.ConnectionParameters(
            host=env.rabbitmq_host,
            port=env.rabbitmq_port,
            credentials=pika.PlainCredentials(env.rabbitmq_user, env.rabbitmq_password),
            heartbeat=30
        )
        self._connect()

    def _connect(self):
        self.connection = pika.BlockingConnection(self.connection_params)
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue=env.rabbitmq_queue_name)

    def send_to_queue(self, message: str) -> None:
        try:
            if self.connection.is_closed:
                print("Conexão perdida, reconectando...")
                self._connect()

            self.channel.basic_publish(
                exchange='',
                routing_key=env.rabbitmq_queue_name,
                body=message
            )
            print(f"Sent {message} to queue")
        except pika.exceptions.AMQPError as e:
            print(f"Erro ao enviar mensagem: {e}")
            self._connect()
