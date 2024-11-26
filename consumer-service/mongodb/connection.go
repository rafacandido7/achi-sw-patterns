package mongodb

import (
	"context"
	"log"

	"consumer-service/models"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func Connect(cfg models.MongoDBConfig) (*mongo.Client, *mongo.Collection) {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(cfg.URL))
	if err != nil {
		log.Fatalf("Erro ao conectar ao MongoDB: %v", err)
	}

	collection := client.Database(cfg.Database).Collection(cfg.Collection)
	return client, collection
}
