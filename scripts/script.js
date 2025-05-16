document.addEventListener("DOMContentLoaded", () => {
  const dropdown = document.querySelector(".dropdown");
  const menu = document.querySelector(".dropdown-content");
  const langBtns = document.querySelectorAll(".change_lang_btn");
  let isMenuOpen = false;

  function toggleMenu(event) {
    if (window.innerWidth <= 768) {
      event.stopPropagation();
      isMenuOpen = !isMenuOpen;
      menu.style.display = isMenuOpen ? "block" : "none";
    }
  }

  function closeMenu() {
    if (window.innerWidth <= 768 && isMenuOpen) {
      isMenuOpen = false;
      menu.style.display = "none";
    }
  }

  dropdown.addEventListener("click", toggleMenu);
  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) {
      closeMenu();
    }
  });

  langBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      const lang = event.target.dataset.lang;
      localStorage.setItem("language", lang);
      fLang(lang);
      closeMenu();
    });
  });

  function fLang(thisLang) {
    const lang = ["langEn", "langRu", "langTm"];
    lang.forEach((nLang) => {
      document.querySelectorAll(`.${nLang}`).forEach((el) => {
        el.style.display = nLang === thisLang ? "block" : "none";
      });
    });
    updateGreeting(thisLang);
  }

  const savedLang = localStorage.getItem("language") || "langRu";
  fLang(savedLang);

  function updateGreeting(lang) {
    const hours = new Date().getHours();
    const greetings = {
      langEn: [
        "Good night, I'm Eziz",
        "Good morning, I'm Eziz",
        "Good afternoon, I'm Eziz",
        "Good evening, I'm Eziz",
      ],
      langRu: [
        "Доброй ночи, я Eziz",
        "Доброе утро, я Eziz",
        "Добрый день, я Eziz",
        "Добрый вечер, я Eziz",
      ],
      langTm: [
        "Gijäňiz haýyrly, men Eziz",
        "Ertiriňiz haýyrly, men Eziz",
        "Öýläniňiz haýyrly, men Eziz",
        "Agşamyňyz haýyrly, men Eziz",
      ],
    };

    const greeting =
      hours < 6
        ? greetings[lang][0]
        : hours < 12
        ? greetings[lang][1]
        : hours < 18
        ? greetings[lang][2]
        : greetings[lang][3];

    document.getElementById("greeting").innerText = greeting;
  }

  // Тема (оставляем как есть)
  const toggle = document.getElementById("theme-toggle");
  const body = document.body;

  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-theme");
    toggle.checked = true;
  }

  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      body.classList.add("dark-theme");
      body.classList.remove("light-theme");
      localStorage.setItem("theme", "dark");
    } else {
      body.classList.add("light-theme");
      body.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
  });
});
window.addEventListener("load", () => {
  document.querySelectorAll(".bar").forEach((bar) => {
    const level = bar.dataset.level;
    bar.querySelector("::after"); // just triggers update
    bar.style.setProperty("--level", level);
    bar.style.setProperty("--w", level + "%");
    bar.style.position = "relative";

    const fill = document.createElement("div");
    fill.style.position = "absolute";
    fill.style.top = 0;
    fill.style.left = 0;
    fill.style.height = "100%";
    fill.style.width = "0%";
    fill.style.background = "linear-gradient(90deg, #c75000, #621b00)";
    fill.style.borderRadius = "10px";
    fill.style.transition = "width 1.5s ease-in-out";

    bar.appendChild(fill);
    setTimeout(() => (fill.style.width = level + "%"), 100);
  });
});

/* ------------- Popup Window ------------- */

const popupLinks = document.querySelectorAll(".popup-link");
const body = document.querySelector("body");
const lockPadding = document.querySelectorAll(".lock-padding");

let unlock = true;
const timeout = 800;

if (popupLinks.length > 0) {
  //Делегируем событие для каждого popup элемента
  for (let index = 0; index < popupLinks.length; index++) {
    // получаем каждого элемента в переменную
    const popupLink = popupLinks[index];
    // навещаем события клик
    popupLink.addEventListener("click", function (e) {
      // берем атрибуть 'href' и убираем '#'
      const popupName = popupLink.getAttribute("href").replace("#", "");
      // и получаем его чистое имя
      const curentPopup = document.getElementById(popupName);
      // и отправляем его на функцию popupOpen (*внизу)
      popupOpen(curentPopup);
      // запрешаем переход по ссылке
      e.preventDefault();
    });
  }
}

// close
const popupCloseIcon = document.querySelectorAll(".close-popup");
if (popupCloseIcon.length > 0) {
  for (let index = 0; index < popupCloseIcon.length; index++) {
    const el = popupCloseIcon[index];
    el.addEventListener("click", function (e) {
      // отправляем на функцию 'popupClose' объект который его ближайщий родител с классом 'popup'
      popupClose(el.closest(".popup"));
      e.preventDefault();
    });
  }
}

/*---------func OPEN------------*/
function popupOpen(curentPopup) {
  /* проверяем есть ли такой объект и открыта ли перем. unlock 
    в начале (сверху) он true */
  if (curentPopup && unlock) {
    /* получаем объект который popup с классом open 
    это нужен нам чтоб, закрыть текущий окно, и через ссылку 
    перейти на второй popup окно*/
    const popupActive = document.querySelector(".popup.open");
    if (popupActive) {
      // и если есть такой то отправляем на функ. для закрытие
      popupClose(popupActive, false);
    } else {
      // если нет то блочим скролл (фун. внизу)
      document.body.classList.add("scroll-lock");
    }
    // и дальше тому (котором мы передали сюда) добавим сюда класс open
    curentPopup.classList.add("open");

    curentPopup.addEventListener("click", function (e) {
      /* тут условия если у нажатого объекта у родителях нет 
    класс popup_content*/
      if (!e.target.closest(".popup_content")) {
        /* то мы передаем его на на функ. для закрытие 
        (если нажать на все что за переделы popup_content то он закроется)*/
        popupClose(e.target.closest(".popup"));
      }
    });
  }
}

/*---------func CLOSE------------*/

function popupClose(popupActive, doUnlock = true) {
  if (unlock) {
    popupActive.classList.remove("open");
    if (doUnlock) {
      document.body.classList.remove("scroll-lock");
    }
  }
}

/*--------------body Lock-----------------*/
