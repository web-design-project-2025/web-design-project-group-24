export function createEventContainer(event) {
  const eventContainerElement = document.createElement("article");
  eventContainerElement.classList.add("event-container");
  eventContainerElement.dataset.eventId = event.event_id;

  const wrapperHeart = document.createElement("div");
  wrapperHeart.classList.add("event-wrapper-heart");
  eventContainerElement.appendChild(wrapperHeart);

  const eventImg = document.createElement("img");
  eventImg.classList.add("event-img");
  eventImg.src = event.event_image;
  wrapperHeart.appendChild(eventImg);

  const favoriteBtn = createFavoriteButton(event.event_id);
  wrapperHeart.appendChild(favoriteBtn);

  const eventName = document.createElement("h1");
  eventName.classList.add("event-name");
  eventName.textContent = event.event_name;
  eventContainerElement.appendChild(eventName);

  const eventPlace = document.createElement("h2");
  eventPlace.classList.add("place");
  eventPlace.textContent = event.event_place;
  eventContainerElement.appendChild(eventPlace);

  const eventDate = document.createElement("h2");
  eventDate.classList.add("date-time-place");
  eventDate.textContent = event.event_date_time;
  eventContainerElement.appendChild(eventDate);

  const eventTags = document.createElement("p");
  eventTags.classList.add("event-tags");
  eventTags.textContent = event.event_tags.join(", ");
  eventContainerElement.appendChild(eventTags);

  const readMoreButton = document.createElement("button");
  readMoreButton.classList.add("button-1", "event-button");
  readMoreButton.textContent = "Read more";

  const icon = document.createElement("i");
  icon.classList.add("bi", "bi-chevron-right");
  readMoreButton.appendChild(icon);

  readMoreButton.addEventListener("click", () => {
    addToRecentlyViewed(event.event_id);
    window.location.href = `event-detail.html?id=${event.event_id}`;
  });

  eventContainerElement.appendChild(readMoreButton);

  return eventContainerElement;
}

export function addToRecentlyViewed(eventId) {
  let viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

  viewed = viewed.filter((id) => id !== eventId);
  viewed.unshift(eventId);

  if (viewed.length > 12) {
    viewed = viewed.slice(0, 12);
  }

  localStorage.setItem("recentlyViewed", JSON.stringify(viewed));
}

export function recentlyViewedButtons() {
  const rvContainer = document.getElementById("recently-viewed");
  const rvPrev = document.querySelector(".rv-prev");
  const rvNext = document.querySelector(".rv-next");

  if (rvContainer && rvPrev && rvNext) {
    rvPrev.addEventListener("click", () => {
      rvContainer.scrollBy({
        left: -rvContainer.offsetWidth,
        behavior: "smooth",
      });
    });

    rvNext.addEventListener("click", () => {
      rvContainer.scrollBy({
        left: rvContainer.offsetWidth,
        behavior: "smooth",
      });
    });
  }
}

export function createFavoriteButton(eventId) {
  const favoriteBtn = document.createElement("button");
  favoriteBtn.classList.add("favorite-btn");
  favoriteBtn.dataset.eventId = eventId;

  const setIcon = (btn = favoriteBtn) => {
    const fav = isFavorited(eventId);
    btn.innerHTML = `<i class="bi ${fav ? "bi-heart-fill" : "bi-heart"}"></i>`;
  };

  setIcon();

  favoriteBtn.addEventListener("click", async () => {
    const wasFav = isFavorited(eventId);
    addToFavorites(eventId);
    setIcon();

    document
      .querySelectorAll(`.favorite-btn[data-event-id="${eventId}"]`)
      .forEach((btn) => setIcon(btn));

    if (!window.location.pathname.includes("favorites.html")) return;

    const list = document.getElementById("favorite-events-container");
    if (!list) return;

    if (wasFav) {
      const favCard = list.querySelector(
        `.event-container[data-event-id="${eventId}"]`
      );
      if (favCard) favCard.remove();
    } else if (list) {
      const res = await fetch("data/events.json");
      const { events = [] } = await res.json();
      const ev = events.find((e) => e.event_id === eventId);
      if (ev) {
        list.prepend(createEventContainer(ev));
      }
    }
  });

  return favoriteBtn;
}

export function addToFavorites(eventId) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.includes(eventId)) {
    // Remove from favorites
    favorites = favorites.filter((id) => id !== eventId);
  } else {
    // Add to favorites
    favorites.unshift(eventId);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
}

export function isFavorited(eventId) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  return favorites.includes(eventId);
}

export async function tagDropdown() {
  const tagFilter = document.getElementById("tag-filter-btn");
  const tagList = document.getElementById("tag-list");

  if (!tagFilter || !tagList) return;

  const res = await fetch("data/events.json");
  const data = await res.json();
  const set = new Set();
  data.events.forEach((e) => (e.event_tags || []).forEach((t) => set.add(t)));
  const tags = ["All", ...set];

  tagList.innerHTML = "";
  tags.forEach((tag) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "tag-option";
    checkbox.dataset.value = tag === "All" ? "all" : tag.toLowerCase();
    if (tag === "All") checkbox.checked = true;

    label.appendChild(checkbox);
    label.append(" " + tag);
    tagList.appendChild(label);
  });

  tagFilter.addEventListener("click", (e) => {
    e.preventDefault();
    tagList.hidden = !tagList.hidden;
  });

  tagList.addEventListener("change", (e) => {
    if (!e.target.classList.contains("tag-option")) return;

    const checkedTags = [
      ...tagList.querySelectorAll("input.tag-option:checked"),
    ].map((el) => el.dataset.value);

    tagFilter.querySelector("span").textContent =
      e.target.dataset.value === "all"
        ? "Filter by tags"
        : e.target.textContent;
    console.log("Selected tag:", e.target.dataset.value); // hook filter here
  });
}

document.addEventListener("DOMContentLoaded", () => {
  tagDropdown();
});
