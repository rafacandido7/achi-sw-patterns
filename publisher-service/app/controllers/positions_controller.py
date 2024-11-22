from fastapi import APIRouter, File, UploadFile, HTTPException
from app.infra.rabbitmq import RabbitMQ
from app.domain.position import Position
from app.use_cases.process_positions_from_xlsx import ProcessPositionsFromCsvUseCase
from app.use_cases.send_position_to_queue import SendPositionToQueue

router = APIRouter()

rabbitmq = RabbitMQ()
send_position_use_case = SendPositionToQueue(rabbitmq)
process_positions_use_case = ProcessPositionsFromCsvUseCase(send_position_use_case)

@router.post("/positions/json")
async def receive_position(position: Position):
    try:
        send_position_use_case.execute(position)
        return {"message": f"Position {position.plate} sent to queue"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/position/xlsx")
async def upload_xlsx(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="O arquivo deve ser do tipo .csv")

    try:
        result = process_positions_use_case.execute(file.file)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar o arquivo: {str(e)}")
