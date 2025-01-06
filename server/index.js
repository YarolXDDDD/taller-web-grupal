import { WebSocketServer } from "ws";

const wss = new WebSocketServer({host:'0.0.0.0', port: 8080 });
const games = {};

wss.on("connection", function connection(ws) {
    ws.on("message", function message(data) {
        try{
            const message = JSON.parse(data);
            handleMessage(ws, message);
        }
        catch(error)
        {
            console.log('error al parsear el mensaje');
        }
    });
    ws.on('close', () => {
        ws.send("te saliste jaja");
        handleDisconnect(ws);
    });
    ws.send("jaja ahora jugaras batalla naval");
});

/**
 * Este es un servidor de juego multijugador simple que utiliza WebSockets para la comunicación en tiempo real.
 * El servidor admite la creación de juegos, la unión a juegos existentes, el inicio de juegos, los movimientos de los
 * jugadores, el abandono de juegos y la gestión de errores.
 */

/**
 * Registro de juegos activos.
 * Cada juego se identifica por un ID de sala único y contiene una lista de jugadores, un indicador de si el juego ha
 * comenzado y un índice de turno.
 */

/**
 * Genera un ID de sala aleatorio de 8 caracteres de longitud.
 *
 * @returns {string} - Un ID de sala generado aleatoriamente.
 */
function generateGameId() {
    return Math.random().toString(36).substring(2, 10);
}

/**
 * Maneja los mensajes recibidos a través de la conexión WebSocket.
 *
 * @param {WebSocket} ws - La conexión WebSocket del jugador.
 * @param {Object} message - El mensaje recibido.
 */
function handleMessage(ws, message) {
    // Básicamente, se intercambia un "único mensaje" que contiene un "tipo" y una carga útil adicional. Dependiendo del
    // tipo de mensaje, se realiza una acción específica. Por eso usamos un "switch":
    switch (message.type) {
        case 'create':
            // Si el mensaje es de tipo "create", se maneja la creación de un nuevo juego. Solo se necesita la conexión
            // WebSocket del jugador para crear un nuevo juego.
            handleCreateGame(ws,message.playerName);
            break;
        case 'join':
            // Para manejar la unión a un juego existente, se necesita la conexión WebSocket del jugador y el ID del
            // juego al cual el jugador se desea unir.
            handleJoinGame(ws, message.gameId,message.playerName,message.cantidadJugadores);
            break;
        case 'start':
            // Para manejar el inicio de un juego, se necesita la conexión WebSocket del jugador y el ID del juego a
            // iniciar.
            handleStartGame(ws, message.gameId);
            break;
        case 'move':
            // Para manejar los movimientos de los jugadores, se necesita la conexión WebSocket del jugador, el ID del
            // juego y el movimiento del jugador. El movimiento se reenvía a todos los jugadores en el juego.
            handleMove(ws, message.gameId, message.move);
            break;
        case 'leave':
            // Para manejar el abandono de un juego, se necesita la conexión WebSocket del jugador y el ID del juego.
            handleLeaveGame(ws, message.gameId,message.playerName);
            break;
        default:
            // Si el tipo de mensaje no es reconocido, se envía un mensaje de error al jugador.
            sendMessage(ws, { type: 'error', message: 'Unknown message type' });
    }
}

/**
 * Envía un mensaje a través de la conexión WebSocket y lo imprime en la consola.
 *
 * @param {WebSocket} ws - La conexión WebSocket del jugador.
 * @param {Object} message - El mensaje a enviar.
 */
function sendMessage(ws, message) {
    const messageString = JSON.stringify(message);
    ws.send(messageString);
    console.log(`Sent to ${ ws._socket.remoteAddress}: ${messageString}`);
}

/**
 * Maneja la creación de un nuevo juego.
 *
 * @param {WebSocket} ws - La conexión WebSocket del jugador.
 */
function handleCreateGame(ws,playerName) {
    // Se genera un ID de juego único y se crea un nuevo juego con el jugador como único participante.
    const gameId = generateGameId();
    games[gameId] = { id: gameId, players: [{ws,name:playerName}], started: false, turn: 0 };

    // Se envía un mensaje de confirmación al jugador.
    sendMessage(ws, { type: 'gameCreated', gameId });
}

