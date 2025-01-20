import { WebSocketServer } from "ws";

const wss = new WebSocketServer({host:'0.0.0.0', port: 8080 });
const games = {};
const torneos={};

wss.on("connection", function connection(ws) {
    ws.on("message", function message(data) {
        try{
            const message = JSON.parse(data);
            handleMessage(ws, message);
        }
        catch(error)
        {
            console.log('error al parsear el mensaje');
            console.log(error);
        }
    });
    ws.on('close', () => {
        console.log('te has salido de batalla naval');
        handleDisconnect(ws);
    });
    console.log("ahora jugaras batalla naval");
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
        case 'join':{
            console.log(message.gameId);
            handleJoinGame(ws, message.gameId,message.playerName,message.cantidadJugadores);
        }
            // Para manejar la unión a un juego existente, se necesita la conexión WebSocket del jugador y el ID del
            // juego al cual el jugador se desea unir.
            break;
        case 'start':
            // Para manejar el inicio de un juego, se necesita la conexión WebSocket del jugador y el ID del juego a
            // iniciar.
            handleStartGame(ws, message.gameId,message.cantidadJugadores);
            break;
        case 'attack':
            // Para manejar los movimientos de los jugadores, se necesita la conexión WebSocket del jugador, el ID del
            // juego y el movimiento del jugador. El movimiento se reenvía a todos los jugadores en el juego.
            handleAttack(ws, message.gameId, message.casilla,message.jugadorAtacado);
            break;
        case 'player-attacked':
            // Para manejar los movimientos de los jugadores, se necesita la conexión WebSocket del jugador, el ID del
            // juego y el movimiento del jugador. El movimiento se reenvía a todos los jugadores en el juego.
            handleAttacked(ws, message.gameId, message.casilla,message.hit);
            break;
        case 'leave-party':
            // Para manejar el abandono de un juego, se necesita la conexión WebSocket del jugador y el ID del juego.
            handleLeaveGame(ws, message.gameId,message.playerName,'party');
            break;
        case 'leave-lobby':
                // Para manejar el abandono de un juego, se necesita la conexión WebSocket del jugador y el ID del juego.
            handleLeaveGame(ws, message.gameId,message.playerName,'lobby');
            break;
        case 'leave-tournament':
                // Para manejar el abandono de un juego, se necesita la conexión WebSocket del jugador y el ID del juego.
            handleLeaveGame(ws, message.gameId,message.playerName,'tournament');
            break;
        case 'getPlayers':
            getPlayers(ws,message.gameId);
            break;
        case 'player-defeat':
            handlePlayerDefeat(ws, message.gameId, message.playerName);
            break;
        case 'player-defeat-tournament':
            handlePlayerDefeatTournament(ws, message.gameId, message.playerName);
            break;
        case 'time-out':
            handleTimeOut(ws, message.gameId, message.playerName);
            break;
        case 'ship-destroyed':
            handleShipDestroyed(ws,message.gameId,message.playerName,message.tipoBarco);
            break;
        case 'mina-marina':
            checkearMina(ws,message.gameId,message.atacado,message.propia,message.jugadorAtacado,message.Atacante);
            break;
        case 'mina-attacked':
            handleMinaMarina(ws,message.gameId,message.casilla,message.casillaAtacada,message.hitPropio,message.jugadorAtacante,message.jugadorAtacado);
            break;
        case 'PEM-attack':
            handlePEMAttack(ws,message.gameId,message.jugadorAtacado,message.playerName);
            break;
        case 'sonar':
            handleSonar(ws,gameId,message.jugadorAtacado,message.playerName);
            break;
        case 'sonar-revealed':
            handleSonarRevealed(ws,gameId,message.playerName,message.casillaRevelada,message.jugadorAtacante);
            break;
        default:
            // Si el tipo de mensaje no es reconocido, se envía un mensaje de error al jugador.
            sendMessage(ws, { type: "error" , message: 'Mensaje desconocido'});
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
    games[gameId] = { id: gameId, players: [{ws,name:playerName, points:0}], started: false, turn: 0 };

    // Se envía un mensaje de confirmación al jugador.
    sendMessage(ws, { type: 'gameCreated', gameId, players:[{ws,name:playerName, points:0}] });
}

function getPlayers(ws, gameId) {
    const game= games[gameId];
    if (!game)
    {
        ws.send(JSON.stringify({type:'error', message: 'No se encontro la partida'}))
        return;
    }
    if (game.players.length==0)
    {
        delete games[gameId];
        return;
    }
    const gamePlayers = game.players.map(player => player.name);
    ws.send(JSON.stringify({type: 'getPlayers', gamePlayers:gamePlayers}));
}

/**
 * Maneja la unión a un juego existente.
 *
 * @param {WebSocket} ws - La conexión WebSocket del jugador.
 * @param {string} gameId - El ID del juego al que unirse.
 */
function handleJoinGame(ws, gameId,playerName, cantidadJugadores) {
    const game = games[gameId];
    console.log(games);
    if (!game) {
        sendMessage(ws, { type: 'error', message: 'El juego no ha sido encontrado' });
        return;
    }
    if (game.players.length >= cantidadJugadores) {
        sendMessage(ws, { type: 'error', message: 'El juego esta lleno' });
        return;
    }
    if (game.started) {
        sendMessage(ws, { type: 'error', message: 'el juego ya empezo' });
        return;
    }
    game.players.push({ws,name:playerName,points:0});
    const gamePlayers = game.players.map(player => player.name);
    game.players.forEach((player) => {
            sendMessage(player.ws, { type: 'playerJoined', gameId, name:playerName, gamePlayers: gamePlayers });
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
        sendMessage(ws, { type: 'error', message: 'Juego no encontrado' });
        return;
    }
    if (game.players.length < cantidadJugadores) {
        sendMessage(ws, { type: 'error', message: 'No hay suficientes jugadores para iniciar el juego' });
        return;
    }
    game.started = true;
    const gamePlayers = game.players.map(player => player.name);
    game.players.forEach((player) => {
            sendMessage(player.ws, { type: 'gameStarted', gameId, gamePlayers: gamePlayers, turno: game.turn });
    });
}

/**
 * Maneja los movimientos de los jugadores.
 *
 * @param {WebSocket} ws - La conexión WebSocket del jugador.
 * @param {string} gameId - El ID del juego.
 * @param {string} move - El movimiento del jugador.
 */
function handleAttack(ws, gameId, casilla, jugadorAtacado) {
    const game = games[gameId];
    if (!game) {
        sendMessage(ws, { type: 'error', message: 'Game not found' });
        return;
    }
    if (!game.started) {
        sendMessage(ws, { type: 'error', message: 'Game not started' });
        return;
    }
    if (game.players[game.turn].ws !== ws) {
        sendMessage(ws, { type: 'error', message: 'No es su turno, espere a los demas jugadores por favor' });
        return;
    }

    game.turn = (game.turn + 1) % game.players.length;
    const gamePlayers = game.players.map(player => player.name);
    game.players.forEach((player) => {
        if (player.name===jugadorAtacado)
        sendMessage(player.ws, { type: 'attack', gameId, casilla: casilla, gamePlayers:gamePlayers, turno: game.turn });
    });
}

function handleAttacked(ws, gameId, casilla, resultadoAtaque)
{
    const game = games[gameId];
    const gamePlayers = game.players.map(player => player.name);
    if (resultadoAtaque)
    {   
        if (game.turn==0)
            game.players[game.players.length-1].points+=5;
        else
            game.players[game.turn-1].points+=5;
    }
        const torneo=torneos[gameId];
        const playersPoints = game.players.map(player => player.points);
        game.players.forEach((player) => {
            sendMessage(player.ws, { type: 'attack-done', gameId, gamePlayers: gamePlayers, casilla:casilla, turno: game.turn, resultadoAtaque:resultadoAtaque, points:playersPoints });
        });
        if (torneo)
        {
            torneo.players.forEach((player) => {
                sendMessage(player.ws, { type: 'attack-done-espectador', gameId, gamePlayers: gamePlayers, casilla:casilla, turno: game.turn, resultadoAtaque:resultadoAtaque });
            });
        }
}

/**
 * Maneja el abandono de un juego.
 *
 * @param {WebSocket} ws - La conexión WebSocket del jugador.
 * @param {string} gameId - El ID del juego.
 */
function handleLeaveGame(ws, gameId,playerName, puntoDeSalida) {
    if (!gameId) {
        sendMessage(ws, { type: 'error', message: 'No game ID specified' });
        return;
    }

    const game = games[gameId];
    const torneo=torneos[gameId];

    if (!game) {
        sendMessage(ws, { type: 'error', message: `No game found with ID "${gameId}"` });
        return;
    }
        if (torneo)
        torneo.players = torneo.players.filter((player) => player.ws !== ws);
        game.players = game.players.filter((player) => player.ws !== ws);
        const gamePlayers = game.players.map(player => player.name);
        if (game.players.length === 0) {
            delete games[gameId];
            sendMessage(ws, { type: 'game-ended', gameId, message: 'Game ended'});
        } 
        if (torneo){
            if (torneo.players.length===0)
                delete torneos[gameId];
        }
        if (game.players.length === 1 && puntoDeSalida !='lobby') {
            if (!torneo || torneo.players.length === 0)
                sendMessage(game.players[0].ws, { type: 'victory', gameId, message: 'Game ended'});
            else
            {
                torneo.players.forEach((player) =>
                    sendMessage(player.ws, { type: 'playerLeft-party', gameId, name:playerName, gamePlayers: gamePlayers, turno: game.turn}),
                );
            }
        } else if (puntoDeSalida==='party') 
        {
            if (game.turn < game.players.length - 1) 
            game.turn++;
            else 
            game.turn = 0;
            game.players.forEach((player) =>
                sendMessage(player.ws, { type: 'playerLeft-party', gameId, name:playerName, gamePlayers: gamePlayers, turno: game.turn}),
            );
            if (torneo)
            {
                torneo.players.forEach((player) =>
                    sendMessage(player.ws, { type: 'playerLeft-party', gameId, name:playerName, gamePlayers: gamePlayers, turno: game.turn}),
                );
            }
        }
        else if (puntoDeSalida==='lobby') 
        {
            game.players.forEach((player) =>
                sendMessage(player.ws, { type: 'playerLeft-lobby', gameId, name:playerName, gamePlayers: gamePlayers }),
            );
        }
        else if (puntoDeSalida==='tournament')
        {
            game.players.forEach((player) =>
                sendMessage(player.ws, { type: 'playerLeft-party', gameId, name:playerName, gamePlayers: gamePlayers, turno: game.turn }),
            );
            if (torneo)
            {
                torneo.players.forEach((player) =>
                    sendMessage(player.ws, { type: 'playerLeft-party', gameId, name:playerName, gamePlayers: gamePlayers, turno: game.turn}),
                );
            }
        }
        else{
            const gamePlayers = game.players.map(player => player.name);
            game.players.forEach((player) =>
                sendMessage(player.ws, { type: 'playerLeft', gameId, name:playerName, gamePlayers: gamePlayers}),
            );
        }

}

function handlePlayerDefeat(ws, gameId, playerName) {

    const game= games[gameId];
    game.players = game.players.filter((player) => player.ws !== ws);
    const gamePlayers = game.players.map(player => player.name);
    if (game.players.length==1)
    {
        game.players.forEach((player) =>
                sendMessage(player.ws, { type: 'victory', gameId, name:playerName, gamePlayers: gamePlayers}),
        );
    }
    else
    {
            game.players.forEach((player) =>
                sendMessage(player.ws, { type: 'player-defeat', gameId, name:playerName, gamePlayers: gamePlayers, turno: game.turn}),
            );
    }
}

function handlePlayerDefeatTournament(ws, gameId, playerName) {

    const game= games[gameId];
    if (!game) {
        sendMessage(ws, { type: 'error', message: 'Game not found' });
        return;
    }
    if (!game.started) {
        sendMessage(ws, { type: 'error', message: 'Game not started' });
        return;
    }
    const jugadorActual= game.players.find(player => player.ws === ws);
    if (!torneos[gameId])
        torneos[gameId] = { id: gameId, players: [{ws,name:playerName, points: jugadorActual.points }] };
    else
        torneos[gameId].players.push({ws, name:playerName, points:jugadorActual.points});
    const torneo= torneos[gameId];
    game.players = game.players.filter((player) => player.ws !== ws);
    const gamePlayers = game.players.map(player => player.name);
    if (game.players.length==1)
    {
        torneo.players.push({ws:game.players[0].ws, name:game.players[0].name, points:game.players[0].points});
        delete games[gameId];
        torneo.players.sort((a, b) => b.points - a.points);
        const gamePlayersTournament = torneo.players.map(player => player.name);
        const playersPoints = torneo.players.map(player => player.points);
        torneo.players.forEach((player) =>
            sendMessage(player.ws, { type: 'end-tournament', gameId, name:playerName, gamePlayers: gamePlayersTournament, points: playersPoints}),
        );
        delete torneos[gameId];
    }
    else
    {
        if (game.turn=game.players.length)
            game.turn=0;
        game.players.forEach((player) =>
            sendMessage(player.ws, { type: 'player-defeat', gameId, name:playerName, gamePlayers: gamePlayers, turno: game.turn}),
        );
        torneo.players.forEach((player) =>
            sendMessage(player.ws, { type: 'player-defeat', gameId, name:playerName, gamePlayers: gamePlayers, turno: game.turn}),
        );
    }
}


function handleTimeOut(ws, gameId,playerName)
{
    const game=games[gameId];
    const torneo=torneos[gameId];
    const gamePlayers = game.players.map(player => player.name);
    if (game.turn==game.players.length-1)
    game.turn=0;
    else
    game.turn++;
    game.players.forEach((player) =>
        sendMessage(player.ws, { type: 'turn-passed', gameId, name:playerName, gamePlayers: gamePlayers, turno: game.turn}),
    );
    if (torneo)
    {
        torneo.players.forEach((player) =>
            sendMessage(player.ws, { type: 'turn-passed', gameId, name:playerName, gamePlayers: gamePlayers, turno: game.turn}),
        );
    }
}

function handleShipDestroyed(ws,gameId,playerName,tipoBarco)
{
    const game=games[gameId];
    const torneo=torneos[gameId];
    const gamePlayers = game.players.map(player => player.name);
    game.players.forEach((player) =>
        sendMessage(player.ws, { type: 'ship-destroyed', gameId, name:playerName, gamePlayers: gamePlayers, tipoBarco:tipoBarco}),
    );
    if (torneo)
    {
        torneo.players.forEach((player) =>
            sendMessage(player.ws, { type: 'ship-destroyed', gameId, name:playerName, gamePlayers: gamePlayers, tipoBarco:tipoBarco}),
        );
    }
}
function checkearMina(ws,gameId,casillaAtacada,casillaPropia, jugadorAtacado,jugadorAtacante)
{
    const game=games[gameId];
    const torneo=torneos[gameId];
    const gamePlayers = game.players.map(player => player.name);
    game.players.forEach((player) => {
        if (player.name===jugadorAtacante)
        sendMessage(player.ws, { type: 'attack-mina', gameId, casilla: casillaPropia, casillaAtacada:casillaAtacada, gamePlayers:gamePlayers, turno: game.turn, jugadorAtacante:jugadorAtacante, jugadorAtacado:jugadorAtacado });
    });
}
function handleMinaMarina (ws,gameId,casillaPropia,casillaAtacada, hitPropio, jugadorAtacante, jugadorAtacado)
{
    const game=games[gameId];
    const torneo=torneos[gameId];
    const gamePlayers = game.players.map(player => player.name);
    game.players.forEach((player) =>
        sendMessage(player.ws, { type: 'mina-marina', gameId, atacado: casillaAtacada, propia:casillaPropia, turno: game.turn, hitPropio:hitPropio, gamePlayers:gamePlayers, jugadorAtacante:jugadorAtacante, jugadorAtacado:jugadorAtacado}),
    );
    if (torneo)
    {
        torneo.players.forEach((player) =>
            sendMessage(player.ws, { type: 'mina-marina-espectador', gameId, atacado: casillaAtacada, propia:casillaPropia, turno: game.turn, hitPropio:hitPropio, gamePlayers:gamePlayers, jugadorAtacante:jugadorAtacante, jugadorAtacado: jugadorAtacado}),
        );
    }
}

function handlePEMAttack(ws,gameId,jugadorAtacado,playerName)
{
    const game=games[gameId];
    const gamePlayers = game.players.map(player => player.name);
    game.players.forEach((player) => {
        if (player.name===jugadorAtacado)
        sendMessage(player.ws, { type: 'PEM-attacked', gameId, name:playerName});
    });
}
function handleSonar(ws, gameId,jugadorAtacado,playerName)
{
    const game=games[gameId];
    const gamePlayers = game.players.map(player => player.name);
    game.players.forEach((player) => {
        if (player.name===jugadorAtacado)
        sendMessage(player.ws, { type: 'sonar-active', gameId, name:playerName});
    });
}

function handleSonarRevealed(ws,gameId,playerName,casillaRevelada,jugadorAtacante)
{
    const game=games[gameId];
    game.players.forEach((player) => {
        if (player.name===jugadorAtacante)
        sendMessage(player.ws, { type: 'sonar-answer', gameId, name:playerName, casilla:casillaRevelada});
    });
}
/**
 * Maneja la desconexión de un jugador.
 *
 * @param {WebSocket} ws - La conexión WebSocket del jugador.
 */
function handleDisconnect(ws) {
    for (const gameId in games) {
        const game = games[gameId];
        const torneo=torneos[gameId];
        const player = game.players.find(player => player.ws === ws);
        if (player) {
            const playerName = player.name;
            console.log('Jugador desconectado:', playerName); // Verifica el nombre
            handleLeaveGame(ws, gameId, playerName, 'disconnect');
            break;
        }
        else  if (torneo && torneo.players.find(player => player.ws === ws) ){
                const torneoPlayer= torneo.players.find(player => player.ws === ws);
                const playerTournamentName= torneoPlayer.name;
                handleLeaveGame(ws, gameId, playerTournamentName, 'disconnect');
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
