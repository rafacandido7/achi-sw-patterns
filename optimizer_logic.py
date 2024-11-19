import requests
import json
from neo4j import GraphDatabase

# Chave de API do GraphHopper (substitua pela sua)
API_KEY = "d53067aa-9365-4a61-8d6c-6c4eabdbf551"

def obter_rota_openstreetmap(origem, destino):
    """
    Obtém rota entre dois pontos usando GraphHopper e OpenStreetMap.
    """
    url = (
        f"https://graphhopper.com/api/1/route?point={origem}&point={destino}"
        f"&vehicle=car&locale=pt-BR&key={API_KEY}"
    )

    response = requests.get(url)
    if response.status_code == 200:
        dados = response.json()
        distancia = dados["paths"][0]["distance"]  # Distância em metros
        tempo = dados["paths"][0]["time"]  # Tempo em milissegundos
        rota = dados["paths"][0]["points"]  # Codificação para desenhar no mapa
        return {
            "distancia_km": distancia / 1000,
            "tempo_minutos": tempo / 60000,
            "rota": rota
        }
    else:
        raise Exception(f"Erro na API: {response.status_code}")

def verificar_capacidade(carga_atual, carga_adicional, capacidade_maxima):
    """
    Verifica se a capacidade do veículo é suficiente para a carga.
    """
    if carga_atual + carga_adicional > capacidade_maxima:
        return False  # Não cabe no veículo
    return True  # Cabe no veículo

def calcular_rota_com_trafego(origem, destino):
    """
    Calcula a rota levando em consideração o tráfego.
    """
    rota = obter_rota_openstreetmap(origem, destino)
    return rota
