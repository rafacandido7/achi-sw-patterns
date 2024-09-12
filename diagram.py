from diagrams import Diagram
from diagrams.onprem.database import Neo4J

with Diagram("Route Otimization", filename="route-otimization", show=True, outformat="png"):
    Neo4J("Graph Database")
