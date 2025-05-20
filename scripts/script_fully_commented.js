
// ===================== script.js с гиперподробными комментариями =====================
// Этот скрипт отвечает за: смену языка, тёмную тему, popup-окна и анимации при скролле.
// Всё завёрнуто в блок, который ждёт полной загрузки DOM (HTML-документа)

document.addEventListener("DOMContentLoaded", () => {
  // ===================== Переменные для меню языка =====================

  // dropdown — это кнопка/элемент, по которому мы кликаем, чтобы открыть список языков
  const dropdown = document.querySelector(".dropdown");
  // menu — сам выпадающий список языков
  const menu = document.querySelector(".dropdown-content");
  // langBtns — все кнопки, которые отвечают за смену языка
  const langBtns = document.querySelectorAll(".change_lang_btn");
  // флаг: открыто ли меню или нет (true — открыто, false — закрыто)
  let isMenuOpen = false;

  // ===================== Функция для переключения меню =====================
  // Срабатывает при клике на dropdown (если экран маленький, как на телефоне)
  function toggleMenu(event) {
    if (window.innerWidth <= 768) { // Только для мобильных устройств
      event.stopPropagation(); // Останавливаем всплытие, чтобы меню не закрылось сразу
      isMenuOpen = !isMenuOpen; // Меняем значение флага на противоположное
      // Показываем или скрываем меню в зависимости от текущего состояния
      menu.style.display = isMenuOpen ? "block" : "none";
    }
  }

  // ===================== Функция для закрытия меню =====================
  function closeMenu() {
    if (window.innerWidth <= 768 && isMenuOpen) { // Только на мобилках и если меню открыто
      isMenuOpen = false;
      menu.style.display = "none"; // Прячем меню
    }
  }

  // Клик по кнопке меню — запускаем toggleMenu
  dropdown.addEventListener("click", toggleMenu);

  // Клик вне меню — закрываем его
  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) {
      closeMenu();
    }
  });

  // ===================== Обработка кнопок смены языка =====================
  langBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation(); // Чтобы меню не схлопнулось до смены языка
      const lang = event.target.dataset.lang; // Получаем язык из data-lang кнопки
      localStorage.setItem("language", lang); // Сохраняем язык в памяти браузера
      fLang(lang); // Вызываем функцию, которая применяет язык
      closeMenu(); // И закрываем меню
    });
  });

  // ===================== Функция смены языка =====================
  function fLang(thisLang) {
    const lang = ["langEn", "langRu", "langTm"]; // Все доступные языки
    lang.forEach((nLang) => {
      // Для каждого языка проверяем: оставить или спрятать
      document.querySelectorAll(`.${nLang}`).forEach((el) => {
        el.style.display = nLang === thisLang ? "block" : "none";
      });
    });
    // После смены языка — обновляем приветствие по времени
    updateGreeting(thisLang);
  }

  // Загружаем сохранённый язык или ставим по умолчанию — русский
  const savedLang = localStorage.getItem("language") || "langRu";
  fLang(savedLang); // Применяем язык

  // ===================== Приветствие по времени =====================
  function updateGreeting(lang) {
    const hours = new Date().getHours(); // Получаем текущий час (0–23)
    // Приветствия для всех языков и времён суток
    const greetings = {
      langEn: [
        "Good night, I'm Eziz",    // 00:00–05:59
        "Good morning, I'm Eziz",  // 06:00–11:59
        "Good afternoon, I'm Eziz",// 12:00–17:59
        "Good evening, I'm Eziz",  // 18:00–23:59
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
    // Выбираем нужное приветствие по текущему времени
    const greeting =
      hours < 6
        ? greetings[lang][0]
        : hours < 12
        ? greetings[lang][1]
        : hours < 18
        ? greetings[lang][2]
        : greetings[lang][3];
    // Вставляем текст в элемент с id="greeting"
    document.getElementById("greeting").innerText = greeting;
  }


  // ===================== Темная тема =====================
  const toggle = document.getElementById("theme-toggle");
  const body = document.body;

  // Если тема была сохранена как "dark", сразу применяем её при загрузке
  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-theme");
    toggle.checked = true;
  }

  // Слушаем переключение темы пользователем
  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      // Включаем тёмную тему
      body.classList.add("dark-theme");
      body.classList.remove("light-theme");
      localStorage.setItem("theme", "dark");
    } else {
      // Включаем светлую тему
      body.classList.add("light-theme");
      body.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
  });
}); // Закрываем DOMContentLoaded

