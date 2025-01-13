const abecedario = [' ','A','B','C','D','E','F','G','H','I','J'];
const filas = 10;
const columnas = 10;
const jugadores = 1;
let enemigos=[];

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
                if (celda.id==='p'+j+'-C1')
                {
                        let celdaBarco= document.createElement('div');
                        celdaBarco.setAttribute('class', 'position table-cell barco barco-destructor tile-1 horizontal');
                        celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                        tablero.appendChild(celdaBarco);
                        if (j!=1)
                            celdaBarco.style.backgroundImage='none';
                }
                else if (celda.id==='p'+j+'-D1')
                {
                        let celdaBarco= document.createElement('div');
                        celdaBarco.setAttribute('class', 'position table-cell barco barco-destructor tile-2 horizontal');
                        celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                        tablero.appendChild(celdaBarco);
                        if (j!=1)
                            celdaBarco.style.backgroundImage='none';
                }
                else if (celda.id==='p'+j+'-C3')
                {
                        let celdaBarco= document.createElement('div');
                        celdaBarco.setAttribute('class', 'position table-cell barco barco-portaaviones tile-1 horizontal');
                        celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                        tablero.appendChild(celdaBarco);
                        if (j!=1)
                            celdaBarco.style.backgroundImage='none';
                }
                else if (celda.id==='p'+j+'-D3')
                {
                        let celdaBarco= document.createElement('div');
                        celdaBarco.setAttribute('class', 'position table-cell barco barco-portaaviones tile-2 horizontal');
                        celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                        tablero.appendChild(celdaBarco);
                        if (j!=1)
                            celdaBarco.style.backgroundImage='none';
                }
                else if (celda.id==='p'+j+'-E3')
                {
                        let celdaBarco= document.createElement('div');
                        celdaBarco.setAttribute('class', 'position table-cell barco barco-portaaviones tile-3 horizontal');
                        celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                        tablero.appendChild(celdaBarco);
                        if (j!=1)
                            celdaBarco.style.backgroundImage='none';
                }
                else if (celda.id==='p'+j+'-F3')
                {
                            let celdaBarco= document.createElement('div');
                            celdaBarco.setAttribute('class', 'position table-cell barco barco-portaaviones tile-4 horizontal');
                            celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                            tablero.appendChild(celdaBarco);
                            if (j!=1)
                                celdaBarco.style.backgroundImage='none';
                }
                else if (celda.id==='p'+j+'-G3')
                {
                            let celdaBarco= document.createElement('div');
                            celdaBarco.setAttribute('class', 'position table-cell barco barco-portaaviones tile-5 horizontal');
                            celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                            tablero.appendChild(celdaBarco);
                            if (j!=1)
                                celdaBarco.style.backgroundImage='none';
                }
                else if (celda.id==='p'+j+'-B5')
                {
                            let celdaBarco= document.createElement('div');
                            celdaBarco.setAttribute('class', 'position table-cell barco barco-submarino tile-1 vertical');
                            celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                            tablero.appendChild(celdaBarco);
                            if (j!=1)
                                celdaBarco.style.backgroundImage='none';
                }
                else if (celda.id==='p'+j+'-B6')
                {
                            let celdaBarco= document.createElement('div');
                            celdaBarco.setAttribute('class', 'position table-cell barco barco-submarino tile-2 vertical');
                            celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                            tablero.appendChild(celdaBarco);
                            if (j!=1)
                            celdaBarco.style.backgroundImage='none';
                }
                else if (celda.id==='p'+j+'-B7')
                {
                            let celdaBarco= document.createElement('div');
                            celdaBarco.setAttribute('class', 'position table-cell barco barco-submarino tile-3 vertical');
                            celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                            tablero.appendChild(celdaBarco);
                            if (j!=1)
                                celdaBarco.style.backgroundImage='none';
                }
                else if (celda.id==='p'+j+'-I5')
                {
                            let celdaBarco= document.createElement('div');
                            celdaBarco.setAttribute('class', 'position table-cell barco barco-crucero tile-1 vertical');
                            celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                            tablero.appendChild(celdaBarco);
                            if (j!=1)
                                celdaBarco.style.backgroundImage='none';
                }
                else if (celda.id==='p'+j+'-I6')
                {
                            let celdaBarco= document.createElement('div');
                            celdaBarco.setAttribute('class', 'position table-cell barco barco-crucero tile-2 vertical');
                            celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                            tablero.appendChild(celdaBarco);
                            if (j!=1)
                                celdaBarco.style.backgroundImage='none';
                }
                else if (celda.id==='p'+j+'-I7')
                {
                            let celdaBarco= document.createElement('div');
                            celdaBarco.setAttribute('class', 'position table-cell barco barco-crucero tile-3 vertical');
                            celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                            tablero.appendChild(celdaBarco);
                            if (j!=1)
                                celdaBarco.style.backgroundImage='none';
                }
                else if (celda.id==='p'+j+'-F6')
                {
                            let celdaBarco= document.createElement('div');
                            celdaBarco.setAttribute('class', 'position table-cell barco barco-acorazado tile-1 vertical');
                            celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                            tablero.appendChild(celdaBarco);
                            if (j!=1)
                                celdaBarco.style.backgroundImage='none';
                }
                else if (celda.id==='p'+j+'-F7')
                {
                            let celdaBarco= document.createElement('div');
                            celdaBarco.setAttribute('class', 'position table-cell barco barco-acorazado tile-2 vertical');
                            celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                            tablero.appendChild(celdaBarco);
                            if (j!=1)
                                celdaBarco.style.backgroundImage='none';

                }
                else if (celda.id==='p'+j+'-F8')
                {
                            let celdaBarco= document.createElement('div');
                            celdaBarco.setAttribute('class', 'position table-cell barco barco-acorazado tile-3 vertical');
                            celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                            tablero.appendChild(celdaBarco);
                            if (j!=1)
                                celdaBarco.style.backgroundImage='none';
                }
                else if (celda.id==='p'+j+'-F9')
                    {
                            let celdaBarco= document.createElement('div');
                            celdaBarco.setAttribute('class', 'position table-cell barco barco-acorazado tile-4 vertical');
                            celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                            tablero.appendChild(celdaBarco);
                            if (j!=1)
                            celdaBarco.style.backgroundImage='none';
                    }
                else
                {
                    celda.setAttribute('class', 'position table-cell');
                    tablero.appendChild(celda);
                }
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

