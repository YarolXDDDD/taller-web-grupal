const abecedario = [' ','A','B','C','D','E','F','G','H','I','J'];
const filas = 10;
const columnas = 10;
const jugadores = 1;

function crearTablero ()
{
    for (let j=1; j<=jugadores; j++)
    {
        let tablero = document.createElement('div');
        tablero.setAttribute('class', 'tablero');
        tablero.setAttribute('id', 'tabla-p'+j)
        for (let i=0; i<=columnas; i++)
        {
            let header = document.createElement('div');
            header.setAttribute('class', 'position table-head '+i);
            if (i != 0)
            {
                header.innerText = i;
            }
            tablero.appendChild(header);
            for (let k=1; k<=filas; k++)
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
                    celda.setAttribute('class', 'position table-cell');
                    celda.setAttribute('id', 'p'+j+'-'+abecedario[k]+i);
                    tablero.appendChild(celda);
                }
            }
        }
        let section = document.getElementById('tableros');
        section.prepend(tablero);
    }
}

crearTablero();