export function createEventContainer(event) {
  const eventContainerElement = document.createElement("article");
  eventContainerElement.classList.add("event-container");

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

  const setIcon = () => {
    const fav = isFavorited(eventId);
    favoriteBtn.innerHTML = `<i class="bi ${
      fav ? "bi-heart-fill" : "bi-heart"
    }"></i>`;
  };

  setIcon();

  // Toggle the favorite state on click
  favoriteBtn.addEventListener("click", () => {
    const wasFav = isFavorited(eventId); // was it in favorites before toggle?
    addToFavorites(eventId);
    setIcon();

    if (window.location.pathname.includes("favorites.html") && wasFav) {
      const card = favoriteBtn.closest(".event-container");
      if (card) card.remove();
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