function crearTableroPartida (jugadores, tableros, listaJugadores)
{
    const jugadorActual= listaJugadores.indexOf(localStorage.getItem('nombreJugador'))+1;

    for (let j=1; j<=jugadores; j++)
    {
        let tableroJuego= document.createElement('div');
        tableroJuego.setAttribute('class','tablero-juego');
        tableroJuego.setAttribute('id', listaJugadores[j-1]); 
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
                    if (celda.id==='p'+j+'-C1')
                    {
                            let celdaBarco= document.createElement('div');
                            celdaBarco.setAttribute('class', 'position table-cell barco barco-destructor tile-1 horizontal');
                            celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                            tablero.appendChild(celdaBarco);
                            if (j!=jugadorActual) celdaBarco.style.backgroundImage='none';
                    }
                    else if (celda.id==='p'+j+'-D1')
                    {
                            let celdaBarco= document.createElement('div');
                            celdaBarco.setAttribute('class', 'position table-cell barco barco-destructor tile-2 horizontal');
                            celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                            tablero.appendChild(celdaBarco);
                            if (j!=jugadorActual) celdaBarco.style.backgroundImage='none';
                    }
                    else if (celda.id==='p'+j+'-C3')
                    {
                            let celdaBarco= document.createElement('div');
                            celdaBarco.setAttribute('class', 'position table-cell barco barco-portaaviones tile-1 horizontal');
                            celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                            tablero.appendChild(celdaBarco);
                            if (j!=jugadorActual) celdaBarco.style.backgroundImage='none';
                    }
                    else if (celda.id==='p'+j+'-D3')
                    {
                            let celdaBarco= document.createElement('div');
                            celdaBarco.setAttribute('class', 'position table-cell barco barco-portaaviones tile-2 horizontal');
                            celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                            tablero.appendChild(celdaBarco);
                            if (j!=jugadorActual) celdaBarco.style.backgroundImage='none';
                    }
                    else if (celda.id==='p'+j+'-E3')
                    {
                            let celdaBarco= document.createElement('div');
                            celdaBarco.setAttribute('class', 'position table-cell barco barco-portaaviones tile-3 horizontal');
                            celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                            tablero.appendChild(celdaBarco);
                            if (j!=jugadorActual) celdaBarco.style.backgroundImage='none';
                    }
                    else if (celda.id==='p'+j+'-F3')
                    {
                                let celdaBarco= document.createElement('div');
                                celdaBarco.setAttribute('class', 'position table-cell barco barco-portaaviones tile-4 horizontal');
                                celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                                tablero.appendChild(celdaBarco);
                                if (j!=jugadorActual) celdaBarco.style.backgroundImage='none';
                    }
                    else if (celda.id==='p'+j+'-G3')
                    {
                                let celdaBarco= document.createElement('div');
                                celdaBarco.setAttribute('class', 'position table-cell barco barco-portaaviones tile-5 horizontal');
                                celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                                tablero.appendChild(celdaBarco);
                                if (j!=jugadorActual) celdaBarco.style.backgroundImage='none';
                    }
                    else if (celda.id==='p'+j+'-B5')
                    {
                                let celdaBarco= document.createElement('div');
                                celdaBarco.setAttribute('class', 'position table-cell barco barco-submarino tile-1 vertical');
                                celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                                tablero.appendChild(celdaBarco);
                                if (j!=jugadorActual) celdaBarco.style.backgroundImage='none';
                    }
                    else if (celda.id==='p'+j+'-B6')
                    {
                                let celdaBarco= document.createElement('div');
                                celdaBarco.setAttribute('class', 'position table-cell barco barco-submarino tile-2 vertical');
                                celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                                tablero.appendChild(celdaBarco);
                                if (j!=jugadorActual) celdaBarco.style.backgroundImage='none';
                    }
                    else if (celda.id==='p'+j+'-B7')
                    {
                                let celdaBarco= document.createElement('div');
                                celdaBarco.setAttribute('class', 'position table-cell barco barco-submarino tile-3 vertical');
                                celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                                tablero.appendChild(celdaBarco);
                                if (j!=jugadorActual) celdaBarco.style.backgroundImage='none';
                    }
                    else if (celda.id==='p'+j+'-I5')
                    {
                                let celdaBarco= document.createElement('div');
                                celdaBarco.setAttribute('class', 'position table-cell barco barco-crucero tile-1 vertical');
                                celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                                tablero.appendChild(celdaBarco);
                                if (j!=jugadorActual) celdaBarco.style.backgroundImage='none';
                    }
                    else if (celda.id==='p'+j+'-I6')
                    {
                                let celdaBarco= document.createElement('div');
                                celdaBarco.setAttribute('class', 'position table-cell barco barco-crucero tile-2 vertical');
                                celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                                tablero.appendChild(celdaBarco);
                                if (j!=jugadorActual) celdaBarco.style.backgroundImage='none';
                    }
                    else if (celda.id==='p'+j+'-I7')
                    {
                                let celdaBarco= document.createElement('div');
                                celdaBarco.setAttribute('class', 'position table-cell barco barco-crucero tile-3 vertical');
                                celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                                tablero.appendChild(celdaBarco);
                                if (j!=jugadorActual) celdaBarco.style.backgroundImage='none';
                    }
                    else if (celda.id==='p'+j+'-F6')
                    {
                                let celdaBarco= document.createElement('div');
                                celdaBarco.setAttribute('class', 'position table-cell barco barco-acorazado tile-1 vertical');
                                celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                                tablero.appendChild(celdaBarco);
                                if (j!=jugadorActual) celdaBarco.style.backgroundImage='none';
                    }
                    else if (celda.id==='p'+j+'-F7')
                    {
                                let celdaBarco= document.createElement('div');
                                celdaBarco.setAttribute('class', 'position table-cell barco barco-acorazado tile-2 vertical');
                                celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                                tablero.appendChild(celdaBarco);
                                if (j!=jugadorActual) celdaBarco.style.backgroundImage='none';

                    }
                    else if (celda.id==='p'+j+'-F8')
                    {
                                let celdaBarco= document.createElement('div');
                                celdaBarco.setAttribute('class', 'position table-cell barco barco-acorazado tile-3 vertical');
                                celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                                tablero.appendChild(celdaBarco);
                                if (j!=jugadorActual) celdaBarco.style.backgroundImage='none';
                    }
                    else if (celda.id==='p'+j+'-F9')
                        {
                                let celdaBarco= document.createElement('div');
                                celdaBarco.setAttribute('class', 'position table-cell barco barco-acorazado tile-4 vertical');
                                celdaBarco.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                                tablero.appendChild(celdaBarco);
                                if (j!=jugadorActual) celdaBarco.style.backgroundImage='none';
                        }
                    else
                    {
                        celda.setAttribute('class', 'position table-cell');
                        tablero.appendChild(celda);
                    }
                }
            }
        }
        
        let section = document.getElementById(tableros);
        let titulo= document.createElement('h2');
        if (j==jugadorActual)
            titulo.innerText = 'Tu tablero ('+localStorage.getItem('nombreJugador')+')';
        else
            titulo.innerText = listaJugadores[j-1];
        titulo.setAttribute('class','jugador');
        titulo.setAttribute('id','p'+j);
        section.prepend(tableroJuego);
        tableroJuego.appendChild(titulo);
        tableroJuego.appendChild(tablero);
    }
}

