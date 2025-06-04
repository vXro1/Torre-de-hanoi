class NodoArbol {
    constructor(n, origen, destino, auxiliar, movimiento = null) {
        this.n = n;
        this.origen = origen;
        this.destino = destino;
        this.auxiliar = auxiliar;
        this.movimiento = movimiento;
        this.izquierda = null;
        this.derecha = null;
        this.id = Math.random().toString(36).substr(2, 9);
    }
}

class JuegoHanoi {
    constructor() {
        this.torres = [[], [], []];
        this.discoSeleccionado = null;
        this.torreSeleccionada = null;
        this.contadorMovimientos = 0;
        this.estaAutoResolviendo = false;
        this.pasosSolucion = [];
        this.pasoActual = 0;
        this.arbol = null;
        this.contadorNodos = 0;
        this.alturaArbol = 0;
        
        this.inicializarJuego();
        this.configurarEventos();
        this.dibujarArbol();
    }

    inicializarJuego() {
        const cantidadDiscos = parseInt(document.getElementById('cantidadDiscos').value);
        this.torres = [[], [], []];
        this.contadorMovimientos = 0;
        this.discoSeleccionado = null;
        this.torreSeleccionada = null;
        this.estaAutoResolviendo = false;
        this.pasosSolucion = [];
        this.pasoActual = 0;
        
        // Inicializar discos en la primera torre
        for (let i = cantidadDiscos; i >= 1; i--) {
            this.torres[0].push(i);
        }
        
        this.actualizarPantalla();
        this.actualizarEstadisticas();
        this.construirArbolSolucion(cantidadDiscos);
        this.actualizarEstadisticasArbol();
        this.dibujarArbol();
        
        document.getElementById('mensajeJuego').textContent = 'Mueve todos los discos a la Torre C';
        document.getElementById('mensajeJuego').className = '';
    }

    configurarEventos() {
        document.getElementById('botonReiniciar').addEventListener('click', () => {
            this.inicializarJuego();
        });

        document.getElementById('botonResolver').addEventListener('click', () => {
            this.autoResolver();
        });

        document.getElementById('botonPaso').addEventListener('click', () => {
            this.siguientePaso();
        });

        document.getElementById('cantidadDiscos').addEventListener('change', () => {
            this.inicializarJuego();
        });

        // Eventos para las torres
        document.querySelectorAll('.torre').forEach((torre, indice) => {
            torre.addEventListener('click', () => {
                this.manejarClicTorre(indice);
            });
        });
    }

    construirArbolSolucion(n) {
        this.contadorNodos = 0;
        this.arbol = this.construirArbolRecursivo(n, 0, 2, 1, 0);
        this.alturaArbol = this.calcularAlturaArbol(this.arbol);
        this.registrarRecorridoArbol();
    }

    construirArbolRecursivo(n, origen, destino, auxiliar, profundidad) {
        this.contadorNodos++;
        
        if (n === 1) {
            const movimiento = `Mover disco ${n} de Torre ${String.fromCharCode(65 + origen)} a Torre ${String.fromCharCode(65 + destino)}`;
            return new NodoArbol(n, origen, destino, auxiliar, movimiento);
        }

        const nodo = new NodoArbol(n, origen, destino, auxiliar);
        
        // Subproblema izquierdo: mover n-1 discos de origen a auxiliar
        nodo.izquierda = this.construirArbolRecursivo(n - 1, origen, auxiliar, destino, profundidad + 1);
        
        // Subproblema derecho: mover n-1 discos de auxiliar a destino
        nodo.derecha = this.construirArbolRecursivo(n - 1, auxiliar, destino, origen, profundidad + 1);
        
        return nodo;
    }

    calcularAlturaArbol(nodo) {
        if (!nodo) return 0;
        return 1 + Math.max(this.calcularAlturaArbol(nodo.izquierda), this.calcularAlturaArbol(nodo.derecha));
    }

