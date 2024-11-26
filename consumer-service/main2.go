package main

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/streadway/amqp"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type RabbitMQConfig struct {
	URL   string
	Queue string
}

type MongoDBConfig struct {
	URL        string
	Database   string
	Collection string
}

type Message struct {
	Plate     string  `json:"plate"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Timestamp string  `json:"timestamp"`
	KeyType   string  `json:"key_type"`
}

func main2() {
	// Carregar variáveis de ambiente
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Erro ao carregar .env: %v", err)
	}

	rabbitMQConfig := RabbitMQConfig{
		URL:   os.Getenv("RABBITMQ_URL"),
		Queue: os.Getenv("RABBITMQ_QUEUE"),
	}
	mongoDBConfig := MongoDBConfig{
		URL:        os.Getenv("MONGODB_URL"),
		Database:   os.Getenv("MONGODB_DATABASE"),
		Collection: os.Getenv("MONGODB_COLLECTION"),
	}

	// Conectar ao MongoDB
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(mongoDBConfig.URL))
	if err != nil {
		log.Fatalf("Erro ao conectar ao MongoDB: %v", err)
	}
	defer client.Disconnect(context.TODO())
	collection := client.Database(mongoDBConfig.Database).Collection(mongoDBConfig.Collection)

	// Conectar ao RabbitMQ
	conn, err := amqp.Dial(rabbitMQConfig.URL)
	if err != nil {
		log.Fatalf("Erro ao conectar ao RabbitMQ: %v", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("Erro ao abrir canal RabbitMQ: %v", err)
	}
	defer ch.Close()

	msgs, err := ch.Consume(
		rabbitMQConfig.Queue, // queue
		"",                   // consumer
		true,                 // auto-ack
		false,                // exclusive
		false,                // no-local
		false,                // no-wait
		nil,                  // args
	)
	if err != nil {
		log.Fatalf("Erro ao iniciar consumo: %v", err)
	}

	log.Println("Esperando mensagens da fila...")

	for d := range msgs {
		var message Message
		if err := json.Unmarshal(d.Body, &message); err != nil {
			log.Printf("Erro ao desserializar mensagem: %v", err)
			continue
		}

		// Verificar se a placa existe no MongoDB
		filter := bson.M{"plate": message.Plate}
		var vehicle bson.M
		err := collection.FindOne(context.TODO(), filter).Decode(&vehicle)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				log.Printf("Placa não encontrada: %s", message.Plate)
				continue
			}
			log.Printf("Erro ao buscar no MongoDB: %v", err)
			continue
		}

		// Atualizar localização e timestamp no MongoDB
		update := bson.M{
			"$set": bson.M{
				"location": bson.M{
					"type":        "Point",
					"coordinates": []float64{message.Longitude, message.Latitude},
				},
				"updatedPositionAt": time.Now(),
			},
		}
		_, err = collection.UpdateOne(context.TODO(), filter, update)
		if err != nil {
			log.Printf("Erro ao atualizar MongoDB para placa %s: %v", message.Plate, err)
		} else {
			log.Printf("Placa atualizada com sucesso: %s", message.Plate)
		}
	}
}
