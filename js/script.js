window.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const btnFullView = document.querySelector("#btn-full"),
    btnMiniView = document.querySelector("#btn-mini"),
    miniView = document.querySelector(".movies-gallery__mini"),
    miniViewBlock = document.querySelector(".movies-gallery__mini-block"),
    fullViewBlock = document.querySelector(".movies-gallery__full-block"),
    fullView = document.querySelector(".movies-gallery__full"),
    favoritBlock = document.querySelector(".promo__movies-favorite ul"),
    modalBlock = document.querySelector(".modal"),
    wrapperBlock = document.querySelector(".promo__wrapper"),
    selectID = document.querySelector("#genres");

  // API Fetch
  const getResourceList = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    } else {
      return await res.json();
    }
  };

  //Movie Favorit List
  let favoritList = [];

  //Movie Personal List API
  let personalMovieList = [];
  let personalMovieListID = [];

  // Genres List
  let genreList = [];
  let genreFilterList = new Set();

  // Favorit add Block
  const addFavorit = function () {
    const block = document.querySelector("ul");
    block.innerHTML = ``;
    favoritList.forEach((item) => {
      let result = personalMovieList.find((w) => w.name == `${item}`);
      let li = document.createElement("li");
      li.setAttribute("data-index-number", `${result.id}`);
      li.innerHTML = `
                ${item} 
                <span class="delete-movie-star" data-index-name="${item}">&times</span>   
              `;
      favoritBlock.appendChild(li);
    });
  };

  // Favorit update Star
  const checkedFavoritStarUpdate = function () {
    const allStars = document.querySelectorAll("[data-index-name]");
    allStars.forEach((item) => {
      if (favoritList.includes(item.getAttribute("data-index-name"))) {
        item.classList.add("star-favorit-active");
      } else if (!favoritList.includes(item.getAttribute("data-index-name"))) {
        item.classList.remove("star-favorit-active");
      }
    });
    addFavorit();
  };

  checkedFavoritStarUpdate();

  // Favorit update LocalStorage

  const updateLocalStorage = function () {
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      favoritList.push(localStorage.getItem(key));
    }
  };

  updateLocalStorage();

  //  Button add or remove star on blocks

  const btnFavoritStar = function (block) {
    block.addEventListener("click", (e) => {
      e.preventDefault();
      let nameMovie = "";
      const click = e.target;
      const getIdMovieBlock =
        e.target.parentElement.getAttribute("data-index-number");

      if (click.className === "star-video") {
        click.classList.add("star-favorit-active");
        nameMovie = click.getAttribute("data-index-name");
        favoritList.push(nameMovie);
        localStorage.setItem(getIdMovieBlock, nameMovie);
        checkedFavoritStarUpdate();
      } else if (
        click.className === "star-video star-favorit-active" ||
        click.className === "delete-movie-star"
      ) {
        click.classList.remove("star-favorit-active");
        nameMovie = click.getAttribute("data-index-name");
        delete favoritList[favoritList.indexOf(nameMovie)];
        localStorage.removeItem(getIdMovieBlock);
        checkedFavoritStarUpdate();
      }
    });
  };

  btnFavoritStar(miniViewBlock);
  btnFavoritStar(fullViewBlock);
  btnFavoritStar(modalBlock);
  btnFavoritStar(favoritBlock);

  // view switch button Movies Gallery vies as:

  const btn = function (block) {
    block.addEventListener("click", (e) => {
      e.preventDefault();
      if (!miniView.classList.contains("active-gallery")) {
        miniView.classList.add("active-gallery");
        fullView.classList.remove("active-gallery");
        selectID.classList.add("hide");
        selectID.classList.remove("show");

        btnFullView.classList.add("hide");
        btnMiniView.classList.remove("hide");
        checkedFavoritStarUpdate();
      } else {
        fullView.classList.add("active-gallery");
        miniView.classList.remove("active-gallery");
        selectID.classList.add("show");
        selectID.classList.remove("hide");

        btnMiniView.classList.add("hide");
        btnFullView.classList.remove("hide");
        checkedFavoritStarUpdate();
      }
    });
  };

  btn(btnMiniView);
  btn(btnFullView);

  // loading genres filtering and addition "genreList"

  const loadingFilterGenres = function (genres) {
    for (let i = 0; i <= genres.length; i++) {
      genreList = genres.map((w) => w.toLowerCase());

      for (let value in genreList) {
        genreFilterList.add(genreList[value]);
      }
    }
  };

  // creating Genres block in filter select menu

  const createGenreBlock = function () {
    for (let item of genreFilterList) {
      let option = document.createElement("option");
      option.value = `${item}`;
      option.innerHTML = `
              ${item}   
          `;
      selectID.appendChild(option);
    }
  };

  // Search for Genres block    filter
  const filterGenreBlock = function (list) {
    list.addEventListener("change", (e) => {
      e.preventDefault();
      const targetId = e.target.value;
      const block = document.querySelectorAll(".genres-video-number");
      //
      block.forEach((item) => {
        item.parentElement.parentElement.style.display = "none";
      });

      block.forEach((item) => {
        if ("genreAll" === targetId) {
          item.parentElement.parentElement.style.display = "grid";
        } else if (item.getAttribute("data-index-genres") === targetId) {
          item.parentElement.parentElement.style.display = "grid";
        }
      });
    });
  };

  filterGenreBlock(selectID);

  // loading moviesBlocks

  //  Block clearing function
  let clearMovieBlock = function (block) {
    block.innerHTML = ``;
  };
  clearMovieBlock(miniViewBlock);
  clearMovieBlock(fullViewBlock);

  // creating a block with a mini image
  let createMovieBlockMini = function (personalMovieList) {
    let div = document.createElement("div");
        div.className = "mini-block-video";
        div.setAttribute("data-index-number", `${personalMovieList.id}`);
        div.innerHTML = `         
              <img src=${personalMovieList.img} alt=Movie-${personalMovieList.id}>
              <div class="name-video">${personalMovieList.name}</div>
              <div class="year-video">${personalMovieList.year}</div>
              <div class="star-video" data-index-name ="${personalMovieList.name}"></div>        
          `;
    miniViewBlock.appendChild(div);
  };

  // creating a block with a full image
  let createMovieBlockFull = function (personalMovieList) {
    let div = document.createElement("div");
    let divGenres = "";
        div.className = "full-block-video";
        div.setAttribute("data-index-number", `${personalMovieList.id}`);

    genreList.forEach((item) => {
      divGenres += `<div class="genres-video-number" data-index-genres="${item}">${item}</div> `;
    });

      div.innerHTML = ``;
      div.innerHTML += `<img src=${personalMovieList.img} alt=Movie-${personalMovieList.id}>`;
      div.innerHTML += `<div class="name-video title_fz12">${personalMovieList.name}</div>`;
      div.innerHTML += `<div class="year-video">${personalMovieList.year}</div>`;
      div.innerHTML += `<div class="desc-video">${personalMovieList.description}</div>`;
      div.innerHTML += `<div class="genres-video"> ${divGenres} </div>`;
      div.innerHTML += `<div class="star-video" data-index-name ="${personalMovieList.name}"></div> `;

    fullViewBlock.appendChild(div);
  };

  // loading a block with a modal window
  const clickToModal = function (block) {
    block.addEventListener("click", (e) => {
      const click = e.target;
      e.preventDefault();
      let targetID;
      if (
        click.className === "mini-block-video" ||
        click.className === "full-block-video"
      ) {
        targetID = click.getAttribute("data-index-number");

        getToModal(targetID);
      } else if (
        click.className === "star-video" ||
        click.className === "star-video star-favorit-active"
      ) {
        return;
      } else if (
        click.parentElement.className === "mini-block-video" ||
        click.parentElement.className === "full-block-video"
      ) {
        targetID = click.parentElement.getAttribute("data-index-number");

        getToModal(targetID);
      }
    });
  };

  // Model Window Close Action
  const clickBtnModalClose = function () {
    const btnClose = document.querySelector(".close-video"),
      modalClose = document.querySelector(".promo");

    function closeModal() {
      modalBlock.style.left = "-100%";
      modalBlock.style.display = "none";
      wrapperBlock.style.opacity = "1";
      document.body.style.overflow = "";
      checkedFavoritStarUpdate();
    }

    btnClose.addEventListener("click", (e) => {
      closeModal();
    });
    modalClose.addEventListener("click", (e) => {
      if (e.target === modalClose) {
        closeModal();
      }
    });
  };

  //  anchors go back to the top of the page
  const anchors = function (block) {
    document.querySelector(block).scrollIntoView({
      behavior: "auto",
      block: "start",
    });
  };

  //  loading model window

  const loadingToModal = function () {
    clearMovieBlock(modalBlock);

    wrapperBlock.style.opacity = "0.5";
    modalBlock.style.left = "0";
    modalBlock.style.display = "block";
    document.body.style.overflow = "hidden";

    let div = document.createElement("div");

    div.innerHTML = ``;
    div.innerHTML = `<img src="././img/loadscreen.gif" alt="load"></img>`;
    div.className = "load";

    modalBlock.appendChild(div);
  };

  // creating a block with a modal window

  const creationToModal = function (id) {
    clearMovieBlock(modalBlock);
        wrapperBlock.style.opacity = "0.5";
        modalBlock.style.left = "0";
        modalBlock.style.display = "block";
        document.body.style.overflow = "hidden";
    let div = document.createElement("div");
        div.className = "modal__block";
        div.setAttribute("data-index-number", `${id}`);
    let divGenres = "";
        personalMovieListID.genres.forEach((item) => {
      divGenres += `<div class="genres-video-number" data-index-genres="${item}">${item}</div> `;
    });
      div.innerHTML = ``;
      div.innerHTML += `<img src=${personalMovieListID.img} alt=Movie-${id}>`;
      div.innerHTML += `<div class="name-video title_fz24">${personalMovieListID.name}</div>`;
      div.innerHTML += `<div class="star-video" data-index-name ="${personalMovieListID.name}"></div>`;
      div.innerHTML += `<div class="year-video title_fz24">${personalMovieListID.year}</div>`;
      div.innerHTML += `<div class="genres-video title_fz14"> ${divGenres} </div>`;
      div.innerHTML += `<div class="name-video title_fz24">${personalMovieListID.name}</div>`;
      div.innerHTML += `<div class="close-video  title_fz150">&times</div>`;
      div.innerHTML += `<div class="desc-video">${personalMovieListID.description}</div>`;
      div.innerHTML += `<div class="director-video title_fz18">Director: ${personalMovieListID.director}</div>`;
      div.innerHTML += `<div class="starring-video title_fz18">Starring: ${personalMovieListID.starring}</div>`;
    modalBlock.appendChild(div);
    clickBtnModalClose();
    checkedFavoritStarUpdate();
    anchors(".promo");
  };

  // Data read request (API) and publishing
  const getUrlLink =
    "http://my-json-server.typicode.com/moviedb-tech/movies/list/";

  const getToModal = function (id) {
    loadingToModal();
    getResourceList(getUrlLink + `${id}`)
      .then((json) => {
        personalMovieListID = json;
        creationToModal(id);
      })
      .catch(function (e) {
        console.log(e);
      });
  };

  getResourceList(getUrlLink)
    .then((json) => {
      personalMovieList = json;
      for (let i = 0; i < personalMovieList.length; i++) {
        loadingFilterGenres(personalMovieList[i].genres);
        createMovieBlockMini(personalMovieList[i]);
        createMovieBlockFull(personalMovieList[i]);
      }
      checkedFavoritStarUpdate();
      createGenreBlock();
      clickToModal(miniViewBlock);
      clickToModal(fullViewBlock);
    })
    .catch(function (e) {
      console.log(e);
    });
});
  