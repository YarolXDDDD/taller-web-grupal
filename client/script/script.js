const abecedario = [' ','A','B','C','D','E','F','G','H','I','J'];
const filas = 10;
const columnas = 10;
const jugadores = 1;
let enemigos=[];

let barcos = []; // Array para guardar los barcos del jugador
let cantidadBarcos = { // Cantidad de barcos permitidos por tipo
    portaaviones: 1,
    acorazado: 1,
    crucero: 1,
    submarino: 1,
    destructor: 1
};

let powerUpActivo = null;
let puntaje = 0;
let tuTurno = false;


function crearTablero (tableros)
{
    let j=1;
    let tableroJuego= document.createElement('div');
    tableroJuego.setAttribute('class','tablero-juego');
    let tablero = document.createElement('div');
    tablero.setAttribute('class', 'tablero');
    tablero.setAttribute('id', 'tabla-p'+j)
    for (let i=0; i<=filas; i++)
    {
        let header = document.createElement('div');
        header.setAttribute('class', 'position table-head '+i);
        if (i != 0) header.innerText = i;
        tablero.appendChild(header);
        for (let k=1; k<=columnas; k++)
        {
            if (i == 0)
            {
                let celda = document.createElement('div');
                celda.setAttribute('class', 'position table-head '+abecedario[k]+i);
                celda.innerText = abecedario[k];
                tablero.appendChild(celda);
            }
            else
            {
                let celda = document.createElement('div');
                celda.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                celda.setAttribute('class', 'position table-cell');
                tablero.appendChild(celda);
            }
        }
    }
    
    let section = document.getElementById(tableros);
    let titulo= document.createElement('h2');
    if (j==1)
    {
        titulo.setAttribute('class','jugador');
        titulo.setAttribute('id','p1');
        titulo.innerText = 'Tu tablero ('+localStorage.getItem('nombreJugador')+')';
    }
    else
    {
        if (j==2)
        {
            let espacio= document.createElement('div');
            espacio.setAttribute('id', 'espacio-vacio');
            section.prepend(espacio);
        }
        let M=j-1;
        titulo.setAttribute('class','jugador');
        titulo.setAttribute('id','p'+j);
        titulo.innerText = 'Enemigo '+M;
    }
    section.prepend(tableroJuego);
    tableroJuego.appendChild(titulo);
    tableroJuego.appendChild(tablero);
}

function alterarLobby(cantidadJugadores, gameId,nombresJugadores){
    let titulo= document.getElementById('etapa');
    if (cantidadJugadores<=4)
        titulo.innerHTML='Modo de Juego: Partida de '+cantidadJugadores+' Jugadores </br>ID: '+gameId;
    else
        titulo.innerHTML='Modo de Juego: Torneo </br>ID: '+gameId;
    for (let i=1;i<=nombresJugadores.length;i++)
    {
        let jugador = document.getElementById('jugador'+i);
        jugador.innerText=nombresJugadores[i-1];
    }
        for (let j=nombresJugadores.length+1; j<=cantidadJugadores;j++)
        {
            let jugadorEliminado = document.getElementById('jugador'+j);
            jugadorEliminado.innerText='';
        }
    let restantes=document.getElementById('restantes');
    let faltantes=cantidadJugadores-nombresJugadores.length;
    if (cantidadJugadores!=nombresJugadores.length)
    restantes.innerText='('+faltantes+') restantes';
    else
    restantes.innerText='Lobby completa, el primer jugador de la lista puede iniciar la partida';
    if (localStorage.getItem('nombreJugador')!=nombresJugadores[0])
        document.getElementById('listo').style.display= 'none';
    else
        document.getElementById('listo').style.display= 'block';
}

function ocultarSeccion(id) {
    document.getElementById(id).style.display = 'none';
}