/**
 * Maneja la unión a un juego existente.
 *
 * @param {WebSocket} ws - La conexión WebSocket del jugador.
 * @param {string} gameId - El ID del juego al que unirse.
 */
function handleJoinGame(ws, gameId,playerName, cantidadJugadores) {
    const game = games[gameId];
    if (!game) {
        sendMessage(ws, { type: 'error', message: 'Game not found' });
        return;
    }
    if (game.players.length >= cantidadJugadores) {
        sendMessage(ws, { type: 'error', message: 'Game is full' });
        return;
    }
    game.players.push({ws,name:playerName});
    game.players.forEach((player) => {
            sendMessage(player.ws, { type: 'playerJoined', gameId, name:playerName, playerCount: game.players.length });
    });
}

/**
 * Maneja el inicio de un juego.
 *
 * @param {WebSocket} ws - La conexión WebSocket del jugador.
 * @param {string} gameId - El ID del juego a iniciar.
 */
function handleStartGame(ws, gameId,cantidadJugadores) {
    const game = games[gameId];
    if (!game) {
        sendMessage(ws, { type: 'error', message: 'Game not found' });
        return;
    }
    if (game.started) {
        sendMessage(ws, { type: 'error', message: 'Game already started' });
        return;
    }
    if (game.players.length < cantidadJugadores) {
        sendMessage(ws, { type: 'error', message: 'Not enough players to start' });
        return;
    }
    game.started = true;
    game.players.forEach((player) => {
            sendMessage(player.ws, { type: 'gameStarted', gameId });
    });
}

/**
 * Maneja los movimientos de los jugadores.
 *
 * @param {WebSocket} ws - La conexión WebSocket del jugador.
 * @param {string} gameId - El ID del juego.
 * @param {string} move - El movimiento del jugador.
 */
function handleMove(ws, gameId, move) {
    const game = games[gameId];
    if (!game) {
        sendMessage(ws, { type: 'error', message: 'Game not found' });
        return;
    }
    if (!game.started) {
        sendMessage(ws, { type: 'error', message: 'Game not started' });
        return;
    }
    if (game.players[game.turn] !== ws) {
        sendMessage(ws, { type: 'error', message: 'Not your turn' });
        return;
    }
    game.players.forEach((player) => {
        if (player !== ws) {
            sendMessage(player.ws, { type: 'move', gameId, move });
        }
    });
    sendMessage(ws, { type: 'move', gameId, move });
    game.turn = (game.turn + 1) % game.players.length;
}

/**
 * Maneja el abandono de un juego.
 *
 * @param {WebSocket} ws - La conexión WebSocket del jugador.
 * @param {string} gameId - El ID del juego.
 */
function handleLeaveGame(ws, gameId,playerName) {
    if (!gameId) {
        sendMessage(ws, { type: 'error', message: 'No game ID specified' });
        return;
    }

    const game = games[gameId];

    if (!game) {
        sendMessage(ws, { type: 'error', message: `No game found with ID "${gameId}"` });
        return;
    }

    game.players = game.players.filter((player) => player !== ws);

    if (game.players.length === 0) {
        delete games[gameId];
    } else {
        game.players.forEach((player) =>
            sendMessage(player.ws, { type: 'playerLeft', gameId, name:playerName, playerCount: game.players.length }),
        );
    }
}

/**
 * Maneja la desconexión de un jugador.
 *
 * @param {WebSocket} ws - La conexión WebSocket del jugador.
 */
function handleDisconnect(ws) {
    for (const gameId in games) {
        const game = games[gameId];
        if (game.players.includes(ws)) {
            handleLeaveGame(ws, gameId);
            break;
        }
    }
}

// Inicia el servidor WebSocket
// Deno.serve({ hostname: '127.0.0.1', port: 8080 }, (req) => {
//     if (req.headers.get('upgrade') != 'websocket') {
//         return new Response(null, { status: 501 });
//     }

//     const { socket, response } = Deno.upgradeWebSocket(req);

//     socket.addEventListener('open', () => {
//         console.log('A client connected!');
//     });

//     socket.addEventListener('message', (event) => {
//         const message = JSON.parse(event.data);
//         handleMessage(socket, message);
//     });

//     socket.addEventListener('close', () => {
//         handleDisconnect(socket);
//     });

//     return response;
// });
