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

  const favoriteBtn = document.createElement("button");
  favoriteBtn.classList.add("favorite-btn");

  // Check if the event is favorited
  const isAlreadyFavorited = isFavorited(event.event_id);
  favoriteBtn.innerHTML = `<i class="bi ${
    isAlreadyFavorited ? "bi-heart-fill" : "bi-heart"
  }"></i>`;

  favoriteBtn.addEventListener("click", () => {
    // Toggle the favorite state on click
    addToFavorites(event.event_id);

    // Update the heart icon after adding/removing from favorites
    const isNowFavorited = isFavorited(event.event_id);
    favoriteBtn.innerHTML = `<i class="bi ${
      isNowFavorited ? "bi-heart-fill" : "bi-heart"
    }"></i>`;

    if (window.location.pathname.includes("favorites.html")) {
      window.location.reload();
    }
  });

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
