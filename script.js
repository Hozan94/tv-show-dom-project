//You can edit ALL of the code here

// Level 350

let allEpisodes;
let showID = 82;

function getAllEpisodes(showID) {
  fetch(`https://api.tvmaze.com/shows/${showID}/episodes`)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw `${response.status} ${response.statusText}`
    })
    .then(data => {
      allEpisodes = data;
      setup()
    })
    .catch(error => {
      let errorMessage = document.createElement("p");
      errorMessage.innerText = error;

      let rootElem = document.getElementById("root");
      rootElem.appendChild(errorMessage)
    })
}

function setup() {
  makePageForEpisodes(allEpisodes);
  displayResults();
  selectEpisode();
  addAllShows()
}

// Level 100

function makePageForEpisodes(episodesList) {
  const rootElem = document.getElementById("root");

  let ourSection = document.createElement("section");
  ourSection.classList.add("allEpisodes")
  rootElem.appendChild(ourSection);

  for (let episodeIndex = 0; episodeIndex < episodesList.length; episodeIndex++) {
    let episodeContent = document.createElement("article");
    episodeContent.classList.add("episodeWrapper");                                               //Can I make the 'class' name same as the variable name since we can not use the variable name in CSS

    let episodeTitle = document.createElement("h3");
    episodeTitle.classList.add("episodeName");

    let episodeImage = document.createElement("img");
    episodeImage.classList.add("episodePicture")

    let episodeSummary = document.createElement("div");
    episodeSummary.classList.add("episodeDescription")

    episodeContent.append(episodeTitle, episodeImage, episodeSummary);
    ourSection.append(episodeContent);

    addContentToEachEpisode(episodesList, episodeIndex);
  }
}

function addContentToEachEpisode(list, index) {
  let title = document.getElementsByClassName("episodeName")[index];
  title.innerHTML = `${list[index].name} - ${getSeasonAndEpisodeNumber(list, index)}`;

  let picture = document.getElementsByClassName("episodePicture")[index];
  picture.setAttribute("src", `${list[index].image.original}`)

  let description = document.getElementsByClassName("episodeDescription")[index];
  description.innerHTML = `${list[index].summary}`;
}

function getSeasonAndEpisodeNumber(list, index) {
  const pattern = 10;

  let seasonNumber = `S${(list[index].season < pattern ? "0" : "") + list[index].season}`
  let episodeNumber = `E${(list[index].number < pattern ? "0" : "") + list[index].number}`

  return `${seasonNumber + episodeNumber}`
}

//level 200

function displayResults() {
  let navigationWrapper = document.querySelector(".navigationWrapper")

  let pageNavigation = document.createElement("nav");
  navigationWrapper.appendChild(pageNavigation);

  let searchBar = document.createElement("input");
  searchBar.setAttribute("type", "text");
  searchBar.setAttribute("placeholder", "Search through the episodes");
  searchBar.setAttribute("id", "mySearchBar");
  pageNavigation.appendChild(searchBar)

  let searchResult = document.createElement("label")
  searchResult.classList.add("mySearchResult")

  let getEpisodesOnPage = document.getElementsByClassName("episodeWrapper");
  searchResult.innerText = `Displaying ${getEpisodesOnPage.length} episodes `;
  pageNavigation.appendChild(searchResult)

  searchBar.addEventListener("keyup", searchThroughEpisodes)
}

function searchThroughEpisodes(e) {
  let searchString = e.target.value.toUpperCase();

  let getEpisodesOnPage = document.getElementsByClassName("episodeWrapper")
  let searchResult = document.getElementsByClassName("mySearchResult")

  let allEpisodesOnPage = Array.from(getEpisodesOnPage);
  let newEpisodes = [];

  allEpisodesOnPage.forEach(episode => {
    if (episode.innerText.toUpperCase().includes(searchString)) {
      episode.style.display = "";
      newEpisodes.push(episode);
    } else {
      episode.style.display = "none";
    }

    searchResult.innerText = `Displaying ${newEpisodes.length}/${getEpisodesOnPage.length} episodes`;

    if (searchString.length === 0) {                                                                      //I have this condition, so when you type "winter" for example and get a result of 10/73, then when you delete it all you want the result to be 73 and not 73/73
      searchResult.innerText = `Displaying ${getEpisodesOnPage.length} episodes`;
    }
  });
}

//level 300

function selectEpisode() {
  let selectAnEpisode = document.createElement("select");
  selectAnEpisode.setAttribute("id", "episodes")

  let pageNavigation = document.querySelector("nav")                                                      //I declared this variable again (there is one in level 200), did not want to have anything in the global scope, so not sure if it is best practice?
  pageNavigation.appendChild(selectAnEpisode);

  let getEpisodesTitles = document.getElementsByClassName("episodeName")

  let episodeOption = document.createElement("option");
  episodeOption.innerText = "Main Page";
  selectAnEpisode.appendChild(episodeOption);

  for (let titleIndex = 0; titleIndex < getEpisodesTitles.length; titleIndex++) {
    episodeOption = document.createElement("option");
    selectAnEpisode.appendChild(episodeOption);

    episodeOption.innerText = getEpisodesTitles[titleIndex].innerText;
  }

  selectAnEpisode.addEventListener("change", selectedEpisode)
}

function selectedEpisode(e) {
  let selectedOption = e.target.value;
  let getEpisodesOnPage = document.getElementsByClassName("episodeWrapper");                             //I declared this variable again (there is one in level 200), did not want to have anything in the global scope, so not sure if it is best practice?
  let allEpisodesOnPage = Array.from(getEpisodesOnPage);

  allEpisodesOnPage.forEach(episode => {
    if (episode.innerText.includes(selectedOption)) {
      episode.style.display = "";
    } else {
      episode.style.display = "none";
    }

    if (selectedOption === "Main Page") {
      episode.style.display = "";
    }

  })
}

//Level 400

function addAllShows() {
  let selectAShow = document.createElement("select");
  selectAShow.setAttribute("id", "shows");

  let chooseEpisodeAndShow = document.createElement("label");
  chooseEpisodeAndShow.innerText = "Choose a show & episode:";
  chooseEpisodeAndShow.classList.add("myChooseEpisodeAndShow")

  let pageNavigation = document.querySelector("nav")
  pageNavigation.prepend(chooseEpisodeAndShow, selectAShow);

  let showsList = getAllShows();

  let sortedShowsList = showsList.sort(function compare(showA, showB) {
    if (showA.name.toUpperCase() < showB.name.toLocaleUpperCase()) { return -1 }
    if (showA.name.toUpperCase() > showB.name.toUpperCase()) { return 1 }
    return 0;
  })

  for (let showIndex = 0; showIndex < sortedShowsList.length; showIndex++) {
    let showOption = document.createElement("option");
    selectAShow.appendChild(showOption);

    showOption.innerText = showsList[showIndex].name
    showOption.setAttribute("value", `${showsList[showIndex].id}`)
  }

  selectAShow.addEventListener("change", selectedShow)
}

function selectedShow(e) {
  showID = +e.target.value

  remove()

  getAllEpisodes(showID)

}

function remove() {
  let navigationWrapper = document.querySelector(".navigationWrapper")
  let pageNavigation = document.querySelector("nav");
  navigationWrapper.removeChild(pageNavigation)

  let rootElem = document.querySelector("#root");
  let sectionElem = document.querySelector(".allEpisodes")
  rootElem.removeChild(sectionElem)
}

window.onload = getAllEpisodes(showID);




