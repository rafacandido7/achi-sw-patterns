from flask import Flask, request, jsonify
from optimizer_logic import calcular_rota_com_trafego, verificar_capacidade
from routes import criar_rota
from db import driver  # Importa o driver centralizado

app = Flask(__name__)

@app.route('/')
def home():
    return "API de Otimização de Rotas está funcionando!"

@app.route('/calcular_rota', methods=['POST'])
def calcular_rota():
    try:
        dados = request.get_json()
        origem = dados['origem']
        destino = dados['destino']
        carga = dados['carga']
        carga_adicional = dados['carga_adicional']
        capacidade_maxima = dados['capacidade_maxima']

        # Verificar capacidade
        if not verificar_capacidade(carga, carga_adicional, capacidade_maxima):
            return jsonify({"erro": "Capacidade excedida!"}), 400

        # Calcular a rota
        rota = calcular_rota_com_trafego(origem, destino)

        # Criar a rota no banco de dados
        with driver.session() as session:
            session.write_transaction(criar_rota, origem, destino, rota['distancia_km'], rota['tempo_minutos'])

        return jsonify({
            'distancia': rota['distancia_km'],
            'tempo_estimado': rota['tempo_minutos'],
            'rota': rota['rota']
        })
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
