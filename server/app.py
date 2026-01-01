from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room
from core.game import *

app = Flask(__name__)
app.config['SECRET_KEY'] = 'dev'
socketio = SocketIO(app, cors_allowed_origins="*")

# --- Game Management ---
games = {0:None}
player_game_map = {}

def get_game_for_player(sid):
    game_id = player_game_map.get(sid)
    if game_id:
        return games.get(game_id)
    return None

# ---------------------------
# SocketIO events
# ---------------------------
@socketio.on('connect')
def on_connect():
    sid = request.sid
    print(f"connect {sid}")
    game = Game(games.keys[-1]+1)
    games[game.id] = game
    player_game_map[sid] = game.id
    join_room(game.id)
    
    emit('connected', {'sid': sid, 'game_id': game.id})
    emit('game_state', game.to_json())

@socketio.on('join_game')
def on_join(data):
    sid = request.sid
    game_id = data.get('game_id')
    game = games.get(game_id)
    if game:
        player_game_map[sid] = game_id
        join_room(game.id)
        emit('joined', {'game_id': game.id}, to=sid)
        socketio.emit('game_state', game.to_json(), to=game.id)
    else:
        emit('error', {'reason': 'game_not_found'}, to=sid)

@socketio.on('disconnect')
def on_disconnect():
    sid = request.sid
    print(f"disconnect {sid}")
    game_id = player_game_map.pop(sid, None)
    if game_id:
        game = games.get(game_id)

# basic http endpoint
@app.route('/ping')
def ping():
    return {"ok": True}

if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=5000,debug=True)