    registrarRecorridoArbol() {
        const salida = document.getElementById('salidaRecorrido');
        salida.textContent = '';
        
        const registrar = (mensaje) => {
            salida.textContent += mensaje + '\n';
            salida.scrollTop = salida.scrollHeight;
        };

        registrar('=== ANÁLISIS DEL ÁRBOL BINARIO ===\n');
        registrar(`Número de discos: ${document.getElementById('cantidadDiscos').value}`);
        registrar(`Altura del árbol: ${this.alturaArbol}`);
        registrar(`Número total de nodos: ${this.contadorNodos}`);
        registrar(`Movimientos mínimos: ${Math.pow(2, parseInt(document.getElementById('cantidadDiscos').value)) - 1}\n`);
        
        registrar('=== RECORRIDO PREORDEN DEL ÁRBOL ===');
        this.recorridoPreorden(this.arbol, registrar, 0);
        
        registrar('\n=== ESTRUCTURA DEL ÁRBOL ===');
        this.imprimirEstructuraArbol(this.arbol, registrar, '', true);
    }

    recorridoPreorden(nodo, registrar, nivel) {
        if (!nodo) return;
        
        const sangria = '  '.repeat(nivel);
        if (nodo.movimiento) {
            registrar(`${sangria}HOJA: ${nodo.movimiento}`);
        } else {
            registrar(`${sangria}NODO: Hanoi(${nodo.n}, ${String.fromCharCode(65 + nodo.origen)}, ${String.fromCharCode(65 + nodo.destino)}, ${String.fromCharCode(65 + nodo.auxiliar)})`);
        }
        
        this.recorridoPreorden(nodo.izquierda, registrar, nivel + 1);
        this.recorridoPreorden(nodo.derecha, registrar, nivel + 1);
    }

    imprimirEstructuraArbol(nodo, registrar, prefijo, esUltimo) {
        if (!nodo) return;
        
        const conector = esUltimo ? '└── ' : '├── ';
        const infoNodo = nodo.movimiento ? 
            `MOVIMIENTO: ${nodo.movimiento}` : 
            `H(${nodo.n},${String.fromCharCode(65 + nodo.origen)},${String.fromCharCode(65 + nodo.destino)},${String.fromCharCode(65 + nodo.auxiliar)})`;
        
        registrar(prefijo + conector + infoNodo);
        
        if (nodo.izquierda || nodo.derecha) {
            const extension = esUltimo ? '    ' : '│   ';
            if (nodo.izquierda) {
                this.imprimirEstructuraArbol(nodo.izquierda, registrar, prefijo + extension, !nodo.derecha);
            }
            if (nodo.derecha) {
                this.imprimirEstructuraArbol(nodo.derecha, registrar, prefijo + extension, true);
            }
        }
    }

    dibujarArbol() {
        const lienzo = document.getElementById('lienzoArbol');
        const contexto = lienzo.getContext('2d');
        
        // Limpiar lienzo
        contexto.clearRect(0, 0, lienzo.width, lienzo.height);
        
        if (!this.arbol) return;
        
        // Configurar estilos
        contexto.font = '12px Arial';
        contexto.textAlign = 'center';
        
        // Dibujar el árbol
        this.dibujarNodo(contexto, this.arbol, lienzo.width / 2, 30, lienzo.width / 4, 0);
    }

    dibujarNodo(contexto, nodo, x, y, desplazamientoX, nivel) {
        if (!nodo || nivel > 3) return; // Limitar niveles para visualización
        
        const tamanoNodo = 25;
        
        // Dibujar conexiones a hijos
        if (nodo.izquierda && nivel < 3) {
            const xIzquierda = x - desplazamientoX;
            const yIzquierda = y + 80;
            
            contexto.strokeStyle = '#666';
            contexto.lineWidth = 2;
            contexto.beginPath();
            contexto.moveTo(x, y + tamanoNodo);
            contexto.lineTo(xIzquierda, yIzquierda - tamanoNodo);
            contexto.stroke();
            
            this.dibujarNodo(contexto, nodo.izquierda, xIzquierda, yIzquierda, desplazamientoX / 2, nivel + 1);
        }
        
        if (nodo.derecha && nivel < 3) {
            const xDerecha = x + desplazamientoX;
            const yDerecha = y + 80;
            
            contexto.strokeStyle = '#666';
            contexto.lineWidth = 2;
            contexto.beginPath();
            contexto.moveTo(x, y + tamanoNodo);
            contexto.lineTo(xDerecha, yDerecha - tamanoNodo);
            contexto.stroke();
            
            this.dibujarNodo(contexto, nodo.derecha, xDerecha, yDerecha, desplazamientoX / 2, nivel + 1);
        }
        
        // Dibujar nodo
        contexto.fillStyle = nodo.movimiento ? '#4CAF50' : '#2196F3';
        contexto.beginPath();
        contexto.arc(x, y, tamanoNodo, 0, 2 * Math.PI);
        contexto.fill();
        
        contexto.strokeStyle = '#fff';
        contexto.lineWidth = 2;
        contexto.stroke();
        
        // Dibujar texto del nodo
        contexto.fillStyle = '#fff';
        contexto.font = 'bold 10px Arial';
        if (nodo.movimiento) {
            contexto.fillText('MOVER', x, y - 2);
            contexto.font = '8px Arial';
            contexto.fillText(`D${nodo.n}`, x, y + 8);
        } else {
            contexto.fillText(`H(${nodo.n})`, x, y + 3);
        }
    }