function alterarLobby(cantidadJugadores, gameId,nombresJugadores){
    let titulo= document.getElementById('etapa');
    if (cantidadJugadores!=8)
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
            jugadorEliminado.innerText="";
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
    document.getElementById(id).style.display = "none";
}

function cargarNuevaSeccion(idNuevo, idViejo, cantidadJugadores, listaJugadores ){
    document.getElementById(idNuevo).style.display = "block";
    ocultarSeccion(idViejo);
    if (idNuevo==='container-tablero-barcos') crearTablero('tableros-barcos');
    if (idNuevo==='container-juego')
    {
        crearTableroPartida(cantidadJugadores,'tableros',listaJugadores);
        if (cantidadJugadores!=8)
            document.getElementById('modo-juego').innerText='Partida de '+cantidadJugadores+' Jugadores';
        else
            document.getElementById('modo-juego').innerText='Modo Torneo';
        let enemigos='';
        for (let j=0;j<listaJugadores.length;j++)
        {
            if (listaJugadores[j]!=localStorage.getItem('nombreJugador'))
            {
                enemigos+=listaJugadores[j];
                if (j!=listaJugadores.length-1)
                    enemigos+=',';
                else
                    enemigos+='.';
            }
        }
        document.getElementById('encabezado-enemigo').innerText='Tus enemigos seran:'+ enemigos;
    }
    if (idViejo==='container-tablero-barcos')
    {
        const tablero= document.querySelector('.tablero-juego');
        if (tablero) tablero.remove();
    }
    if (idViejo==='container-lobby' || idViejo==='container-juego')
    {
        for (let i=1;i<=cantidadJugadores;i++)
            {
                let jugador = document.getElementById('jugador'+i);
                jugador.innerText="";
            }
    }
    if (idViejo==='container-juego') document.getElementById('tableros').innerHTML='';
}

