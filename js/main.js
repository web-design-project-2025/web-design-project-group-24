let events = [];
let detailed = [];
const allEventsContainerElement = document.getElementById(
  "all-events-container"
);
// const filterInput = document.getElementById("filter-input");
// const filterResult = document.getElementById("filter-result");

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

  const eventDate = document.createElement("h2");
  eventDate.classList.add("date-time-place");
  eventDate.textContent = event.date_time_place;
  eventContainerElement.appendChild(eventDate);

  const eventTags = document.createElement("p");
  eventTags.classList.add("event-tags");
  eventTags.textContent = event.event_tags;
  eventContainerElement.appendChild(eventTags);

  const readMoreButton = document.createElement("button");
  readMoreButton.classList.add("button-1", "event-button");
  readMoreButton.textContent = "read more";

  const icon = document.createElement("i");
  icon.classList.add("bi", "bi-chevron-right");
  readMoreButton.appendChild(icon);

  readMoreButton.addEventListener("click", () => {
    window.location.href = `event-detail.html?id=${event.id}`;
  });

  eventContainerElement.appendChild(readMoreButton);

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

// Function to filter and display the results
// filterInput.addEventListener("input", function () {
//   const query = filterInput.value.toLowerCase();

//   const filteredData = eventData.filter((event) => {
//     return (
//       event.event_name.toLowerCase().includes(query) ||
//       event.event_tags.some((tag) => tag.toLowerCase().includes(query))
//     );
//   });

//   // Display filtered results
//   filteredResults.innerHTML = filteredData
//     .map(
//       (event) => `
//         <div>
//             <h3>${event.event_name}</h3>
//             <p>${event.date_time_place}</p>
//             <img src="${event.event_image}" alt="${
//         event.event_name
//       }" style="width:100px;height:auto;">
//             <p>Tags: ${event.event_tags.join(", ")}</p>
//         </div>
//     `
//     )
//     .join("");
// });

loadData();