    manejarClicTorre(indiceTorre) {
        if (this.estaAutoResolviendo) return;

        if (this.torreSeleccionada === null) {
            // Seleccionar disco
            if (this.torres[indiceTorre].length > 0) {
                this.torreSeleccionada = indiceTorre;
                this.discoSeleccionado = this.torres[indiceTorre][this.torres[indiceTorre].length - 1];
                this.actualizarPantalla();
            }
        } else {
            // Intentar mover disco
            if (indiceTorre === this.torreSeleccionada) {
                // Deseleccionar
                this.torreSeleccionada = null;
                this.discoSeleccionado = null;
            } else {
                // Mover disco
                if (this.esMovimientoValido(this.torreSeleccionada, indiceTorre)) {
                    this.moverDisco(this.torreSeleccionada, indiceTorre);
                    this.torreSeleccionada = null;
                    this.discoSeleccionado = null;
                } else {
                    // Movimiento inválido
                    this.mostrarMensaje('Movimiento inválido: No puedes poner un disco grande sobre uno pequeño');
                    this.torreSeleccionada = null;
                    this.discoSeleccionado = null;
                }
            }
            this.actualizarPantalla();
        }
    }

    esMovimientoValido(desdeTorre, haciaTorre) {
        if (this.torres[desdeTorre].length === 0) return false;
        if (this.torres[haciaTorre].length === 0) return true;
        
        const discoSuperiorDesde = this.torres[desdeTorre][this.torres[desdeTorre].length - 1];
        const discoSuperiorHacia = this.torres[haciaTorre][this.torres[haciaTorre].length - 1];
        
        return discoSuperiorDesde < discoSuperiorHacia;
    }

    moverDisco(desdeTorre, haciaTorre) {
        if (this.torres[desdeTorre].length === 0) return;
        
        const disco = this.torres[desdeTorre].pop();
        this.torres[haciaTorre].push(disco);
        this.contadorMovimientos++;
        
        this.actualizarEstadisticas();
        this.verificarCondicionVictoria();
        
        // Animación visual
        this.animarMovimiento(desdeTorre, haciaTorre);
    }

    animarMovimiento(desdeTorre, haciaTorre) {
        const elementoDesde = document.getElementById(`torre${desdeTorre}`);
        const elementoHacia = document.getElementById(`torre${haciaTorre}`);
        
        // Agregar clase de animación
        if (elementoDesde.lastElementChild) {
            elementoDesde.lastElementChild.classList.add('animacion-movimiento');
        }
        
        setTimeout(() => {
            this.actualizarPantalla();
        }, 400);
    }

    autoResolver() {
        if (this.estaAutoResolviendo) return;
        
        this.estaAutoResolviendo = true;
        this.pasosSolucion = [];
        this.pasoActual = 0;
        
        const cantidadDiscos = parseInt(document.getElementById('cantidadDiscos').value);
        this.generarSolucion(cantidadDiscos, 0, 2, 1);
        
        document.getElementById('botonPaso').disabled = false;
        document.getElementById('botonResolver').disabled = true;
        
        this.mostrarMensaje(`Solución generada: ${this.pasosSolucion.length} movimientos. Usa 'Paso a Paso' para ver cada movimiento.`);
    }

