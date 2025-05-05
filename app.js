const qwerty = document.getElementById("qwerty");
const phrase = document.getElementById("phrase");
const startButton = document.querySelector(".btn__reset");
const phraseList = phrase.querySelector("ul");
const overlay = document.querySelector("#overlay");
const title = document.querySelector("#overlay h2");
const phraseUl = document.querySelector("#phrase ul");
const letters = document.querySelectorAll("#phrase ul li");
const letter = document.querySelectorAll(".letter");

let missed = 0;

// Declare and initialize the phrases array, storing at least five strings that contain only letters and spaces, no punctuation.
const phrases = [
  "cupcake",
  "juxtaposition",
  "cat overlords",
  "cryptid",
  "jabberwocky",
  "jean luc picard",
  "onomatopoeia",
];

// Function to animate letters fading in one after another
const animateLetters = () => {
  phraseUl.style.display = "inline-block";
  // Get all the letter and space elements
  const elements = document.querySelectorAll("#phrase ul li");

  // Define the delay and increment for each subsequent letter
  const baseDelay = 150;
  const incrementDelay = 150;

  // Apply animation to each element with increasing delay
  elements.forEach((element, index) => {
    // Initial opacity 0
    element.style.opacity = "0";
    element.style.transform = "translateY(-100px)";
    element.style.transition = "all .25s ease-in";

    // Calculate delay based on position
    const delay = baseDelay + index * incrementDelay;

    // Set timeout to fade in the letter after the calculated delay
    setTimeout(() => {
      element.style.opacity = "1";
      element.style.transform = "translateY(0px)";
    }, delay);
  });
};

// Return a random phrase from an array
const getRandomPhraseAsArray = (arr) => {
  //Create a variable to store a random number based on the length of the array
  const randomIndex = Math.floor(Math.random() * arr.length);

  // Return the array element at the random index
  return arr[randomIndex];
};

// Adds the letters of a string to the display
const addPhraseToDisplay = (phrase) => {
  phraseUl.innerHTML = "";
  // Convert the phrase to an array of characters
  const chars = phrase.split("");

  // Loop through the array of characters
  chars.forEach((char) => {
    // Create a list item
    const li = document.createElement("li");

    // Put the character inside the list item
    li.textContent = char;

    // Check if the character is a letter or a space
    if (char === " ") {
      // Add the "space" class if it's a space
      li.className = "space";
    } else {
      // Add the 'letter' class if it's a letter
      li.className = "letter";
    }

    // Append the list item to phraseUl
    phraseUl.appendChild(li);
  });
};

// Check if a letter is in the phrase with a parameter for the button that gets clicked.
const checkLetter = (button) => {
  // Store all of the li elements in a variable inside checkLetter
  const letters = document.querySelectorAll("#phrase ul li");

  // Get the letter from the clicked button
  const clickedBtn = button.textContent.toLowerCase();

  // Create a variable to store if a match is found and give it an initial value of null
  let match = null;

  // Loop through all li elements in the phrase to check for matches
  letters.forEach((letter) => {
    // Only check elements that have letters (those with the "letter" class)
    if (
      letter.className.includes("letter") &&
      letter.textContent.toLowerCase() === clickedBtn
    ) {
      // Add the "show" class to the li
      letter.classList.add("show");

      // Store the button text in the match variable
      match = clickedBtn;
    }
  });
  // Return the match variable
  return match;
};

// Check if the game has been won or lost
const checkWin = () => {
  const liElLetter = document.querySelectorAll("li.letter");
  const liElShow = document.querySelectorAll("li.show");

  if (liElLetter.length === liElShow.length) {
    // Add a delay before showing the win overlay
    setTimeout(() => {
      overlay.className = "win";
      title.textContent = "Congrats, you won!";
      startButton.textContent = "Play Again";
      phraseUl.style.display = "none";
      overlay.style.display = "flex";
    }, 1000);

    return true;
  } else if (missed > 4) {
    // Add a delay before showing the lose overlay
    setTimeout(() => {
      overlay.className = "lose";
      title.textContent = "Sorry, you lost. Try again.";
      startButton.textContent = "Play Again";
      phraseUl.style.display = "none";
      overlay.style.display = "flex";
    }, 1000);

    return false;
  }

  return null;
};

// Reset game
const resetGame = () => {
  // Reset missed counter back to 0
  missed = 0;

  // Clear phrase completely
  phraseUl.innerHTML = "";

  // Reset all buttons
  const buttons = document.querySelectorAll("#qwerty button");
  buttons.forEach((button) => {
    button.classList.remove("chosen");
    button.disabled = false;
  });

  // Reset all hearts
  const heartImages = document.querySelectorAll(".tries img");
  heartImages.forEach((img) => {
    img.src = "images/liveHeart.png";
  });

  // Get a new random phrase and display it
  const newRandomPhrase = getRandomPhraseAsArray(phrases);
  addPhraseToDisplay(newRandomPhrase);

  // Hide the overlay first, then animate
  overlay.style.display = "none";

  // Now animate the letters
  animateLetters();
};

qwerty.addEventListener("click", (e) => {
  // Filter out clicks that don't happen on the buttons or if the button already has the "chosen" class
  if (e.target.tagName === "BUTTON" && !e.target.classList.contains("chosen")) {
    // Add the 'chosen' class to the pressed button
    e.target.classList.add("chosen");

    // Call the checkLetter function and store the results in a variable
    const guess = checkLetter(e.target);

    // If no matching letter was found in the phrase
    if (guess == null) {
      // Increment the missed counter
      missed++;

      // Remove a heart image (change a live heart to a lost heart)
      const tries = document.querySelectorAll(
        '.tries img[src="images/liveHeart.png"]'
      );
      if (tries.length > 0) {
        tries[0].src = "images/lostHeart.png";
      }
    }

    // Use checkWin() after each click to proceed with game.
    checkWin();
  }
});

// Listen for the start game button to be pressed
startButton.addEventListener("click", () => {
  resetGame();
});
