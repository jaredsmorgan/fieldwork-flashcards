//get all rhode island animal sightings of a certain Class from gbif
//create arrays of the species keys
//deduplicate the list
//return new deduped list

// JM: I'm not familiar with the API, but curious if there's a way to reduce the number of fetch? Can you jump straight to the names with a set group of species stored in an array? I know it's slowing your load time, and know that's because you're having to make 4 API calls to build your deck.
function getSpecies(classID) {
  return fetch(
    `https://api.gbif.org/v1/occurrence/search/?limit=300&basisOfObservation=OBSERVATION&stateProvince=Rhode%20Island&classKey=${classID}`
  )
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      let results = response.results;
      let species = results
        .map(result => result.speciesKey)
        .filter(
          speciesKey =>
            speciesKey !== undefined &&
            speciesKey !== 9163257 &&
            speciesKey !== 2435035 &&
            speciesKey !== 2441370
        );

      species = Array.from(new Set(species));
      return species;
    });
}

//take the speciesKey and return an object with taxa names

function getNames(speciesKey) {
  return fetch(`https://api.gbif.org/v1/species/${speciesKey}`)
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      return {
        Class: response.class,
        Order: response.order,
        Family: response.family,
        Genus: response.genus,
        Species: response.species
      };
    });
}

//search eol API using species name from gbif API and return eol species id
function getEOLspeciesID(speciesName) {
  return fetch(
    `https://eol.org/api/search/1.0.json?q=${speciesName}&page=1&key=`
  )
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      return response.results[0].id;
    });
}

//take eol species id and return url of a picture from species page
function getEOLPictureURL(eolID) {
  return fetch(
    `https://eol.org/api/pages/1.0/${eolID}.json?details=true&images_per_page=1`
  )
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      return response.taxonConcept.dataObjects[0].eolMediaURL;
    });
}

//combine gbif taxa names and eol picture url into one object and un-nest names
function getInfo(speciesKey) {
  let namesPromise = getNames(speciesKey);

  return namesPromise.then(function(names) {
    let picturePromise = getEOLspeciesID(names.Species).then(getEOLPictureURL);
    return picturePromise.then(function(picture) {
      return { ...names, picture };
    });
  });
}

//create a div element representing a card
//create a dl element for the card
//create dt elements and append labels from getInfo to them
//create dd elements and append names from getInfo to them
//create an img element for the card
//append url from getInfo as src attribute of img

// JM: I think you could refactor the class, order, family, and genus part of this function to append each element. Iterating over info to append each element.
function getInfoList(info) {
  const namesList = document.createElement('dl');
  namesList.setAttribute('class', 'card-names');

  const classType = document.createElement('dt');
  classType.innerText = 'Class';
  const className = document.createElement('dd');
  className.innerText = info.Class;
  namesList.append(classType);
  namesList.append(className);

  const orderType = document.createElement('dt');
  orderType.innerText = 'Order';
  const orderName = document.createElement('dd');
  orderName.innerText = info.Order;
  namesList.append(orderType);
  namesList.append(orderName);

  const familyType = document.createElement('dt');
  familyType.innerText = 'Family';
  const familyName = document.createElement('dd');
  familyName.innerText = info.Family;
  namesList.append(familyType);
  namesList.append(familyName);

  const genusType = document.createElement('dt');
  genusType.innerText = 'Genus';
  const genusName = document.createElement('dd');
  genusName.innerText = info.Genus;
  namesList.append(genusType);
  namesList.append(genusName);

  const speciesType = document.createElement('dt');
  speciesType.innerText = 'Species';
  const speciesName = document.createElement('dd');
  speciesName.innerText = info.Species;
  namesList.append(speciesType);
  namesList.append(speciesName);

  let card = document.createElement('div');
  card.appendChild(namesList);
  card.setAttribute('class', 'gallery-card');

  const animalPhoto = document.createElement('img');
  const cardFront = document.createElement('div');
  cardFront.setAttribute('class', 'card-photo');
  animalPhoto.setAttribute('src', info.picture);
  animalPhoto.setAttribute('width', '150px');
  cardFront.style.backgroundImage = `url(${info.picture})`;
  card.appendChild(cardFront);

  return card;
}

//loop over array of species keys and invoke functions to create cards
cardGallery = document.querySelector('.gallery');
// JM: Great use of chaining. Use 'let' instead of 'var' in your for loop to avoid potential scope issues.
getSpecies(classID).then(function(speciesKeys) {
  for (var speciesKey of speciesKeys) {
    getInfo(speciesKey).then(function(info) {
      let card = getInfoList(info);
      cardGallery.appendChild(card);
    });
  }
});

//event listener for shuffle button
const shuffleButton = document.querySelector('.shuffle-cards');

