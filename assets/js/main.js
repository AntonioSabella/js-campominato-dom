/* 
L'utente indica un livello di difficoltà in base al quale viene generata una griglia di gioco quadrata, in cui ogni cella contiene un numero tra quelli compresi in un range:
con difficoltà 1 => tra 1 e 100 (10)
con difficoltà 2 => tra 1 e 81 (9)
con difficoltà 3 => tra 1 e 49 (7)
Quando l'utente clicca su ogni cella, la cella cliccata si colora di azzurro.
*/

// Intercettiamo l'invio del form 
document.querySelector('form').addEventListener('submit', function (event) {
  // preveniamo il refresh della pagina
  event.preventDefault();

  startGame(event);
})


/**
 * Starts the game
 * @param {object} event Dom event
 */
function startGame(event) {
  // seleziona il livello 
  const level = event.target[0].value;
  console.log(level);

  // Costruire la griglia in base al livello di difficoltà prescelto
  //level === 'easy'
  let cells_number, cols_number;
   //Sfruttiamo lo switch case per mostrare il formato di griglia adatto
  switch (level) {
    case 'easy':
      cells_number = 100;
      cols_number = 10; // 10 x 10
      break;
    case 'medium':
      cells_number = 81;
      cols_number = 9; // 9 x 9
      break;
    case 'hard':
      cells_number = 49;
      cols_number = 7; // 7 x 7
      break;
  }
  const bombs = generateBombs(1, cells_number)
  const sortedBomps = bombs
  console.log(sortedBomps.sort((a, b) => a - b));

  //console.log(cells_number, cols_number);
  generate_grid(cells_number, cols_number);
  selectCells('.cell', 'selected', bombs) //<--- bombs = numeri random da 1 a 100 | 1 a 81 | 1 a 49
  window.level = cells_number //<-- creo una nuova voce nell'oggetto principale window cosi posso prendere il numero di celle.
}

/**
 * Generate the game grid
 * 
 * cells_number = 100, cols_number = 10
 * @param {number} cells_number The cells Numbner to generate
 * @param {number} cols_number the number of columns and rows
 */
function generate_grid(cells_number, cols_number) {

  /* Da fare in fase di refactoring: Estrarre il selettore e trasformarlo in un parametro della funzione */
  const gameAreaElement = document.querySelector('main .cells')

  // pulire area di gioco all'introduzione di una nuova griglia
  gameAreaElement.innerHTML = ''


  for (let i = 1; i <= cells_number; i++) {
    // creare l'elemento della dom (cella) da inserire nell'area di gioco
    /* Da fare in fase di refactoring: Estrarre il selettore e trasformarlo in un parametro della funzione */
    const cell = document.createElement('div')
    // appendere alla cella il numero progressivo generato nel ciclo
    cell.append(i)
    cell.classList.add('cell')
    // dimensionare la cella in base alla misura della griglia
    cell.style.width = `calc(100% / ${cols_number})`


    // appendere la cella all'area di gioco
    gameAreaElement.append(cell)

  }

}

/* Quando l'utente clicca su ogni cella, la cella cliccata si colora di azzurro. */
// Rivalutare il processo logico e la concatenazione di funzione per strutturare il codice in modo differente ottenendo lo stesso risultato
/**
 * Handle cell click event
 * @param {string} css_selector Css selector
 * @param {string} css_class css class name
 */
function selectCells(css_selector, css_class, bombs) {

  // 1. selezionare tutte le celle querySelectorAll
  const cells = document.querySelectorAll(css_selector) // <-- .cell
  console.log(cells); // <-- [cell1, cell2, cell3 ...]
  const attempts = [] // Initialize empty array to store attempts
  // 2. ciclare tra gli elementi della dom
  for (let i = 0; i < cells.length; i++) {
    const cellElemnt = cells[i];
    //console.log(cellElemnt);

    // 3. attacchare l'event listener all'elemento della dom (cell)
    /* Qui usiamo una funzione di callback (per poter poi rimuovere l'event listener) invece di una funzione anonima. 
    Per passare alla callback dei parametri come facciamo normalmente con le funzioni
    possiamo aggiungere al nodo della dom dei campi extra e assegnare i valori di cui abbiamo bisogno per far funzionare la logica della funzione di callback handleClick() */
    cellElemnt.addEventListener('click', handleClick); // <-- function (event){}
    // add to the dom element the list of bombs, the css class and the number of attempts so we can use these values as the callback parameters
    cellElemnt.bombs = bombs; // <-- qui passiamo la lista di bombe per poi verificare se l'utente ne seleziona una
    cellElemnt.css_class = css_class; // <-- qui passiamo la classe css da applicare quando un elemento non bomba viene selezionato
    cellElemnt.attempts = attempts; // <-- qui passiamo l'array per tener traccia dei tentativi
  }
}
/**
 * ### Call back function
 * This is used in the event listener of the selectCells() function
 * @param {object} event Dom Event
 */
