package models

type Message struct {
	Plate     string  `json:"plate"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Timestamp string  `json:"timestamp"`
	KeyType   string  `json:"key_type"`
}
