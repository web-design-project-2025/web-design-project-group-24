let events = [];

document.addEventListener("DOMContentLoaded", () => {
  const allEventsContainerElement =
    document.getElementById("all-events-container") ||
    document.getElementById("recently-viewed");

  const filterInput = document.getElementById("filter-input");

  loadData(allEventsContainerElement).then(() => {
    if (filterInput) {
      filterInput.addEventListener("input", function () {
        const query = filterInput.value.toLowerCase();
        const filteredData = events.filter((event) => {
          return (
            event.event_name.toLowerCase().includes(query) ||
            event.date_time_place.toLowerCase().includes(query) ||
            event.event_tags.some((tag) => tag.toLowerCase().includes(query))
          );
        });
        renderContent(filteredData, allEventsContainerElement);
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

  const eventImg = document.createElement("img");
  eventImg.classList.add("event-img");
  eventImg.src = event.event_image;
  eventContainerElement.appendChild(eventImg);

  const eventName = document.createElement("h3");
  eventName.classList.add("event-name");
  eventName.textContent = event.event_name;
  eventContainerElement.appendChild(eventName);

  const eventDate = document.createElement("h2");
  eventDate.classList.add("date-time-place");
  eventDate.textContent = event.date_time_place;
  eventContainerElement.appendChild(eventDate);

  const eventTags = document.createElement("p");
  eventTags.classList.add("event-tags");
  eventTags.textContent = event.event_tags.join(", ");
  eventContainerElement.appendChild(eventTags);

  const readMoreButton = document.createElement("button");
  readMoreButton.classList.add("button-1", "event-button");
  readMoreButton.textContent = "read more";

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

  if (viewed.length > 4) {
    viewed = viewed.slice(0, 4);
  }

  localStorage.setItem("recentlyViewed", JSON.stringify(viewed));
}

let slideIndex = 0;
const slides = document.getElementsByClassName("slide");

function plusSlides(n) {
  slideIndex += n;
  showSlides();
}

function showSlides() {
  if (!slides.length) return;
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex = (slideIndex + slides.length) % slides.length;
  slides[slideIndex].style.display = "block";
}

// // Auto slideshow
// setInterval(() => {
//   plusSlides(1);
// }, 4000);

// Initial display
document.addEventListener("DOMContentLoaded", showSlides);
