//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  displayResults();
}

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
  title.innerHTML = `${list[index].name} - <span> ${getSeasonAndEpisodeNumber(list, index)} </span>`;

  let picture = document.getElementsByClassName("episodePicture")[index];
  picture.setAttribute("src", `${list[index].image.original}`)

  let description = document.getElementsByClassName("episodeDescription")[index];
  description.innerHTML = `${list[index].summary}`;
}

function getSeasonAndEpisodeNumber(list, index) {
  let seasonNumber = `S${(list[index].season < 10 ? "0" : "") + list[index].season}`
  let episodeNumber = `E${(list[index].number < 10 ? "0" : "") + list[index].number}`

  return `${seasonNumber + episodeNumber}`
}

//level 200
function displayResults() {
  let pageHeader = document.querySelector("header")

  let pageNavigation = document.createElement("nav");
  pageHeader.appendChild(pageNavigation);

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

  function searchThroughEpisodes(e) {
    let searchString = e.target.value.toUpperCase();
    let allEpisodesOnPage = Array.from(getEpisodesOnPage);
    let newEpisodes = [];

    allEpisodesOnPage.forEach(episode => {

      if (episode.innerText.toUpperCase().includes(searchString)) {
        episode.style.display = "";
        newEpisodes.push(episode);
        searchResult.innerText = `Displaying ${newEpisodes.length}/${getEpisodesOnPage.length} episodes `;
      } else {
        episode.style.display = "none";
        searchResult.innerText = `Displaying ${newEpisodes.length}/${getEpisodesOnPage.length} episodes `;
      }
      if (searchString.length === 0) {                                                                      //I have this condition, so when you type "winter" for example and get a result of 10/73, then when you delete it all you want the result to be 73 and not 73/73
        searchResult.innerText = `Displaying ${getEpisodesOnPage.length} episodes `;
      }
    });

  }
}

window.onload = setup;
