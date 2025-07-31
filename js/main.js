let events = [];
let detailed = [];
const contentElement = document.getElementById("content");

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

  return eventContainerElement;
}

function renderContent() {
  contentElement.innerHTML = "";

  for (let event of events) {
    const event = getEventById(event.id);
    const eventContainerElement = createEventContainer(event);
    contentElement.appendChild(eventContainerElement);
  }
}

loadData();
