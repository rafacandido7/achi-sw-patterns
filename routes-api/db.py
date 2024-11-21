from neo4j import GraphDatabase
import os
from dotenv import load_dotenv

load_dotenv()

ENV = os.getenv("ENV", "local")

URI = ''

if ENV != "local":
    URI = os.getenv("NEO4J_URI")
else:
    URI = os.getenv("NEO4J_LOCAL_URI")

USER = os.getenv("NEO4J_USER")
PASSWORD = os.getenv("NEO4J_PASSWORD")

print(URI)


# Configuração da conexão com o Neo4j
# Criar o driver de conexão com o banco de dados
driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))

def fechar_conexao():
    """Fecha a conexão com o banco de dados Neo4j."""
    driver.close()
