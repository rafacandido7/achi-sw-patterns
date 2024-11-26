package config

import (
	"log"
	"os"

	"consumer-service/models"

	"github.com/joho/godotenv"
)

func LoadConfig() models.Config {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Erro ao carregar .env: %v", err)
	}

	return models.Config{
		RabbitMQ: models.RabbitMQConfig{
			URL:   os.Getenv("RABBITMQ_URL"),
			Queue: os.Getenv("RABBITMQ_QUEUE"),
		},
		MongoDB: models.MongoDBConfig{
			URL:        os.Getenv("MONGODB_URL"),
			Database:   os.Getenv("MONGODB_DATABASE"),
			Collection: os.Getenv("MONGODB_COLLECTION"),
		},
	}
}
