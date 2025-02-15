const round = document.getElementById('round');
const simonButtons = document.getElementsByClassName('square');
const startButton = document.getElementById('startButton');

class Simon {
    constructor(simonButtons, startButton, round) {
        this.round = 0;
        this.userPosition = 0;
        this.totalRounds = 10;
        this.sequence = [];
        this.speed = 1000;
        this.blockedButtons = true;
        this.buttons = Array.from(simonButtons);
        this.display = {
            startButton,
            round
        }
        this.errorSound = new Audio('./sounds/error.wav');
        this.buttonSounds = [
            new Audio('./sounds/1.mp3'),
            new Audio('./sounds/2.mp3'),
            new Audio('./sounds/3.mp3'),
            new Audio('./sounds/4.mp3'),
        ]
    }

    // Inicia el Simon
    init() {
        this.display.startButton.onclick = () => this.startGame();
    }

    // Comienza el juego
    startGame() {
        this.display.startButton.disabled = true; 
        this.updateRound(0);
        this.userPosition = 0;
        this.sequence = this.createSequence();
        this.buttons.forEach((element, i) => {
            element.classList.remove('winner');
            element.onclick = () => this.buttonClick(i);
        });
        this.showSequence();
    }

    // Actualiza la ronda y el tablero
    updateRound(value) {
        this.round = value;
        this.display.round.textContent = `Round ${this.round}`;
    }

    // Crea el array aleatorio de botones
    createSequence() {
        return Array.from({length: this.totalRounds}, () =>  this.getRandomColor());
    }

    // Devuelve un número al azar entre 0 y 3
    getRandomColor() {
        return Math.floor(Math.random() * 4);
    }

    // Ejecuta una función cuando se hace click en un botón
    buttonClick(value) {
        !this.blockedButtons && this.validateChosenColor(value);
    }

    // Valida si el boton que toca el usuario corresponde a al valor de la secuencia
    validateChosenColor(value) {
        if(this.sequence[this.userPosition] === value) {
            this.buttonSounds[value].play();
            if(this.round === this.userPosition) {
                this.updateRound(this.round + 1);
                this.speed /= 1.02;
                this.isGameOver();
            } else {
                this.userPosition++;
            }
        } else {
            this.gameLost();
        }
    }

    // Verifica que no haya acabado el juego
    isGameOver() {
        if (this.round === this.totalRounds) {
            this.gameWon();
        } else {
            this.userPosition = 0;
            this.showSequence();
        };
    }

    // Muestra la secuencia de botones que va a tener que tocar el usuario
    showSequence() {
        this.blockedButtons = true;
        let sequenceIndex = 0;
        let timer = setInterval(() => {
            const button = this.buttons[this.sequence[sequenceIndex]];
            this.buttonSounds[this.sequence[sequenceIndex]].play();
            this.toggleButtonStyle(button)
            setTimeout( () => this.toggleButtonStyle(button), this.speed / 2)
            sequenceIndex++;
            if (sequenceIndex > this.round) {
                this.blockedButtons = false;
                clearInterval(timer);
            }
        }, this.speed);
    }

    // Pinta los botones para cuando se está mostrando la secuencia
    toggleButtonStyle(button) {
        button.classList.toggle('active');
    }

    // Actualiza el simon cuando el jugador pierde
    gameLost() {
        this.errorSound.play();
        this.display.startButton.disabled = false; 
        this.blockedButtons = true;
    }

    // Muestra la animacón de triunfo y actualiza el simon cuando el jugador gana
    gameWon() {
        this.display.startButton.disabled = false; 
        this.blockedButtons = true;
        this.buttons.forEach(element =>{
            element.classList.add('winner');
        });
        this.updateRound('🏆');
    }
    registrarNombre(nombre) {
        // 1. Verificar si el nombre ya existe en localStorage
        const nombresGuardados = localStorage.getItem('nombres');
        let nombres = nombresGuardados ? JSON.parse(nombresGuardados) : [];
      
        if (nombres.includes(nombre)) {
          // Si el nombre ya existe, puedes mostrar un mensaje o simplemente salir de la función
          console.log('El nombre "' + nombre + '" ya está registrado.');
          return;
        }
      
        // 2. Agregar el nuevo nombre al array
        nombres.push(nombre);
      
        // 3. Guardar el array actualizado en localStorage
        localStorage.setItem('nombres', JSON.stringify(nombres));
      
        console.log('Nombre "' + nombre + '" registrado correctamente.');
      }
    }


const simon = new Simon(simonButtons, startButton, round);
simon.init();


const formularioRegistro = document.getElementById('formulario-registro');

formularioRegistro.addEventListener('submit', (evento) => {
  evento.preventDefault(); // Evita que se recargue la página al enviar el formulario

  const nombreJugador = document.getElementById('nombre').value;

  if (nombreJugador.trim() !== '') {
    localStorage.setItem('nombreJugador', nombreJugador);
    // Oculta el formulario de registro y muestra el juego
    document.getElementById('registro-jugador').style.display = 'none';
    document.querySelector('.simon-container').style.display = 'block'; // Muestra el contenedor del juego
    // Aquí puedes iniciar el juego o mostrar un mensaje de bienvenida
    alert('¡Bienvenido, ' + nombreJugador + '!');
  } else {
    alert('Por favor, ingresa un nombre válido.');
  }
});
