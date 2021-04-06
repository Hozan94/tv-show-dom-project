//You can edit ALL of the code here

// Level 350

let allEpisodes;
let showID;

function getAllEpisodes(showID) {
  fetch(`https://api.tvmaze.com/shows/${showID}/episodes`)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(
        `Encountered something unexpected: ${response.status} ${response.statusText}`
      );
    })
    .then(data => {
      allEpisodes = data;
      setUpEpisodesList()
    })
    .catch(error => {
      let errorMessage = document.createElement("p");
      errorMessage.innerText = error;

      let rootElem = document.getElementById("root");
      rootElem.appendChild(errorMessage)
    })
}

function setUpEpisodesList() {
  makePageForEpisodes(allEpisodes);
  addSearchBar();
  addEpisodesSelector();
  addShowsSelector();
  goBackToShowsListPage();
}

// Level 100

function makePageForEpisodes(episodesList) {
  const rootElem = document.getElementById("root");

  let ourSection = document.createElement("section");
  ourSection.classList.add("allEpisodes")
  rootElem.appendChild(ourSection);

  for (let episodeIndex = 0; episodeIndex < episodesList.length; episodeIndex++) {
    let episodeContent = document.createElement("article");
    episodeContent.classList.add("wrapper");

    let episodeTitle = document.createElement("h3");
    episodeTitle.classList.add("episodeName");

    let imageContainer = document.createElement("div");
    imageContainer.classList.add("EpisodePictureContainer")

    let episodeImage = document.createElement("img");
    episodeImage.classList.add("episodePicture")
    imageContainer.appendChild(episodeImage)

    let episodeSummary = document.createElement("div");
    episodeSummary.classList.add("episodeDescription")

    episodeContent.append(episodeTitle, imageContainer, episodeSummary);
    ourSection.append(episodeContent);

    addContentToEachEpisode(episodesList, episodeIndex);
  }
}

function addContentToEachEpisode(list, index) {
  let title = document.getElementsByClassName("episodeName")[index];
  title.innerHTML = `${list[index].name} - ${getSeasonAndEpisodeNumber(list, index)}`;

  let picture = document.getElementsByClassName("episodePicture")[index];
  picture.setAttribute("src", `${getImage(list, index)}`)

  let description = document.getElementsByClassName("episodeDescription")[index];
  description.innerHTML = `${list[index].summary}`;
}

function getImage(list, index) {
  if (list[index].image === null) {
    return "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
  } else {
    return list[index].image.medium;
  }

}

function getSeasonAndEpisodeNumber(list, index) {
  const pattern = 10;

  let seasonNumber = `S${(list[index].season < pattern ? "0" : "") + list[index].season}`
  let episodeNumber = `E${(list[index].number < pattern ? "0" : "") + list[index].number}`

  return `${seasonNumber + episodeNumber}`
}

//level 200

function addSearchBar() {
  let navigationWrapper = document.querySelector(".navigationWrapper")

  let pageNavigation = document.createElement("nav");
  navigationWrapper.appendChild(pageNavigation);

  let searchBar = document.createElement("input");
  searchBar.setAttribute("type", "text");
  searchBar.setAttribute("placeholder", "Search through the page");
  searchBar.setAttribute("id", "mySearchBar");
  pageNavigation.appendChild(searchBar)

  let searchResult = document.createElement("label")
  searchResult.classList.add("mySearchResult")

  let getResultsOnPage = document.getElementsByClassName("wrapper");
  searchResult.innerText = `Displaying ${getResultsOnPage.length} results `;
  pageNavigation.appendChild(searchResult)

  searchBar.addEventListener("keyup", searchThroughThePage)
}

function searchThroughThePage(e) {
  let searchString = e.target.value.toUpperCase();

  let getResultsOnPage = document.getElementsByClassName("wrapper")
  let searchResult = document.getElementsByClassName("mySearchResult")

  let allResultsOnPage = Array.from(getResultsOnPage);
  let newResults = [];

  allResultsOnPage.forEach(result => {
    if (result.innerText.toUpperCase().includes(searchString)) {
      result.classList.remove("hidden")
      newResults.push(result);
    } else {
      result.classList.add("hidden")
    }

    searchResult.innerText = `Displaying ${newResults.length}/${getResultsOnPage.length} results`;

    if (searchString.length === 0) {                                                                      //I have this condition, so when you type "winter" for example and get a result of 10/73, then when you delete it all you want the result to be 73 and not 73/73
      searchResult.innerText = `Displaying ${getResultsOnPage.length} results`;
    }
  });
}

//level 300

function addEpisodesSelector() {
  let selectAnEpisode = document.createElement("select");
  selectAnEpisode.setAttribute("id", "episodes")

  let pageNavigation = document.querySelector("nav")                                                      //I declared this variable again (there is one in level 200), did not want to have anything in the global scope, so not sure if it is best practice?
  pageNavigation.prepend(selectAnEpisode);

  let getEpisodesTitles = document.getElementsByClassName("episodeName")

  let episodeOption = document.createElement("option");
  episodeOption.innerText = "All Results";
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
  let getResultsOnPage = document.getElementsByClassName("wrapper");                             //I declared this variable again (there is one in level 200), did not want to have anything in the global scope, so not sure if it is best practice?
  let allResultsOnPage = Array.from(getResultsOnPage);

  allResultsOnPage.forEach(result => {
    if (result.innerText.includes(selectedOption)) {
      result.classList.remove("hidden");
    } else {
      result.classList.add("hidden");
    }

    if (selectedOption === "All Results") {
      result.classList.remove("hidden");
    }

  })
}

