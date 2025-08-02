function getEventIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

document.addEventListener("DOMContentLoaded", async () => {
  const eventId = getEventIdFromURL();

  const eventResponse = await fetch("data/eventDetails.json");
  const data = await eventResponse.json();
  const events = data.events;

  const event = events.find((e) => e.event_id === eventId);

  if (event) {
    const detailPage = createDetailPage(event);
    const main = document.querySelector("main");
    main.appendChild(detailPage);
  }
});

function createDetailPage(event) {
  const eventDetailPage = document.createElement("section");
  eventDetailPage.classList.add("event-detail-page");

  const detailTitleBig = document.createElement("h4");
  detailTitleBig.classList.add("detail-title-big");
  detailTitleBig.textContent = event.detail_event_name;
  eventDetailPage.appendChild(detailTitleBig);

  const detailTitleSmall = document.createElement("h4");
  detailTitleSmall.classList.add("detail-title-small");
  detailTitleSmall.textContent = event.detail_event_name;
  eventDetailPage.appendChild(detailTitleSmall);

  const detailImg = document.createElement("img");
  detailImg.classList.add("detail-img");
  detailImg.src = event.detail_image;
  eventDetailPage.appendChild(detailImg);

  return eventDetailPage;
}
