let events = [];
let detailed = [];
const allEventsContainerElement = document.getElementById(
  "all-events-container"
);

async function loadData() {
  const eventResponse = await fetch("data/events.json");
  const eventJSON = await eventResponse.json();
  events = eventJSON.events;

  renderContent();
}

function getEventById(id) {
  return events.find((event) => event.id === id);
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

  return eventContainerElement;
}

function renderContent() {
  allEventsContainerElement.innerHTML = "";

  for (let event of events) {
    const eventDetails = getEventById(event.id);
    const eventContainerElement = createEventContainer(eventDetails);
    allEventsContainerElement.appendChild(eventContainerElement);
  }
}

loadData();
