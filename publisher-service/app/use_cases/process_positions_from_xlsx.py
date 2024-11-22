import csv

from app.domain.position import Position
from app.use_cases.send_position_to_queue import SendPositionToQueue


class ProcessPositionsFromCsvUseCase:
    def __init__(self, send_position_use_case: SendPositionToQueue):
        self.send_position_use_case = send_position_use_case

    def validate_position(self, plate, latitude, longitude, timestamp):
        if not plate or len(plate) != 8:
            print(f"Invalid plate: {plate}. Plate must be 8 characters long.")
            return False
        try:
            latitude = float(latitude)
            longitude = float(longitude)
            if not (-90 <= latitude <= 90) or not (-180 <= longitude <= 180):
                print(f"Invalid coordinates: latitude {latitude}, longitude {longitude}.")
                return False
        except ValueError:
            print(f"Invalid latitude or longitude value: latitude {latitude}, longitude {longitude}.")
            return False
        return True

    def execute(self, file):
        added_count = 0
        file_content = file.read().decode('utf-8')
        csv_reader = csv.reader(file_content.splitlines())
        next(csv_reader)

        for row in csv_reader:
            if len(row) != 4:
                print(f"Skipping row: {row}. Row must have 4 elements.")
                continue

            latitude, longitude, plate, timestamp = row

            print(f"Processing: Plate={plate}, Latitude={latitude}, Longitude={longitude}, Timestamp={timestamp}")

            if not self.validate_position(plate, latitude, longitude, timestamp):
                continue

            position = Position(
                plate=plate,
                latitude=latitude,
                longitude=longitude,
                timestamp=timestamp,
                key_type='plate'
            )

            self.send_position_use_case.execute(position)
            added_count += 1

        return {"message": f"{added_count} items added to the queue."}
