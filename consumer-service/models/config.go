package models

type RabbitMQConfig struct {
	URL   string
	Queue string
}

type MongoDBConfig struct {
	URL        string
	Database   string
	Collection string
}

type Config struct {
	RabbitMQ RabbitMQConfig
	MongoDB  MongoDBConfig
}
