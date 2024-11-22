import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    def __init__(self):
        self.rabbitmq_user = os.getenv("RABBITMQ_USER")
        self.rabbitmq_password = os.getenv("RABBITMQ_PASSWORD")
        self.rabbitmq_port = int(os.getenv("RABBITMQ_PORT"))
        self.rabbitmq_host = os.getenv("RABBITMQ_HOST")
        self.rabbitmq_local_host = os.getenv("RABBITMQ_LOCAL_HOST")
        self.rabbitmq_queue_name = os.getenv("RABBITMQ_QUEUE_NAME")

        self.env = os.getenv("ENV", "local").lower()

        if self.env != "local":
            self.rabbitmq_host = self.rabbitmq_host
        else:
            self.rabbitmq_host = self.rabbitmq_local_host

env = Config()