function cargarNuevaSeccion(idNuevo, idViejo, cantidadJugadores, listaJugadores, puntajes ) {
    document.getElementById(idNuevo).style.display = 'block';
    ocultarSeccion(idViejo);
    let tablerosElement = document.getElementById('tableros-creacion');
    let tablerosJugar = document.getElementById('tableros');

    if (idNuevo === 'container-tablero-barcos') {
        crearTableroCreacion(1, tablerosElement, [localStorage.getItem('nombreJugador')]);
    }

    if (idNuevo === 'container-juego') {
        crearTableroPartida(cantidadJugadores, tablerosJugar, listaJugadores);
        if (cantidadJugadores <=4) {
            document.getElementById('modo-juego').innerText = 'Partida de ' + cantidadJugadores + ' Jugadores';
        } else {
            document.getElementById('modo-juego').innerText = 'Modo Torneo';
        }
        let enemigos = '';
        for (let j = 0; j < listaJugadores.length; j++) {
            if (listaJugadores[j] != localStorage.getItem('nombreJugador')) {
                enemigos += listaJugadores[j];
                if (j != listaJugadores.length - 1) {
                    enemigos += ',';
                } else {
                    enemigos += '.';
                }
            }
        }
        document.getElementById('encabezado-enemigo').innerText = 'Tus enemigos seran:' + enemigos;
    }

    // Código para mostrar el leaderboard al volver al lobby
    if (idNuevo === 'container-lobby' && idViejo ==='container-juego') { // Verifica que 'puntajes' exista
        mostrarLeaderboard(listaJugadores, puntajes);
        document.getElementById('titulo-lobby').innerText='';
        document.getElementById('etapa').innerText='Leaderboard';
        ocultarSeccion('listo');
        document.getElementById('restantes').innerText='El torneo ha terminado! Felicidades al ganador: '+listaJugadores[0];
        return;
    }
    if (idViejo === 'container-tablero-barcos') {
        const tablero = document.querySelector('.tablero-juego');
        if (tablero) tablero.remove();
    }
    if (idViejo === 'container-lobby' || idViejo === 'container-juego') {
        for (let i = 1; i <= cantidadJugadores; i++) {
            let jugador = document.getElementById('jugador' + i);
            jugador.innerText = '';
        }
    }
    if (idViejo === 'container-juego') {
        document.getElementById('tableros').innerHTML = '';
        document.getElementById('anuncio').innerHTML = '';
    }
    if (idNuevo==='container-lobby')
        document.getElementById('titulo-leaderboard').innerText='';
}

function mostrarLeaderboard(listaJugadores, puntajes) {
    for (let i = 1; i <= listaJugadores.length; i++) {
        let jugador = document.getElementById('jugador'+ i);
            jugador.innerText = listaJugadores[i-1] + ' - ' + puntajes[i-1];
    }
}

function modificarEnemigos(listaJugadores){
    let enemigos = '';
        for (let j = 0; j < listaJugadores.length; j++) {
            if (listaJugadores[j] != localStorage.getItem('nombreJugador')) {
                enemigos += listaJugadores[j];
                if (j != listaJugadores.length - 1) {
                    enemigos += ',';
                } else {
                    enemigos += '.';
                }
            }
        }
}

