import {
  createEventContainer,
  recentlyViewedButtons,
  tagDropdown,
  getEventMeta,
  SORT_MODES,
  sortEvents,
} from "./functions.js";

let events = [];
let defaultSort = SORT_MODES.DATE; // Default sort by date
let currentSort = defaultSort; // Default sort by date
const applySort = (arr) => sortEvents(arr, currentSort);

document.addEventListener("DOMContentLoaded", () => {
  const allEventsContainer = document.getElementById("all-events-container");
  const recentlyViewed = document.getElementById("recently-viewed");
  const favoriteEvents = document.getElementById("favorite-events-container");
  const filterInput = document.getElementById("search-filter");
  const resetFilterButton = document.getElementById("reset-filter");
  const sortFilter = document.getElementById("sort-filter");

  if (sortFilter) {
    if (!sortFilter.value) sortFilter.value = defaultSort; // reflect default in UI
    currentSort = sortFilter.value || defaultSort;

    sortFilter.addEventListener("change", () => {
      currentSort = sortFilter.value;

      if (!allEventsContainer) return;

      const selectedTags = [
        ...document.querySelectorAll("#tag-list input.tag-option:checked"),
      ].map((el) => el.dataset.value);

      const base =
        selectedTags.includes("all") || selectedTags.length === 0
          ? events
          : events.filter((ev) =>
              (ev.event_tags || []).some((tag) =>
                selectedTags.includes(tag.toLowerCase())
              )
            );

      const query = (filterInput?.value || "").toLowerCase().trim();
      const final = !query
        ? base
        : base.filter((event) => {
            const meta = getEventMeta(event);
            const eventName = (event.event_name || "").toLowerCase();
            const eventDate = (
              event.event_date_display ||
              meta.event_date_display ||
              ""
            ).toLowerCase();
            const eventPlace = (event.event_place || "").toLowerCase();
            const eventTags = (event.event_tags || []).map((tag) =>
              (tag || "").toLowerCase()
            );
            const metaWeekday = (meta.weekday || "").toLowerCase();
            const metaStatus = (meta.status || "").toLowerCase();

            return (
              eventName.includes(query) ||
              eventDate.includes(query) ||
              eventPlace.includes(query) ||
              eventTags.some((tag) => tag.includes(query)) ||
              metaWeekday.includes(query) ||
              metaStatus.includes(query)
            );
          });

      renderContent(applySort(final), allEventsContainer);
    });
  }

  loadData().then(() => {
    if (allEventsContainer) {
      renderContent(applySort(events), allEventsContainer);
    }

    if (recentlyViewed) {
      const viewedIds =
        JSON.parse(localStorage.getItem("recentlyViewed")) || [];

      const recentEvents = viewedIds
        .map((id) => events.find((e) => e.event_id === id))
        .filter((e) => e);

      renderContent(applySort(recentEvents), recentlyViewed);
      recentlyViewedButtons();
    }

    if (favoriteEvents) {
      const favoriteIds = JSON.parse(localStorage.getItem("favorites")) || [];

      const favoriteEventsList = favoriteIds
        .map((id) => events.find((e) => e.event_id === id))
        .filter((e) => e);

      renderContent(applySort(favoriteEventsList), favoriteEvents);
    }

    if (filterInput && allEventsContainer) {
      filterInput.addEventListener("input", function () {
        const query = filterInput.value.toLowerCase();
        const filteredData = events.filter((event) => {
          const meta = getEventMeta(event);
          const eventName = (event.event_name || "").toLowerCase();
          const eventDate = (
            event.event_date_display ||
            meta.event_date_display ||
            ""
          ).toLowerCase();
          const eventPlace = (event.event_place || "").toLowerCase();
          const eventTags = (event.event_tags || []).map((tag) =>
            (tag || "").toLowerCase()
          );
          const metaWeekday = (meta.weekday || "").toLowerCase();
          const metaStatus = (meta.status || "").toLowerCase();

          return (
            eventName.includes(query) ||
            eventDate.includes(query) ||
            eventPlace.includes(query) ||
            eventTags.some((tag) => tag.includes(query)) ||
            metaWeekday.includes(query) ||
            metaStatus.includes(query)
          );
        });
        renderContent(applySort(filteredData), allEventsContainer);
      });
    }

    tagDropdown(events);

    if (resetFilterButton && allEventsContainer) {
      resetFilterButton.addEventListener("click", () => {
        if (filterInput) filterInput.value = "";

        const allCheckbox = document.querySelector(
          "#tag-list input[data-value='all']"
        );
        if (allCheckbox) allCheckbox.checked = true;

        document
          .querySelectorAll(
            "#tag-list input.tag-option:not([data-value='all'])"
          )
          .forEach((checkbox) => (checkbox.checked = false));

        const tagBtnLabel = document.querySelector("#tag-filter-btn span");
        if (tagBtnLabel) tagBtnLabel.textContent = "Filter by tags";

        currentSort = defaultSort;
        const sortFilter = document.getElementById("sort-filter");
        if (sortFilter) sortFilter.value = defaultSort;

        window.dispatchEvent(
          new CustomEvent("tagsChanged", { detail: { selectedTags: ["all"] } })
        );

        renderContent(applySort(events), allEventsContainer);
      });
    }
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

    renderContent(applySort(filteredEvents), allEventsContainer);
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
      renderContent(applySort(favoriteEvents), container);
    } else {
      container.innerHTML = "<p>No favorite events yet!</p>"; // Provide feedback if no favorites
    }
  } else {
    renderContent(applySort(events), container); // Show all events
  }
}

function renderContent(eventsToRender, container) {
  if (!container) return;
  container.innerHTML = "";
  for (let event of eventsToRender) {
    const meta = getEventMeta(event);
    const enrichedEvent = {
      ...event,
      ...meta,
    };
    const eventContainerElement = createEventContainer(enrichedEvent);
    container.appendChild(eventContainerElement);
  }
}

// Slideshow functionality

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