// JM: Consider an approach that just shuffles the existing cards to avoid the long load on your API calls.
shuffleButton.addEventListener('click', function() {
  location.reload();
});

//QUIZ MODE
//create cards with input fields instead of dd elements
// JM: Similar to your flashcard function. Look at ways to refactor to reduce the repetition in this function.
function getInputFields(info) {
  const namesList = document.createElement('dl');
  namesList.setAttribute('class', 'card-names');

  const classType = document.createElement('dt');
  classType.innerText = 'Class';
  const className = document.createElement('input');
  className.setAttribute('class', 'class-input');
  namesList.append(classType);
  namesList.append(className);

  const orderType = document.createElement('dt');
  orderType.innerText = 'Order';
  const orderName = document.createElement('input');
  orderName.setAttribute('class', 'order-input');
  namesList.append(orderType);
  namesList.append(orderName);

  const familyType = document.createElement('dt');
  familyType.innerText = 'Family';
  const familyName = document.createElement('input');
  familyName.setAttribute('class', 'family-input');
  namesList.append(familyType);
  namesList.append(familyName);

  const genusType = document.createElement('dt');
  genusType.innerText = 'Genus';
  const genusName = document.createElement('input');
  genusName.setAttribute('class', 'genus-input');
  namesList.append(genusType);
  namesList.append(genusName);

  const speciesType = document.createElement('dt');
  speciesType.innerText = 'Species';
  const speciesName = document.createElement('input');
  speciesName.setAttribute('class', 'species-input');
  namesList.append(speciesType);
  namesList.append(speciesName);

  let card = document.createElement('div');
  card.appendChild(namesList);
  card.setAttribute('class', 'gallery-card');

  let submit = document.createElement('button');
  submit.textContent = 'submit';
  submit.setAttribute('class', 'submit-button button');
  namesList.appendChild(submit);
  //function to check answers
  submit.addEventListener('click', function() {
    // JM: A potential UI improvement would be letting users know which are correct/incorrect. Would probably need a way to iterate over them and provide a response like field background color change based on match.
    if (
      className.value === info.Class &&
      orderName.value === info.Order &&
      familyName.value === info.Family &&
      genusName.value === info.Genus &&
      speciesName.value === info.Species
    ) {
      card.style.display = 'none';
      scoreDown(score);
    } else {
      card.style.animation = 'flash 1s ease-in-out';
    }
  });

  const animalPhoto = document.createElement('img');
  const cardFront = document.createElement('div');
  cardFront.setAttribute('class', 'card-photo');
  animalPhoto.setAttribute('src', info.picture);
  animalPhoto.setAttribute('width', '150px');
  cardFront.style.backgroundImage = `url(${info.picture})`;
  card.appendChild(cardFront);

  return card;
}

const quizButton = document.querySelector('.quiz-button');
const studyButton = document.querySelector('.study-button');
const scoreBoard = document.querySelector('.score-board');

//clear gallery of study cards and populate it with quiz mode cards
quizButton.addEventListener('click', switchToQuizMode);

function clearGallery() {
  let card = cardGallery.firstElementChild;
  while (card) {
    cardGallery.removeChild(card);
    card = cardGallery.firstElementChild;
  }
}

function switchToQuizMode() {
  clearGallery();
  getSpecies(classID).then(function(speciesKeys) {
    for (var speciesKey of speciesKeys) {
      getInfo(speciesKey).then(function(info) {
        let card = getInputFields(info);
        cardGallery.appendChild(card);
      });
    }
  });
  studyButton.style.display = 'inline';
  quizButton.style.display = 'none';
  shuffleButton.style.display = 'none';
  scoreBoard.textContent = `Cards Remaining: ${score}`;
  return cardGallery;
}

//clear gallery of quiz cards and populate it with study cards
studyButton.addEventListener('click', switchToStudyMode);

function switchToStudyMode() {
  clearGallery();
  getSpecies(classID).then(function(speciesKeys) {
    for (var speciesKey of speciesKeys) {
      getInfo(speciesKey).then(function(info) {
        let card = getInfoList(info);
        cardGallery.appendChild(card);
      });
    }
  });
  studyButton.style.display = 'none';
  quizButton.style.display = 'inline';
  shuffleButton.style.display = 'inline';
  scoreBoard.textContent = '';
  return cardGallery;
}

//get array.length from getSpecies set
let score = getSpecies(classID).then(function(response) {
  score = response.length;
  return score;
});

//count down the score each time user fills out a card correctly
function scoreDown() {
  if (score > 0) {
    score -= 1;
    scoreBoard.textContent = `Cards Remaining: ${score}`;
  } else if ((score = 0)) {
    scoreBoard.textContent = 'Great work, scientist!';
  }
}
