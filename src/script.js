import debounce from "lodash.debounce";
import * as basicLightbox from "basiclightbox";
import "basiclightbox/dist/basicLightbox.min.css";
import { success, error, info, notice } from "@pnotify/core/dist/PNotify.js";
import * as PNotifyMobile from "@pnotify/mobile/dist/PNotifyMobile.js";
import "@pnotify/mobile/dist/PNotifyMobile.css";
import "@pnotify/core/dist/BrightTheme.css";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/mobile/dist/PNotifyMobile.css";
import { getImages } from "./js/getImages";
import { renderImages } from "./js/renderImages";

const listRef = document.querySelector(".gallery");
const inputRef = document.querySelector(".search-input");
const elemRef = document.querySelector(".elem");

let search = "";
let page = 1;
const limit = 12;

async function renderList() {
  try {
    const res = await getImages(search, page);

    if (res.totalHits === 0) {
      notice({
        text: "За вашим запитом нічого не знайдено",
        delay: 2000,
      });

      return null;
    }

    if (page === 1) {
      success({
        text: `Знайдено ${res.totalHits} зображень`,
        delay: 2000,
      });
    }

    listRef.insertAdjacentHTML("beforeend", renderImages(res.hits));

    return res;
  } catch (err) {
    error({
      text: "Не вдалося отримати дані з сервера",
      delay: 2000,
    });
    console.log(err);
  }
}
inputRef.addEventListener(
  "input",
  debounce(async (evt) => {
    listRef.innerHTML = "";
    page = 1;
    search = evt.target.value.trim();

    if (!search) {
      return;
    }
    const res = await renderList();

    if (!res) {
      observer.unobserve(elemRef);
      return;
    }

    observer.observe(elemRef);
  }),
  500,
);

const observer = new IntersectionObserver(
  async (entries) => {
    if (entries[0].isIntersecting && search.length > 2) {
      page++;
      const res = await getImages(search, page);
      listRef.insertAdjacentHTML("beforeend", renderImages(res.hits));
      const total = Math.floor(res.totalHits - page * limit);
      if (total <= 0 && res.totalHits > 0) {
        info({
          text: "Усі зображення завантажено",
          delay: 2000,
        });

        observer.unobserve(entries[0].target);
      }
      if (res.totalHits === 0) {
        return;
      }
    }
  },
  { rootMargin: "50px" },
);
listRef.addEventListener("click", (evt) => {
  if (!evt.target.matches("img")) return;

  const largeImageURL = evt.target.dataset.large;

  const instance = basicLightbox.create(
    `
      <div class="modal">
        <img src="${largeImageURL}" alt="">
      </div>
    `,
    {
      onShow: (instance) => {
        window.addEventListener("keydown", closeModal);
      },
      onClose: (instance) => {
        window.removeEventListener("keydown", closeModal);
      },
    },
  );

  function closeModal(evt) {
    if (evt.code === "Escape") {
      instance.close();
    }
  }

  instance.show();
});
