import {
  createEventContainer,
  recentlyViewedButtons,
  tagDropdown,
} from "./functions.js";

let events = [];

document.addEventListener("DOMContentLoaded", () => {
  const allEventsContainer = document.getElementById("all-events-container");
  const recentlyViewed = document.getElementById("recently-viewed");
  const favoriteEvents = document.getElementById("favorite-events-container");
  const filterInput = document.getElementById("search-filter");

  loadData().then(() => {
    if (allEventsContainer) {
      renderContent(events, allEventsContainer);
    }

    if (recentlyViewed) {
      const viewedIds =
        JSON.parse(localStorage.getItem("recentlyViewed")) || [];

      const recentEvents = viewedIds
        .map((id) => events.find((e) => e.event_id === id))
        .filter((e) => e);

      renderContent(recentEvents, recentlyViewed);
      recentlyViewedButtons();
    }

    if (favoriteEvents) {
      const favoriteIds = JSON.parse(localStorage.getItem("favorites")) || [];

      const favoriteEventsList = favoriteIds
        .map((id) => events.find((e) => e.event_id === id))
        .filter((e) => e);

      renderContent(favoriteEventsList, favoriteEvents);
    }

    if (filterInput && allEventsContainer) {
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
        renderContent(filteredData, allEventsContainer);
      });
    }

    tagDropdown(events);
  });

  window.addEventListener("tagsChanged", (e) => {
    if (!allEventsContainer) return;
    const selectedTags = e.detail.selectedTags || [];

    const filteredEvents = selectedTags.includes("all")
      ? events
      : events.filter((ev) =>
          (ev.event_tags || []).some((tag) =>
            selectedTags.includes(tag.toLowerCase())
          )
        );

    renderContent(filteredEvents, allEventsContainer);
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
    const eventContainerElement = createEventContainer(event);
    container.appendChild(eventContainerElement);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let slideIndex = 0;
  const slides = document.querySelectorAll(".slide");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");

  if (slides.length > 0 && prevBtn && nextBtn) {
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
});