function handleClick(event) {
  /* Nella funzione di callback abbiamo sempre accesso ad un parametro che contiene l'oggetto che rappresenta l'evento della dom scatenato al click. Qui lo chiamo 'event' ma puo chiamarsi anche in altro modo */

  console.log(event); // <-- questo é l'evento (contiene molte proprietá tra cui 'target')
  const bombs = event.target.bombs // <-- da target possiamo estrarre la lista di bombe (salvate prima in bombs)
  const css_class = event.target.css_class // <-- la classe css da applicare alle selezioni
  const attempts = event.target.attempts // <-- la lista di tentativi
  //console.log(bombs, css_class, attempts);
  console.log(this); // <-- nella funzione di callback il this fa riferimento all'oggetto della dom che ha scatenato l'evento della DOM (la cella selezionata)

  /* In seguito l'utente clicca su una cella:
  se il numero è presente nella lista dei numeri generati - abbiamo calpestato una bomba */
  const cell_value = Number(this.innerText) //<-- posso usare il this pre prendere l'innerText della cella selezionata
  console.log(cell_value);
  console.log(bombs, 'list of bombs');
  /* Da sopra prendiamo la lista di bombe e verifichiamo se contiene il numero di questa cella selezionata */
  if (bombs.includes(cell_value)) {
    /* La partita termina quando: il giocatore clicca su una bomba */
    console.log('Game Over! 💣');
    this.style.backgroundColor = 'red';
    //this.style.color = 'yellow';

    game_over(bombs, attempts) //<-- se siamo qui dentro il gioco deve terminare (vedi funzione game_over())
  } else {
    this.classList.add(css_class) //<-- se siamo qui invece possiamo andare avanti e la cella si colora di blue
    if (!attempts.includes(this.innerText)) {
      attempts.push(this.innerText) // <-- e aggiungiamo il numero della cella alla lista di tentativi fatti
    }
  }

  /* La partita termina quando:
    raggiunge il numero massimo possibile di numeri consentiti. */
  console.log(attempts);
  /* ho bisogno del numero di celle presenti per calcolare da qui il massimo dei tentativi che posso fare:
  ho due opzioni: 1) selezioni tutte le celle con querySelectorAll e prendo la lunghezza dell'array 2) nella funzione start quando ho selezionato il livello aggiungo all'oggetto window una voce dove salvo il numero di celle totali del livello scelto | preferisco la seconda */
  /* const total_cells = document.querySelectorAll('.cell').length;
  console.log(total_cells); */
  if (attempts.length === (window.level - bombs.length)) {
    game_over(bombs, attempts)
  }

}
/**
 * Ends the game 
 * This shows the bombs and the final score
 * @param {array} bombs The bombs array
 * @param {array} attempts The number of attempts
 */
function game_over(bombs, attempts) {
  // show all bombs and remove event listener
  const cells = document.querySelectorAll('.cell') // <-- selezioniamo tutte le celle
  const max_attempts = cells.length - bombs.length // <-- qui uso cells.length ma potrei usare anche window.level come fatto sopra.

  //console.log(max_attempts);
  /* Terminiamo il gioco mostrando tutte le bombe e impedendo all'utente di cliccare le altre celle. 
  Cicliamo tra tutte le celle*/
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    // remove event listner
    cell.removeEventListener('click', handleClick) //<-- per togliere l'event listener si puó usare removeEventListener() ma per farlo bisogna passare come parametri l'evento da rimuovere (click) e il nome della funzione di callback viene eseguita al click. 

    // show all bombs
    if (bombs.includes(Number(cell.innerText))) {
      cell.style.backgroundColor = 'red'
      cell.innerText = '💣'
    }
  }
  /*
  
  Al termine della partita il software deve comunicare il punteggio, cioè il numero di volte che l’utente ha cliccato su una cella che non era una bomba. */
  if (max_attempts === attempts.length) {
    alert('You Win!! 🥳🥳🥳' + ` Score:${attempts.length}/${max_attempts}`)
  } else {
    alert('Try Again!' + ` Score:${attempts.length}/${max_attempts}`)
  }
}

/* Il computer deve generare 16 numeri casuali nello stesso range della difficoltà prescelta: le bombe :bomb:. 
I numeri nella lista delle bombe non possono essere duplicati.
*/

/**
 * Generates a random number between min and max
 * @param {number} min The minimum number to generate
 * @param {number} max The maximun number to generate
 * @returns {number}
 */
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns an array of random numbers between min and max values
 * @param {number} min The minimun number to generate the bombs from
 * @param {number} max the max number to generate the bombs from
 * @returns {array}
 */
function generateBombs(min, max) {
  const bombs = [] //<-- alla fine 16 numberi
  while (bombs.length !== 16) {
    const bomb = getRndInteger(min, max) // <-- genera numero casuale (bomba)
    if (!bombs.includes(bomb)) { // <-- verifica se il numero generato é incluso o no
      bombs.push(bomb)
    }
  }
  return bombs
}

//console.log(generateBombs(1, 100)) // <--- max 100, 81, 49