function modificarAnuncio (anuncio)
{
    let anuncioActual = document.getElementById('anuncio');
    anuncioActual.innerText = `<h3>${anuncio}</h3>`;
}

function verificarPrevioAtaque(casilla)
{
    if (casilla.classList.contains("hit") || casilla.classList.contains("miss")) return false; 
    return true;
}

function alterarTablero(casilla, resultadoAtaque){

    let casillaAtacada= document.getElementById(casilla);
    if (casillaAtacada)
    {
        if (resultadoAtaque)
            casillaAtacada.classList.add('hit');
        else 
        {
            casillaAtacada.classList.add('miss');
            casillaAtacada.innerHTML = "❌";
        }
    }
}

function verificarAtaque(casilla){
    let casillaAtacada= document.getElementById(casilla);
    if (casillaAtacada)
    {
        if (casillaAtacada.classList.contains('barco'))
            ws.send (JSON.stringify({ type: 'player-attacked', gameId:localStorage.getItem('partidaActiva'), casilla: casilla, hit: true}));
        else 
            ws.send (JSON.stringify({ type: 'player-attacked', gameId:localStorage.getItem('partidaActiva'),casilla: casilla, hit: false}));
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

function manejarAtaque(event){
    const casillaAtacada = event.target.id;
    const jugadorAtacado= event.target.closest('.tablero-juego').id;
    console.log(jugadorAtacado);
    if (!verificarPrevioAtaque(casillaAtacada)) alert ("La casilla ya ha sido atacada, has perdido tu turno");
    ws.send(JSON.stringify({ type: 'attack', gameId: localStorage.getItem('partidaActiva'), casilla: casillaAtacada, jugadorAtacado:jugadorAtacado}));
}

function asignarClicks(gamePlayers, turno)
{
    if (gamePlayers[turno]===localStorage.getItem('nombreJugador'))
    {
        enemigos.forEach(casillaEnemiga => {
            casillaEnemiga.addEventListener('click', manejarAtaque);
        });
    }
    else 
    {
        enemigos.forEach(casillaEnemiga => {
            casillaEnemiga.removeEventListener('click', manejarAtaque);
        });
    }
}