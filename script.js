//create event listener to flip and back forth between card front and back
// const flipButton = document.querySelector(".flip-card");

// flipButton.addEventListener("click", flipCard)

// function flipCard() {
//     if (cardFront.style.display === "inline-block" && cardBack.style.display === "none") {
//         cardFront.style.display = "none"
//         cardBack.style.display = "inline-block"
//     } else {
//         cardFront.style.display = "inline-block"
//         cardBack.style.display = "none"
//     }
// }

//get a list of all rhode island animals of a certain class from gbif
//creat arrays of the different taxas
//deduplicate the lists
//return new deduped lists

// const mammalID = 359
// const birdID = 212
// const amphibianID = 131
// const reptileID = 358

function getSpecies(classID) {
  return fetch(
    `http://api.gbif.org/v1/occurrence/search/?limit=300&basisOfObservation=OBSERVATION&stateProvince=Rhode%20Island&classKey=${classID}`
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

getSpecies(classID).then(r => console.log(r));

function getNames(speciesKey) {
  return fetch(`http://api.gbif.org/v1/species/${speciesKey}`)
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

getNames(5231190).then(r => console.log(r));

// function getPictureURL(speciesKey) {
//   return fetch(
//     `http://api.gbif.org/v1/occurrence/search?speciesKey=${speciesKey}&mediaType=StillImage`
//   )
//     .then(function(response) {
//       return response.json();
//     })
//     .then(function(response) {
//       return response.results[0].media[0].identifier;
//     });
// }

function getEOLspeciesID(speciesName) {
    return fetch(`https://eol.org/api/search/1.0.json?q=${speciesName}&page=1&key=`)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            return response.results[0].id;
        });
}
getEOLspeciesID("Mephitis mephitis").then(r => console.log(r))

function getEOLPictureURL(eolID) {
    return fetch(`https://eol.org/api/pages/1.0/${eolID}.json?details=true&images_per_page=1`)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            return response.taxonConcept.dataObjects[0].eolMediaURL;
        });
}

getEOLspeciesID("Mephitis mephitis").then(getEOLPictureURL).then(r => console.log(r))



//URL to use if I want click event on cards to go to eol page for that animal: https://eol.org/api/search/1.0.json?q=Mephitis%2Bmephitis&exact=true&page=1&key=
//change species name to speciesName ie in getEOLPictureuRL: let speciesInfo = getInfo(speciesKey)
// speciesName = speciesInfo.species
// return fetch(`${speciesName}`)
//should probably return link from first object in the array (most likely to exactly match)

function getInfo(speciesKey) {
  let namesPromise = getNames(speciesKey);

  return namesPromise.then(function(names) {
      let picturePromise =   getEOLspeciesID(names.Species).then(getEOLPictureURL)
    return picturePromise.then(function(picture) {
      return { ...names, picture };
    });
  });
}

function getInfoList(info) {
  const namesList = document.createElement('dl');
  namesList.setAttribute("class", "card-names")

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
  cardFront.setAttribute("class", "card-photo")
  animalPhoto.setAttribute('src', info.picture);
  animalPhoto.setAttribute('width', '150px');
  cardFront.style.backgroundImage = `url(${info.picture})`
  cardFront.style.backgroundSize = "cover"
  card.appendChild(cardFront);

  return card;
}

cardGallery = document.querySelector('.gallery');
getSpecies(classID).then(function(speciesKeys) {
  for (var speciesKey of speciesKeys) {
    getInfo(speciesKey).then(function(info) {
      let card = getInfoList(info);
      cardGallery.appendChild(card);
    });
  }
});

function getImageElement(info) {}

//create a div element representing a card
//create a dl element for the card
//create dt elements and append labels from getInfo to them
//create dd elements and append names from getInfo to them
//create an img element for the card
//append url from getInfo as src attribute of img