    generarSolucion(n, origen, destino, auxiliar) {
        if (n === 1) {
            this.pasosSolucion.push({ desde: origen, hacia: destino, disco: n });
            return;
        }
        
        this.generarSolucion(n - 1, origen, auxiliar, destino);
        this.pasosSolucion.push({ desde: origen, hacia: destino, disco: n });
        this.generarSolucion(n - 1, auxiliar, destino, origen);
    }

    siguientePaso() {
        if (this.pasoActual >= this.pasosSolucion.length) {
            this.estaAutoResolviendo = false;
            document.getElementById('botonPaso').disabled = true;
            document.getElementById('botonResolver').disabled = false;
            return;
        }
        
        const paso = this.pasosSolucion[this.pasoActual];
        this.moverDisco(paso.desde, paso.hacia);
        
        this.mostrarMensaje(`Paso ${this.pasoActual + 1}/${this.pasosSolucion.length}: Mover disco de Torre ${String.fromCharCode(65 + paso.desde)} a Torre ${String.fromCharCode(65 + paso.hacia)}`);
        
        this.pasoActual++;
        
        if (this.pasoActual >= this.pasosSolucion.length) {
            setTimeout(() => {
                this.estaAutoResolviendo = false;
                document.getElementById('botonPaso').disabled = true;
                document.getElementById('botonResolver').disabled = false;
            }, 1000);
        }
    }

    actualizarPantalla() {
        // Limpiar torres
        for (let i = 0; i < 3; i++) {
            const elementoTorre = document.getElementById(`torre${i}`);
            elementoTorre.innerHTML = '';
        }
        
        // Dibujar discos
        for (let indiceTorre = 0; indiceTorre < 3; indiceTorre++) {
            const torre = this.torres[indiceTorre];
            const elementoTorre = document.getElementById(`torre${indiceTorre}`);
            
            torre.forEach(tamanoDisco => {
                const elementoDisco = document.createElement('div');
                elementoDisco.className = `disco disco-${tamanoDisco}`;
                
                if (this.torreSeleccionada === indiceTorre && 
                    tamanoDisco === this.discoSeleccionado &&
                    torre.indexOf(tamanoDisco) === torre.length - 1) {
                    elementoDisco.classList.add('seleccionado');
                }
                
                elementoTorre.appendChild(elementoDisco);
            });
        }
    }

    actualizarEstadisticas() {
        document.getElementById('contadorMovimientos').textContent = this.contadorMovimientos;
        
        const cantidadDiscos = parseInt(document.getElementById('cantidadDiscos').value);
        const movimientosMinimos = Math.pow(2, cantidadDiscos) - 1;
        document.getElementById('movimientosMinimos').textContent = movimientosMinimos;
    }

    actualizarEstadisticasArbol() {
        document.getElementById('alturaArbol').textContent = this.alturaArbol;
        document.getElementById('contadorNodos').textContent = this.contadorNodos;
        
        const cantidadDiscos = parseInt(document.getElementById('cantidadDiscos').value);
        const complejidad = Math.pow(2, cantidadDiscos) - 1;
        document.getElementById('complejidad').textContent = complejidad;
    }

    verificarCondicionVictoria() {
        const cantidadDiscos = parseInt(document.getElementById('cantidadDiscos').value);
        if (this.torres[2].length === cantidadDiscos) {
            const movimientosMinimos = Math.pow(2, cantidadDiscos) - 1;
            const eficiencia = ((movimientosMinimos / this.contadorMovimientos) * 100).toFixed(1);
            
            this.mostrarMensaje(`¡Felicidades! Resolviste el juego en ${this.contadorMovimientos} movimientos. Eficiencia: ${eficiencia}%`, true);
        }
    }

    mostrarMensaje(mensaje, esExito = false) {
        const elementoMensaje = document.getElementById('mensajeJuego');
        elementoMensaje.textContent = mensaje;
        elementoMensaje.className = esExito ? 'mensaje-juego-exito' : '';
    }
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    const juego = new JuegoHanoi();
});