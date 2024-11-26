package rabbitmq

import (
	"encoding/json"
	"log"
	"sync"

	"consumer-service/models"

	"github.com/streadway/amqp"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func ConnectAndConsume(cfg models.RabbitMQConfig) (*amqp.Connection, <-chan amqp.Delivery) {
	conn, err := amqp.Dial(cfg.URL)
	if err != nil {
		log.Fatalf("Erro ao conectar ao RabbitMQ: %v", err)
	}

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("Erro ao abrir canal RabbitMQ: %v", err)
	}

	msgs, err := ch.Consume(
		cfg.Queue, // queue
		"",        // consumer
		true,      // auto-ack
		false,     // exclusive
		false,     // no-local
		false,     // no-wait
		nil,       // args
	)
	if err != nil {
		log.Fatalf("Erro ao iniciar consumo: %v", err)
	}

	return conn, msgs
}

func Worker(id int, msgs <-chan amqp.Delivery, collection *mongo.Collection, wg *sync.WaitGroup) {
	defer wg.Done()

	for d := range msgs {
		var message models.Message
		if err := json.Unmarshal(d.Body, &message); err != nil {
			log.Printf("[Worker %d] Erro ao desserializar mensagem: %v", id, err)
			continue
		}

		updated, err := updateVehicleLocation(collection, message)
		if err != nil {
			log.Printf("[Worker %d] Erro ao atualizar MongoDB: %v", id, err)
		} else if !updated {
			log.Printf("[Worker %d] Placa não atualizada, não encontrada no banco de dados: %s", id, message.Plate)
		} else {
			log.Printf("[Worker %d] Placa processada com sucesso: %s", id, message.Plate)
		}
	}
}

func updateVehicleLocation(collection *mongo.Collection, message models.Message) (bool, error) {
	filter := bson.M{"plate": message.Plate}
	var vehicle bson.M
	err := collection.FindOne(nil, filter).Decode(&vehicle)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			// Veículo não encontrado
			return false, nil
		}
		// Outro erro ocorreu
		return false, err
	}

	// Atualizar os campos de localização e timestamp
	update := bson.M{
		"$set": bson.M{
			"location": bson.M{
				"type":        "Point",
				"coordinates": []float64{message.Longitude, message.Latitude},
			},
			"updatedPositionAt": message.Timestamp,
		},
	}
	_, err = collection.UpdateOne(nil, filter, update)
	if err != nil {
		return false, err
	}
	return true, nil
}
