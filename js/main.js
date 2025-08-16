let events = [];

document.addEventListener("DOMContentLoaded", () => {
  const EventsContainerElement =
    document.getElementById("all-events-container") ||
    document.getElementById("recently-viewed") ||
    document.getElementById("favorite-events-container");

  const filterInput = document.getElementById("filter-input");

  loadData(EventsContainerElement).then(() => {
    if (filterInput) {
      filterInput.addEventListener("input", function () {
        const query = filterInput.value.toLowerCase();
        const filteredData = events.filter((event) => {
          return (
            event.event_name.toLowerCase().includes(query) ||
            event.event_date_time.toLowerCase().includes(query) ||
            event.event_place.toLowerCase().includes(query) ||
            event.event_tags.some((tag) => tag.toLowerCase().includes(query))
          );
        });
        renderContent(filteredData, EventsContainerElement);
      });
    }
  });
});

async function loadData(container) {
  const eventResponse = await fetch("data/events.json");
  const eventJSON = await eventResponse.json();
  events = eventJSON.events;

  if (container?.id === "recently-viewed") {
    const viewedIds = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

    const recentEvents = viewedIds
      .map((id) => events.find((e) => e.event_id === id))
      .filter((e) => e);

    renderContent(recentEvents, container);
  } else if (container?.id === "favorite-events-container") {
    const favoriteIds = JSON.parse(localStorage.getItem("favorites")) || [];

    const favoriteEvents = favoriteIds
      .map((id) => events.find((e) => e.event_id === id))
      .filter((e) => e);

    // Make sure to only render if there are any favorite events
    if (favoriteEvents.length > 0) {
      renderContent(favoriteEvents, container);
    } else {
      container.innerHTML = "<p>No favorite events yet!</p>"; // Provide feedback if no favorites
    }
  } else {
    renderContent(events, container); // Show all events
  }
}

function getEventById(id) {
  return events.find((event) => event.event_id === id);
}

function renderContent(eventsToRender, container) {
  if (!container) return;
  container.innerHTML = "";
  for (let event of eventsToRender) {
    const eventDetails = getEventById(event.event_id);
    const eventContainerElement = createEventContainer(eventDetails);
    container.appendChild(eventContainerElement);
  }
}

function createEventContainer(event) {
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

function addToRecentlyViewed(eventId) {
  let viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

  viewed = viewed.filter((id) => id !== eventId);
  viewed.unshift(eventId);

  if (viewed.length > 12) {
    viewed = viewed.slice(0, 12);
  }

  localStorage.setItem("recentlyViewed", JSON.stringify(viewed));
}

function addToFavorites(eventId) {
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

function isFavorited(eventId) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  return favorites.includes(eventId);
}

document.addEventListener("DOMContentLoaded", () => {
  let slideIndex = 0;
  const slides = document.querySelectorAll(".slide");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");

  if (slides.length > 0 && prevBtn && nextBtn) {
    let slideIndex = 0;

    function showSlide(index) {
      slides.forEach((slide) => {
        slide.style.display = "none";
      });

      slides[index].style.display = "block";
    }

    function changeSlide(n) {
      slideIndex = (slideIndex + n + slides.length) % slides.length;
      showSlide(slideIndex);
    }

    prevBtn.addEventListener("click", () => changeSlide(-1));
    nextBtn.addEventListener("click", () => changeSlide(1));

    // Auto-play
    setInterval(() => changeSlide(1), 4000);

    // Initial show
    showSlide(slideIndex);
  }

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
});