function randomizador (min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function verificarPowerUp (casillaAtacada,jugadorAtacado) //Es para quien compre un powerUp para revisar cual tiene para después 'prepararlo' y posteriormente enviar la solicitud al servidor
{
    switch (powerUpActivo) {
        case 'mina-marina':
        {
            powerUpActivo = null;
            prepararPowerUp ('mina-marina');
            ws.send(JSON.stringify({ type: 'attack', gameId: localStorage.getItem('partidaActiva'), casilla: casillaAtacada, jugadorAtacado:jugadorAtacado}));
        }
        break;
        default:{
            ws.send(JSON.stringify({ type: 'attack', gameId: localStorage.getItem('partidaActiva'), casilla: casillaAtacada, jugadorAtacado:jugadorAtacado}));
        }
    }
}

function prepararPowerUp (powerUp) //Es para quien compra el powerUp
{
    switch (powerUp) {
        case 'mina-marina':
        {
            let tablaJugador = document.getElementById(localStorage.getItem('nombreJugador'));
            let tabla = tablaJugador.querySelector('.tablero');
            let casillasDisponibles = tabla.querySelectorAll('.table-cell:not(.hit, .miss, .barco)');
            let casilla = casillasDisponibles[randomizador(0, casillasDisponibles.length-1)];
            let mina = document.createElement('div');
            mina.classList.add('mina-marina');
            mina.innerHTML = '💣';
            casilla.appendChild(mina);
        }
        break;
    }
}

function activarPowerUp (powerUp, mensaje) //Es para quien compra el powerUp o si alguien se encuentra con el power-Up al intentar atacar
{
    switch (powerUp) {
        case 'mina-marina':
        {
            let mina = mensaje.casilla.querySelector('.mina-marina');
            mensaje.casilla.removeChild(mina);
            let tablaJugador = document.getElementById(mensaje.gamePlayers[mensaje.turno-1]);
            let tabla = tablaJugador.querySelector('.tablero');
            let casillasDisponibles = tabla.querySelectorAll('.table-cell:not(.hit,.miss)');
            let casilla = casillasDisponibles[randomizador(0, casillasDisponibles.length-1)];
            casilla = casilla.id;
            let atacante = mensaje.turno == 0 ? mensaje.gamePlayers[mensaje.gamePlayers.length-1] : mensaje.gamePlayers[mensaje.turno-1];
            ws.send(JSON.stringify({ type: 'mina-marina', gameId: localStorage.getItem('partidaActiva'), atacado: mensaje.casilla, propia: casilla, jugadorAtacado: localStorage.getItem('nombreJugador'), Atacante: atacante}));
        }
        break;
    }
}

function modificarAnuncio (anuncio)
{
    let anuncioActual = document.getElementById('anuncio');
    anuncioActual.innerText = anuncio;
}

function verificarPrevioAtaque(casillaId)
{
    let casilla = document.getElementById(casillaId);
    if (casilla)
    {
        let golpe = casilla.querySelector('.hit');
        if (golpe || casilla.classList.contains('miss')) return false;
        else
        return true;
    }
    else
    return true;
}

function verificarAtaque(casilla, mensaje){
    let casillaAtacada= document.getElementById(casilla);
    if (casillaAtacada)
    {
        if (casillaAtacada.querySelector('.barco'))
        {
            console.log ('Barco encontrado');
            ws.send (JSON.stringify({ type: 'player-attacked', gameId:localStorage.getItem('partidaActiva'), casilla: casilla, hit: true}));
        }
        else if(casillaAtacada.querySelector('.mina-marina'))
        {
            console.log ('mina encontrada');
            activarPowerUp('mina-marina',mensaje);
        }
        else 
        {
            console.log ('Barco no encontrado');
            ws.send (JSON.stringify({ type: 'player-attacked', gameId:localStorage.getItem('partidaActiva'),casilla: casilla, hit: false}));
        }
    }
    else
    console.error('la casilla atacada no existe');
}

function recopilarEnemigos(){
    enemigos=[];
    const tableros = document.querySelectorAll('.tablero-juego');
    tableros.forEach(tablero=>{
        if (tablero.id!=localStorage.getItem('nombreJugador'))
        {
            const extraerCeldas= tablero.querySelectorAll('.position.table-cell');
            extraerCeldas.forEach(celda=> {
                enemigos = enemigos.concat([celda]);
            })
        }
    })
}

function verificarGameOver ()
{
    let tablaJugador = document.getElementById(localStorage.getItem('nombreJugador'));
    let tabla = tablaJugador.querySelector('.tablero');
    let todosLosHits = tabla.querySelectorAll('.hit');
    if (todosLosHits.length == 17)
    {
        detenerTemporizador();
        if (localStorage.getItem('cantidadJugadores')<5)
        {
            eliminarTablas (localStorage.getItem('nombreJugador'));
            alert('Has perdido :c');
            ws.send(JSON.stringify({ type: 'player-defeat', gameId: localStorage.getItem('partidaActiva'), playerName: localStorage.getItem('nombreJugador')}));
            return true;
        }
        else
        {
            ws.send(JSON.stringify({ type: 'player-defeat-tournament', gameId: localStorage.getItem('partidaActiva'), playerName: localStorage.getItem('nombreJugador')}));
            return false;
        }
    }
    return false;
}

function manejarAtaque(event){
    const casillaAtacada = event.target.id;
    const jugadorAtacado= event.target.closest('.tablero-juego').id;
    if (!verificarPrevioAtaque(casillaAtacada)) alert ("La casilla ya ha sido atacada, ataque otra");
    else{
        detenerTemporizador();
        verificarPowerUp(casillaAtacada,jugadorAtacado);
    }
}

function asignarClicks(gamePlayers, turno) {
    if (gamePlayers[turno] === localStorage.getItem('nombreJugador')) {
        // El temporizador se inicia SIEMPRE que sea el turno del jugador
        iniciarTemporizador(() => {
            console.log("Tiempo agotado para " + localStorage.getItem('nombreJugador'));
            // Ya no se envía mensaje al servidor. Simplemente se pasa el turno.
            ws.send(JSON.stringify({ type: 'time-out', gameId: localStorage.getItem('partidaActiva'), playerName: localStorage.getItem("nombreJugador") }));
        });

        enemigos.forEach(casillaEnemiga => {
            tuTurno = true;
            casillaEnemiga.addEventListener('click', manejarAtaque);
        });
    } else {
        detenerTemporizador();
        enemigos.forEach(casillaEnemiga => {
            tuTurno = false;
            casillaEnemiga.removeEventListener('click', manejarAtaque);
        });
    }
}

function eliminarTablas(playerOut){
    console.log (playerOut);
    const tablaPlayerOut= document.getElementById(playerOut);
    if (tablaPlayerOut)
    tablaPlayerOut.remove();
}

// NUEVO CODIGO DE COLOCACION DE BARCOS

let estadoInicialSelector = []; // Variable global para guardar el estado inicial

function crearTableroCreacion(jugadores, tableros, listaJugadores) {
    puntaje = 0;
    const jugadorActual = listaJugadores.indexOf(localStorage.getItem('nombreJugador')) + 1;

    const selectorBarco = document.getElementById('selector-barco');
    const botonUnion = document.getElementById('union-game');
    const botonCreacion = document.getElementById('creacion-game');

    botonUnion.disabled = true;
    botonCreacion.disabled = true;

    if (estadoInicialSelector.length === 0) {
        for (let i = 0; i < selectorBarco.options.length; i++) {
            estadoInicialSelector.push(selectorBarco.options[i].value);
        }
    }

    selectorBarco.innerHTML = '';
    estadoInicialSelector.forEach(opcion => {
        const optionElement = document.createElement('option');
        optionElement.value = opcion;
        optionElement.text = opcion.charAt(0).toUpperCase() + opcion.slice(1);
        selectorBarco.appendChild(optionElement);
    });
    selectorBarco.disabled = false;

    for (let j = 1; j <= jugadores; j++) {
        let tableroJuego = document.createElement('div');
        tableroJuego.setAttribute('class', 'tablero-juego');
        tableroJuego.setAttribute('id', listaJugadores[j - 1]);
        let tablero = document.createElement('div');
        tablero.setAttribute('class', 'tablero');
        tablero.setAttribute('id', 'tabla-p' + j);

        for (let i = 0; i <= filas; i++) {
            let header = document.createElement('div');
            header.setAttribute('class', 'position table-head ' + i);
            if (i != 0) header.innerText = i;
            tablero.appendChild(header);

            for (let k = 1; k <= columnas; k++) {
                if (i == 0) {
                    let celda = document.createElement('div');
                    celda.setAttribute('class', 'position table-head ' + abecedario[k] + i);
                    celda.innerText = abecedario[k];
                    tablero.appendChild(celda);
                } else {
                    let celda = document.createElement('div');
                    celda.setAttribute('class', 'position table-cell');
                    celda.setAttribute('id', 'p' + j + '-' + abecedario[k] + i);

                    celda.addEventListener('click', (event) => {
                        let celdaClicada = event.target;
                        let idCelda = celdaClicada.id;

                        let tipoBarco = document.getElementById('selector-barco').value;
                        let orientacion = document.getElementById('selector-orientacion').value;

                        if (tipoBarco === '' || orientacion === '') {
                            alert('Debes seleccionar un tipo de barco y su orientación.');
                            return;
                        }

                        if (cantidadBarcos[tipoBarco] <= 0) {
                            alert('Ya has colocado todos los barcos de tipo ' + tipoBarco);
                            return;
                        }

                        if (colocarBarco(idCelda, tipoBarco, orientacion, barcos)) {
                            cantidadBarcos[tipoBarco]--;
                            actualizarTablero(barcos, tableros, 1);
                            habilitarBotonesInicio(botonUnion, botonCreacion);

                            eliminarOpcionSelector(selectorBarco, tipoBarco);

                            if (selectorBarco.options.length === 0) {
                                selectorBarco.disabled = true;
                            }
                        } else {
                            alert('No se puede colocar el barco aquí.');
                        }
                    });

                    tablero.appendChild(celda);
                }
            }
        }
        tableroJuego.appendChild(tablero);
        tableros.appendChild(tableroJuego);
    }
    actualizarTablero(barcos, tableros, jugadorActual);
}


function crearTableroPartida(jugadores, tableros, listaJugadores) {
    const jugadorActual = listaJugadores.indexOf(localStorage.getItem('nombreJugador')) + 1;

    const selectorBarco = document.getElementById('selector-barco');
    const botonUnion = document.getElementById('union-game');
    const botonCreacion = document.getElementById('creacion-game');

    botonUnion.disabled = true;
    botonCreacion.disabled = true;

    if (estadoInicialSelector.length === 0) {
        for (let i = 0; i < selectorBarco.options.length; i++) {
            estadoInicialSelector.push(selectorBarco.options[i].value);
        }
    }

    selectorBarco.innerHTML = '';
    estadoInicialSelector.forEach(opcion => {
        const optionElement = document.createElement('option');
        optionElement.value = opcion;
        optionElement.text = opcion.charAt(0).toUpperCase() + opcion.slice(1);
        selectorBarco.appendChild(optionElement);
    });
    selectorBarco.disabled = false;

    for (let j = 1; j <= jugadores; j++) {
        let tableroJuego = document.createElement('div');
        tableroJuego.setAttribute('class', 'tablero-juego');
        tableroJuego.setAttribute('id', listaJugadores[j - 1]);
        let tablero = document.createElement('div');
        tablero.setAttribute('class', 'tablero');
        tablero.setAttribute('id', 'tabla-p' + j);

        for (let i = 0; i <= filas; i++) {
            let header = document.createElement('div');
            header.setAttribute('class', 'position table-head ' + i);
            if (i != 0) header.innerText = i;
            tablero.appendChild(header);

            for (let k = 1; k <= columnas; k++) {
                if (i == 0) {
                    let celda = document.createElement('div');
                    celda.setAttribute('class', 'position table-head ' + abecedario[k] + i);
                    celda.innerText = abecedario[k];
                    tablero.appendChild(celda);
                } else {
                    let celda = document.createElement('div');
                    celda.setAttribute('class', 'position table-cell');
                    celda.setAttribute('id', 'p' + j + '-' + abecedario[k] + i);
                    tablero.appendChild(celda);
                }
            }
        }
        let titulo= document.createElement('h2');
        titulo.setAttribute('class','jugador');
        titulo.setAttribute('id','p'+j);
        j==jugadorActual ? titulo.innerText = 'Tu tablero ('+localStorage.getItem('nombreJugador')+')': titulo.innerText = listaJugadores[j-1];
        tableroJuego.appendChild(titulo)
        tableroJuego.appendChild(tablero);
        tableros.appendChild(tableroJuego);
    }
    actualizarTablero(barcos, tableros, jugadorActual);
}


function colocarBarco(idCelda, tipoBarco, orientacion, barcos) {
    let longitudBarco;
    switch (tipoBarco) {
        case 'portaaviones': longitudBarco = 5; break;
        case 'acorazado': longitudBarco = 4; break;
        case 'crucero': longitudBarco = 3; break;
        case 'submarino': longitudBarco = 3; break;
        case 'destructor': longitudBarco = 2; break;
        default: return false;
    }

    let posiciones = calcularPosiciones(idCelda, longitudBarco, orientacion);

    if (!validarPosiciones(posiciones, barcos)) {
        return false;
    }

    barcos.push({
        tipo: tipoBarco,
        orientacion: orientacion,
        posiciones: posiciones,
        hundido: false
    });
    return true;
}

function calcularPosiciones(idCelda, longitud, orientacion) {
    let posiciones = [];
    let letra = idCelda.charAt(3);
    let numero = parseInt(idCelda.charAt(4));

    for (let i = 0; i < longitud; i++) {
        let nuevaLetra = letra;
        let nuevoNumero = numero;

        if (orientacion === 'horizontal') {
            nuevaLetra = String.fromCharCode(letra.charCodeAt(0) + i);
        } else {
            nuevoNumero = numero + i;
        }
        posiciones.push(nuevaLetra + nuevoNumero);
    }
    return posiciones;
}

function validarPosiciones(posiciones, barcos) {
    for (const posicion of posiciones) {
        let letra = posicion.charAt(0);
        let numero = parseInt(posicion.charAt(1));

        if (numero < 1 || numero > filas || letra.charCodeAt(0) < 'A'.charCodeAt(0) || letra.charCodeAt(0) > 'A'.charCodeAt(0) + columnas - 1) {
            return false;
        }

        if (barcos.some(barco => barco.posiciones.some(p => p === posicion))) {
            return false;
        }
    }
    return true;
}

function actualizarTablero(barcos, tableros, jugadorActual) {
    let tablerosArray = tableros.children;
    for (const tablero of tablerosArray) {
        let celdas = tablero.querySelectorAll('.tablero .table-cell');
        celdas.forEach(celda => {
            celda.classList.remove('barco-portaaviones', 'barco-acorazado', 'barco-crucero', 'barco-submarino', 'barco-destructor', 'horizontal', 'vertical');
            while (celda.firstChild) {
                celda.removeChild(celda.firstChild);
            }
        });

        for (const barco of barcos) {
            for (let i = 0; i < barco.posiciones.length; i++) {
                const posicion = barco.posiciones[i];
                let celda = tablero.querySelector('#p'+jugadorActual+'-' + posicion);
                if (celda) {
                    let celdaBarco = document.createElement('div');
                    celdaBarco.setAttribute('class', 'position table-cell barco barco-' + barco.tipo + ' tile-' + (i + 1) + ' ' + barco.orientacion);
                    celdaBarco.setAttribute('id', posicion);
                    celda.appendChild(celdaBarco);
                }
            }
        }
    }
}

function eliminarOpcionSelector(selector, tipoBarco) {
    for (let i = 0; i < selector.options.length; i++) {
        if (selector.options[i].value === tipoBarco) {
            selector.remove(i);
            break;
        }
    }
}

function habilitarBotonesInicio(botonUnion, botonCreacion) {
    let barcosColocados = 0;
    for (const tipo in cantidadBarcos) {
        barcosColocados += (1 - cantidadBarcos[tipo]);
    }

    if (barcosColocados === 5) {
        botonUnion.disabled = false;
        botonCreacion.disabled = false;
    }
}

// Variable global para el temporizador
let temporizador;

// Función para iniciar el temporizador
function iniciarTemporizador(callback) {
    let tiempoRestante = 30;
    modificarAnuncio("Te quedan " + tiempoRestante + " segundos");

    temporizador = setInterval(() => {
        tiempoRestante--;
        modificarAnuncio("Te quedan " + tiempoRestante + " segundos");

        if (tiempoRestante < 0) {
            clearInterval(temporizador);
            modificarAnuncio("¡Tiempo agotado!");
            callback(); // Llamar al callback para pasar al siguiente turno
        }
    }, 1000);
}

// Función para detener el temporizador
function detenerTemporizador() {
    clearInterval(temporizador);
}

// function verificarHundimiento(casilla) {
//     console.log("--- INICIO verificarHundimiento ---");
//     console.log("Casilla recibida:", casilla);

//     const casillaAtacada = document.getElementById(casilla);
//     if (!casillaAtacada) {
//         console.error("Casilla no encontrada:", casilla);
//         console.log("--- FIN verificarHundimiento (Casilla no encontrada) ---");
//         return;
//     }

//     const tablero = casillaAtacada.closest('.tablero');
//     if (!tablero) {
//         console.error("Tablero no encontrado para la casilla:", casilla);
//         console.log("--- FIN verificarHundimiento (Tablero no encontrada) ---");
//         return;
//     }
//         const tableroJuego = tablero.closest('.tablero-juego');
//     if (!tableroJuego) {
//         console.error("Tablero juego no encontrado para el tablero:", tablero);
//         console.log("--- FIN verificarHundimiento (Tablero juego no encontrada) ---");
//         return;
//     }
//     const nombreJugador = tableroJuego.id;

//     console.log("Tablero verificado:", tablero.id);

//     for (const barco of barcos) {
//                 console.log("Barco actual:", barco);
//         //Verificamos que el barco pertenezca al tablero actual
//         if(barco.posiciones.some(posicion => tablero.querySelector(`#${tablero.id.substring(0,6)}-${posicion}`))){
//             console.log(`#${tablero.id.substring(0,6)}-${posicion}`);
//             let hundido = true; // Asumimos que el barco está hundido al principio
//             for (const posicion of barco.posiciones) {
//                 const celda = tablero.querySelector(`#${tablero.id.substring(0,6)}-${posicion}`);
//                 console.log("Celda verificada:", celda ? celda.id : "No encontrada");
//                 if (!celda || !celda.querySelector('.hit')) { // Si alguna celda NO tiene .hit
//                     hundido = false; // El barco NO está hundido
//                     break; // Salir del bucle interno, no es necesario seguir verificando
//                 }
//             }

//             console.log("Barco hundido?:", hundido);
//             if (hundido && !barco.hundido) { // Si todas las celdas tienen .hit y el barco no estaba hundido
//                 alert(`¡El barco de tipo ${barco.tipo} ha sido hundido en el tablero de ${nombreJugador}!`);
//                 barco.hundido = true;
//             }
//         }
//     }
//     console.log("--- FIN verificarHundimiento ---");
// }

function verificarHundimiento(casillaId,gamePlayers){
    const indice= gamePlayers.indexOf(localStorage.getItem('nombreJugador'))+1;
    for (let i=0;i<barcos.length;i++)
    {
        console.log (barcos[i].posiciones);
        console.log(casillaId);
        for (let j=0;j<barcos[i].posiciones.length;j++)
        {
            if ('p'+indice+"-"+barcos[i].posiciones[j]===casillaId)
            {
                    console.log('he entrado a verificar los barcos');
                    for (let k=0;k<barcos[i].posiciones.length;k++)
                    {
                        let casilla= document.getElementById('p'+indice+"-"+barcos[i].posiciones[k]);
                        if (!casilla.querySelector('.hit'))
                        {
                            console.log('he venido a decirte que no te hundieron');
                            return false;
                        }
                    }
                console.log('he entrado a mostrarte que te hundieron');
                ws.send(JSON.stringify({ type: 'ship-destroyed', gameId: localStorage.getItem('partidaActiva'), playerName: localStorage.getItem('nombreJugador'), tipoBarco: barcos[i].tipo}));
                return true;
            }
        }
    }
}


function alterarTablero(casilla, resultadoAtaque, gamePlayers) {
    console.log("--- INICIO alterarTablero ---");
    let casillaAtacada = document.getElementById(casilla);
    if (casillaAtacada) {
        if (resultadoAtaque) {
            puntaje += 5;
            console.log('estoy marcando como atacada la casilla:' + casilla);
            let golpe = document.createElement("div");
            golpe.classList.add("hit");
            let barcoAtacado = casillaAtacada.querySelector(".barco");
            barcoAtacado ? barcoAtacado.appendChild(golpe) : casillaAtacada.appendChild(golpe);

            verificarHundimiento(casilla,gamePlayers);

        } else {
            casillaAtacada.classList.add('miss');
            casillaAtacada.innerHTML = "❌";
        }
    }
    console.log("--- FIN alterarTablero ---");
}
