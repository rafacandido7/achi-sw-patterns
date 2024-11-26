package main

import (
	"log"
	"sync"

	"consumer-service/config"
	"consumer-service/mongodb"
	"consumer-service/rabbitmq"
)

func main() {
	// Carregar configurações
	cfg := config.LoadConfig()

	// Conectar ao MongoDB
	mongoClient, collection := mongodb.Connect(cfg.MongoDB)
	defer mongoClient.Disconnect(nil)

	// Conectar ao RabbitMQ e iniciar o consumo
	rabbitConn, msgs := rabbitmq.ConnectAndConsume(cfg.RabbitMQ)
	defer rabbitConn.Close()

	// Número de workers (Go routines)
	const numWorkers = 5
	var wg sync.WaitGroup

	log.Printf("Iniciando %d workers para processar mensagens", numWorkers)

	// Iniciar workers
	for i := 0; i < numWorkers; i++ {
		wg.Add(1)
		go rabbitmq.Worker(i, msgs, collection, &wg)
	}

	// Aguardar os workers finalizarem (teoricamente isso não ocorre porque o consumo é contínuo)
	wg.Wait()
}
