from db import driver  # Importa o driver centralizado

def criar_no(tx, nome, latitude, longitude):
    query = """
    CREATE (n:Local {nome: $nome, latitude: $latitude, longitude: $longitude})
    """
    tx.run(query, nome=nome, latitude=latitude, longitude=longitude)

# Abertura de sessão com o driver
with driver.session() as session:
    session.write_transaction(criar_no, "Av. Paulista", -23.561684, -46.625378)
    session.write_transaction(criar_no, "Praça da Sé", -23.55052, -46.633308)

print("Nós criados com sucesso!")

def criar_rota(tx, origem, destino, distancia, tempo):
    query = """
    MATCH (o:Local {nome: $origem}), (d:Local {nome: $destino})
    CREATE (o)-[:ROTA {distancia_km: $distancia, tempo_minutos: $tempo}]->(d)
    """
    tx.run(query, origem=origem, destino=destino, distancia=distancia, tempo=tempo)

def consultar_rota(tx, origem, destino):
    query = """
    MATCH (o:Local {nome: $origem})-[r:ROTA]->(d:Local {nome: $destino})
    RETURN o.nome AS origem, d.nome AS destino, r.distancia_km AS distancia, r.tempo_minutos AS tempo
    """
    result = tx.run(query, origem=origem, destino=destino)
    for record in result:
        print(f"Origem: {record['origem']}, Destino: {record['destino']}, "
              f"Distância: {record['distancia']} km, Tempo: {record['tempo']} minutos")
