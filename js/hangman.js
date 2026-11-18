// 🏁🏎️ = guessed the correct word
// 🏎️ = in progress
// 🏳️🏎️ = 1 guess left
// ❌ = ran out of guesses

const kMaxGuesses = 7;

let hint = "";

let wordArray = [];

let guesses = 0;

let wrongGuesses = 0;

let word = "";

let previousTeamElement = 0;

let gameOverFlag = false;

let randomTeamElement = 0;

const gameOverNotify = document.getElementById('game-over');

const gameStatusMessage = document.getElementById('game-status');

const hangmanEmoji = document.getElementById('hangman-emoji');

const xxxEmoji = document.getElementById('xxx');

const hintText = document.getElementById('hint-text');

const wordDisplay = document.getElementById('word-display');

const incorrectCount = document.getElementById('incorrect-count');

const answerMessage = document.getElementById('answer-message');

const letterButtons = document.getElementsByClassName('letter-btn');

const playAgainButton = document.getElementById('btn-play-again');

startNewGame();

// put the game in its initial state
function startNewGame() {

    previousTeamElement = randomTeamElement;

    gameOverNotify.hidden = true;
    
    answerMessage.hidden = true;

    gameStatusMessage.innerHTML = "Pick a letter:";

    unfade(gameStatusMessage);

    hint = "";

    wordArray = [];

    guesses = 0;

    wrongGuesses = 0;

    word = ""

    gameOverFlag = false;

    xxxEmoji.innerHTML = "";
    
    letterButtonsVisibility(true);

    playAgainButton.hidden = true;

    fetch('json/data.json')

        .then(response => response.json())

        .then(data => {

            setupGame(data);
        })
        .catch(err => console.error('Failed to load data.json', err));
}

function letterButtonsVisibility(enabled) {

    for (let i = 0; i < letterButtons.length; i++) {

        letterButtons[i].disabled = !enabled;
    }
}
function getRandomInt(max) {

    return Math.floor(Math.random() * max);
}

// retrieve data and present the game to the user
function setupGame(teams) {

    const teamElements = Object.keys(teams);      // ["MERCEDES", "MCLAREN", ...]

    const numberOfTeams = teamElements.length;

    console.log('getRandomInt = ' + getRandomInt(numberOfTeams));

    randomTeamElement = getRandomInt(numberOfTeams);  // need to be >0 in case the random int = 0

    // prevent showing same team consecutively
    while (previousTeamElement == randomTeamElement) {
        
        // console.log('getRandomInt = ' + getRandomInt(numberOfTeams));

        randomTeamElement = getRandomInt(numberOfTeams);
    }
    word = teamElements[randomTeamElement];  // "REDBULL"

    hint = teams[word];

    console.log(word, hint);  // "REDBULL" "Red, Dark Blue"

    wordArray = word.split('');

    // console.log(wordArray);
    
    hangmanEmoji.innerHTML = "🏎️";

    hintText.innerHTML = hint;

    incorrectCount.innerHTML = wrongGuesses;

    blankWordArray = [];

    wordArray.forEach(element => {

        element = "_";

        blankWordArray.push(element);
    });
    // console.log(blankWordArray);

    let htmlBlanks = ``;

    blankWordArray.forEach(element => {

        htmlBlanks += `<span class="blank-letter">${element}</span>`;
    });
    wordDisplay.innerHTML = htmlBlanks;
}

// handle letter button clicks
for (let i = 0; i < letterButtons.length; i++) {

    letterButtons[i].addEventListener('click', function(event) {

        // only allow guesses when game is not over
        if (gameOverFlag == false) {

            letterButtons[i].disabled = true;

            let letterMatch = "";

            let index = 0;

            let letterMatchIndexesArray = [];

            guesses++;

            // console.log(this.innerText)
            wordArray.forEach(element => {

                // guessed correct letter
                if (element == this.innerText) {

                    letterMatch = element;

                    letterMatchIndexesArray.push(index);
                }
                index++;
            });
            // guessed correct letter
            if (letterMatch != "") {

                letterMatchIndexesArray.forEach(element => {

                    blankWordArray[element] = letterMatch;

                    console.log(blankWordArray);
                });

                let htmlBlanks = ``;

                blankWordArray.forEach(element => {

                    htmlBlanks += `<span class="blank-letter">${element}</span>`;
                });
                wordDisplay.innerHTML = htmlBlanks;

                // done, no more blanks
                if (blankWordArray.indexOf("_") == -1) {

                    handleGameOver(true);
                }
            // guessed incorrect letter
            } else {
            
                wrongGuesses++;

                incorrectCount.innerHTML = wrongGuesses;

                xxxEmoji.innerHTML += "❌";

                if (wrongGuesses == 6) {

                    hangmanEmoji.innerHTML = "🏳️" + hangmanEmoji.innerHTML;

                    gameStatusMessage.innerHTML = "FINAL LAP";

                } else if (wrongGuesses == kMaxGuesses) {

                    handleGameOver(false);
                }
            };
        }
    })
}

function handleGameOver(winFlag) {

    gameOverFlag = true;
    
    letterButtonsVisibility(false);

    if (winFlag == true) {

        hangmanEmoji.innerHTML = "🏎️🏁";
    
        gameStatusMessage.innerHTML = "YOU TOOK THE CHECKERED FLAG!";

        // no need to display answer when user guessed correctly
        answerMessage.hidden = true;

    } else {

        hangmanEmoji.innerHTML = "🛑";
    
        gameStatusMessage.innerHTML = "You did not win.";
    
        answerMessage.innerHTML = `The answer was ${word}.`;
    
        answerMessage.hidden = false;
    
        unfade(answerMessage);
    }
    unfade(gameStatusMessage);

    gameOverNotify.hidden = false;

    unfade(gameOverNotify);

    playAgainButton.hidden = false;
}

playAgainButton.addEventListener('click', function (event) {

    startNewGame();
})

// https://stackoverflow.com/questions/6121203/how-to-do-fade-in-and-fade-out-with-javascript-and-css
function unfade(element) {

    var op = 0.1;  // initial opacity

    element.style.opacity = op;

    var timer = setInterval(function () {

        if (op >= 1){

            clearInterval(timer);
        }
        element.style.opacity = op;

        element.style.filter = 'alpha(opacity=' + op * 100 + ")";

        op += op * 0.1;

    }, 60);
}
