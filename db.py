from neo4j import GraphDatabase

# Configuração da conexão com o Neo4j
URI = "bolt://localhost:7687"
USER = "neo4j"
PASSWORD = "senha123"

# Criar o driver de conexão com o banco de dados
driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))

def fechar_conexao():
    """Fecha a conexão com o banco de dados Neo4j."""
    driver.close()
