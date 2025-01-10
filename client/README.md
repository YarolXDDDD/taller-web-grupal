# taller-web-grupal
Juego de Batalla Naval, hecho por Jharold Panza, Oscar Manrique y Alfredo Rondón 
para Programación Orientada a la Web, semestre sept. 2024 - enero 2025.

El servidor se encuentra desplegado en Railway, usando node.js para su implementacion
Debido a que el servidor se encuentra desplegado, para iniciar el servidor simplemente se requiere ejecutar el archivo inicio.html presente en la carpeta client(asumiendo que no hay un firewall en la red que lo bloquee, como deberia ser en la mayoria de servicios de internet publicos).
Luego, registrar su nombre y confirmarlo para poder entrar a los diferentes modos de juego (cantidad de jugadores).
Hasta ahora, solo nos enfocamos en la funcionalidad del servidor, utilizando alertas para interpretar los metodos ejecutados a
lo largo del juego. 
los procesos llevados a cabo en el servidor se imprimen en la consola del navegador.
En cuanto a funcionalidad de juego, las tablas se crean dinamicamente, pero aún no se colocan los barcos o figuras en el tablero a eleccion del jugador.
Se encuentran las funciones de unirse a partida, crear partida, abrir una partida de 1 3 o 4 jugadores o el modo torneo (el cual seria una partida de 8), la creacion de lobbys donde se ven los jugadores en partida,
la capacidad de unirse a partida, donde el primer jugador en unirse (el que creo la partida) sera el que pueda iniciarla, se puede salir de la partida tanto en el juego, eliminando su correspondiente tabla, como
en el lobby, actualizando la tabla de jugadores del lobby, no se puede unir a partidas empezadas ni a lobbys llenas, y se elimina la tabla del usuario al desconectarse


