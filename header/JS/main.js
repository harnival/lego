const hdEl = document.querySelector("header");
const mnIcon = document.querySelector("div.menu_icon");
const btEl = document.querySelector("nav.bottom");

const slEls = document.querySelectorAll("div.select");
const mnEls = document.querySelectorAll("ul.menus");

// 1. CLASS : BOTTOM 열고 닫기

mnIcon.addEventListener("click", () => {
  btEl.classList.toggle("open");
  hdEl.classList.toggle("open");
});

// 1. CLASS : BOTTOM 열고 닫기

// 2. PARK MENU & HOTEL MENU, 열고 닫기

for (let i = 0; i < slEls.length; i++) {
  for (let i = 0; i < mnEls.length; i++) {
    slEls[i].addEventListener("click", () => {
      slEls.forEach((mnLiEl) => {
        if (mnLiEl === slEls[i]) {
          mnLiEl.style.backgroundColor = '#ffcf00';
          mnLiEl.classList.add("active");
        } else {
          mnLiEl.style.backgroundColor = "#fefbf2"
          mnLiEl.classList.remove("active");
        }
      });

      mnEls.forEach((vsLiEl) => {
        if (vsLiEl === mnEls[i]) {
          vsLiEl.classList.add("active");
        } else {
          vsLiEl.classList.remove("active");
        }
      });

    });
  }
}

for (let i = 0; i < slEls.length; i++) {
  for (let i = 0; i < mnEls.length; i++) {
    mnIcon.addEventListener("click", () => {
      
      slEls.forEach((mnLiEl) => {
        if (mnLiEl === slEls[i]) {
          mnLiEl.classList.remove("active");
        }
      });

      mnEls.forEach((vsLiEl) => {
        if (vsLiEl === mnEls[i]) {
          vsLiEl.classList.remove("active");
        } 
      });

    });
  }
}

// 2. PARK MENU & HOTEL MENU, 열고 닫기