//Level 400

function addShowsSelector() {
  let selectAShow = document.createElement("select");
  selectAShow.setAttribute("id", "shows");

  let chooseEpisodeAndShow = document.createElement("label");
  chooseEpisodeAndShow.innerText = "Choose a show";
  chooseEpisodeAndShow.classList.add("chooseLabel")

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

  removeCurrentPage()
  getAllEpisodes(showID)
}

function removeCurrentPage() {
  let rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  let navigationWrapper = document.querySelector(".navigationWrapper")
  navigationWrapper.innerHTML = "";
}


//Level 500 part 1 and 2

function sortedShowsList() {
  let showsList = getAllShows();

  let newShowsList = showsList.sort(function compare(showA, showB) {
    if (showA.name.toUpperCase() < showB.name.toLocaleUpperCase()) { return -1 }
    if (showA.name.toUpperCase() > showB.name.toUpperCase()) { return 1 }
    return 0;
  })

  return newShowsList
}

function makePageForShowsList() {
  let showsList = sortedShowsList()

  let rootElem = document.getElementById("root");

  let ourShowsSection = document.createElement("section");
  ourShowsSection.classList.add("allShows")
  rootElem.appendChild(ourShowsSection)

  for (let showIndex = 0; showIndex < showsList.length; showIndex++) {
    let theShowWrapper = document.createElement("article");
    theShowWrapper.classList.add("wrapper");                                    //made same class for the articles elements in episodes and shows page, so "addSearchBar()" can be used on both
    theShowWrapper.classList.add("theShowWrapper")

    let theShowTitle = document.createElement("h3");
    theShowTitle.classList.add("theShowName");
    theShowTitle.addEventListener("click", getTheShowEpisodes)

    let theShowContentsWrapper = document.createElement("div");
    theShowContentsWrapper.classList.add("theShowContentsWrapper");

    let imageContainer = document.createElement("div");
    imageContainer.classList.add("theShowPictureContainer");

    let theShowImage = document.createElement("img");
    theShowImage.classList.add("theShowPicture");
    imageContainer.appendChild(theShowImage);

    let theShowSummary = document.createElement("div");
    theShowSummary.classList.add("theShowDescription");

    let theShowDetails = document.createElement("article");
    theShowDetails.classList.add("theShowDetails");

    theShowContentsWrapper.append(imageContainer, theShowSummary, theShowDetails)

    theShowWrapper.append(theShowTitle, theShowContentsWrapper);

    ourShowsSection.appendChild(theShowWrapper)

    addContentToEachShow(showsList, showIndex)

  }
}

function addContentToEachShow(list, index) {
  let title = document.getElementsByClassName("theShowName")[index];
  title.innerHTML = `${list[index].name}`;
  title.id = list[index].id

  let picture = document.getElementsByClassName("theShowPicture")[index];
  picture.setAttribute("src", `${getImage(list, index)}`)

  let description = document.getElementsByClassName("theShowDescription")[index];
  description.innerHTML = `${list[index].summary}`;

  let theShowRating = document.createElement("p");
  theShowRating.innerHTML = `<b>Rating:</b> ${list[index].rating.average}`;

  let theShowGenre = document.createElement("p");
  theShowGenre.innerHTML = `<b>Genres:</b> ${list[index].genres}`;

  let theShowStatus = document.createElement("p");
  theShowStatus.innerHTML = `<b>Status:</b> ${list[index].status}`;

  let theShowRuntime = document.createElement("p");
  theShowRuntime.innerHTML = `<b>Runtime:</b> ${list[index].runtime}`;

  let theShowDetails = document.getElementsByClassName("theShowDetails")[index];
  theShowDetails.append(theShowRating, theShowGenre, theShowStatus, theShowRuntime)

}

//Level 500 part 3

function getTheShowEpisodes(e) {
  showID = +e.target.id

  removeCurrentPage()
  getAllEpisodes(showID)
}

//500 part 4

function goBackToShowsListPage() {
  let navigationWrapper = document.querySelector(".navigationWrapper")

  let pageNavigation = document.querySelector("nav");
  navigationWrapper.appendChild(pageNavigation);

  let buttonWrapper = document.createElement("div");
  buttonWrapper.classList.add("buttonWrapper");

  let backToShowsListButton = document.createElement("button");
  backToShowsListButton.innerHTML = "&laquo; Shows List";
  backToShowsListButton.setAttribute("type", "button")
  backToShowsListButton.setAttribute("class", "previousButton")

  buttonWrapper.appendChild(backToShowsListButton)

  pageNavigation.appendChild(buttonWrapper)

  backToShowsListButton.addEventListener("click", displayShowsListPage)
}

function displayShowsListPage() {
  removeCurrentPage()
  makePageForShowsList()
  addSearchBar()
  addShowsSelector()
}

function setUpShowsListPage() {
  makePageForShowsList()
  addSearchBar()
  addShowsSelector()
}

window.onload = setUpShowsListPage;



