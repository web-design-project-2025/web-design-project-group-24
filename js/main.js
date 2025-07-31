let events = [];
let detailed = [];
const allEventsContainerElement = document.getElementById(
  "all-events-container"
);
const filterInput = document.getElementById("filter-input");

async function loadData() {
  const eventResponse = await fetch("data/events.json");
  const eventJSON = await eventResponse.json();
  events = eventJSON.events;

  renderContent(events);
}

function getEventById(id) {
  return events.find((event) => event.event_id === id);
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
    window.location.href = `event-detail.html?id=${event.event_id}`;
  });

  eventContainerElement.appendChild(readMoreButton);

  return eventContainerElement;
}

function renderContent(eventsToRender) {
  allEventsContainerElement.innerHTML = "";

  for (let event of eventsToRender) {
    const eventDetails = getEventById(event.event_id);
    const eventContainerElement = createEventContainer(eventDetails);
    allEventsContainerElement.appendChild(eventContainerElement);
  }
}

// Load data and set up event listeners
loadData().then(() => {
  // Function to filter and display the results
  filterInput.addEventListener("input", function () {
    const query = filterInput.value.toLowerCase();

    const filteredData = events.filter((event) => {
      return (
        event.event_name.toLowerCase().includes(query) ||
        event.date_time_place.toLowerCase().includes(query) ||
        event.event_tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });

    renderContent(filteredData); // Update displayed events with filtered data
  });
});