// ===================== Анимация навыков (skills bars) =====================
// Эта функция вызывается, когда блок "skills" попадает в зону видимости
function animateSkills() {
  // Получаем все элементы, представляющие собой полоски навыков
  document.querySelectorAll(".bar").forEach((bar) => {
    const level = bar.dataset.level; // Берём уровень из data-level (например "70")

    // Задаём пользовательские CSS-переменные — не критично, но удобно
    bar.style.setProperty("--level", level);
    bar.style.setProperty("--w", level + "%");

    // Устанавливаем позиционирование, чтобы вложенные элементы точно встали
    bar.style.position = "relative";

    // Создаём внутренний блок, который будет "заполнять" полоску навыка
    const fill = document.createElement("div");
    fill.style.position = "absolute";
    fill.style.top = 0;
    fill.style.left = 0;
    fill.style.height = "100%";
    fill.style.width = "0%"; // начинаем с нуля
    fill.style.background = "linear-gradient(90deg, #4f772d, #31572c)";
    fill.style.borderRadius = "10px";
    fill.style.transition = "width 1.5s ease-in-out"; // анимация ширины

    bar.appendChild(fill); // вставляем "заливку" в бар

    // Через 100 мс запускаем анимацию (width увеличится до уровня)
    setTimeout(() => (fill.style.width = level + "%"), 100);
  });
}

// ===================== Popup окна =====================

// Ищем все ссылки, которые при клике открывают popup
const popupLinks = document.querySelectorAll(".popup-link");
const body = document.querySelector("body");

// Элементы, которые нужно "заблокировать", когда появляется popup (например, чтобы не прыгал scroll)
const lockPadding = document.querySelectorAll(".lock-padding");

let unlock = true; // переменная-защита, чтобы не спамить открытие/закрытие popup
const timeout = 800; // задержка (не используется здесь, но может пригодиться для анимации)

// Навешиваем клики на все popup-ссылки
if (popupLinks.length > 0) {
  for (let index = 0; index < popupLinks.length; index++) {
    const popupLink = popupLinks[index];
    popupLink.addEventListener("click", function (e) {
      const popupName = popupLink.getAttribute("href").replace("#", ""); // убираем решётку
      const curentPopup = document.getElementById(popupName); // получаем элемент по id
      popupOpen(curentPopup); // открываем popup
      e.preventDefault(); // отменяем стандартное поведение
    });
  }
}

// Закрытие popup через крестик
const popupCloseIcon = document.querySelectorAll(".close-popup");
if (popupCloseIcon.length > 0) {
  for (let index = 0; index < popupCloseIcon.length; index++) {
    const el = popupCloseIcon[index];
    el.addEventListener("click", function (e) {
      popupClose(el.closest(".popup")); // ищем родителя с классом popup
      e.preventDefault();
    });
  }
}

// Функция открытия popup
function popupOpen(curentPopup) {
  if (curentPopup && unlock) {
    const popupActive = document.querySelector(".popup.open");
    if (popupActive) {
      popupClose(popupActive, false); // если другой popup уже открыт — закроем
    } else {
      document.body.classList.add("scroll-lock"); // блокируем прокрутку страницы
    }
    curentPopup.classList.add("open"); // показываем popup

    // Если клик вне содержимого popup — закрыть
    curentPopup.addEventListener("click", function (e) {
      if (!e.target.closest(".popup_content")) {
        popupClose(e.target.closest(".popup"));
      }
    });
  }
}

// Функция закрытия popup
function popupClose(popupActive, doUnlock = true) {
  if (unlock) {
    popupActive.classList.remove("open");
    if (doUnlock) {
      document.body.classList.remove("scroll-lock");
    }
  }
}

// ===================== Анимация появления блоков при скролле =====================
// Используем IntersectionObserver — мощная вещь
const sections = document.querySelectorAll(".hidden-on-scroll");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Если элемент стал видимым, добавим ему класс "visible"
        entry.target.classList.add("visible");

        // Если это блок с id="skills", запускаем анимацию полосок
        if (entry.target.id === "skills") {
          animateSkills();
        }
      }
    });
  },
  { threshold: 0.4 } // 40% блока должно быть видно, чтобы он считался "видимым"
);

// Запускаем наблюдение за каждым блоком
sections.forEach((section) => {
  observer.observe(section);
});

// ===================== Логика для "посещённой" картинки =====================
const img = document.getElementById("img1");

// Если пользователь уже видел картинку раньше, добавим ей класс
if (localStorage.getItem("img1_visited")) {
  img.classList.add("visited");
}

// При клике по родителю картинки — считаем, что пользователь её "увидел"
img.parentElement.addEventListener("click", () => {
  img.classList.add("visited");
  localStorage.setItem("img1_visited", "true");
});
