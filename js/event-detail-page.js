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

  const detailTitleSmall = document.createElement("h4");
  detailTitleSmall.classList.add("detail-title-small");
  detailTitleSmall.textContent = event.detail_event_name;
  eventDetailPage.appendChild(detailTitleSmall);

  const detailImg = document.createElement("img");
  detailImg.classList.add("detail-img");
  detailImg.src = event.detail_image;
  eventDetailPage.appendChild(detailImg);

  const titleBio = document.createElement("section");
  titleBio.classList.add("title-bio");

  const detailTitleBig = document.createElement("h4");
  detailTitleBig.classList.add("detail-title-big");
  detailTitleBig.textContent = event.detail_event_name;
  titleBio.appendChild(detailTitleBig);

  const detailBio = document.createElement("p");
  detailBio.classList.add("detail-bio");
  detailBio.textContent = event.detail_event_bio;
  titleBio.appendChild(detailBio);

  const detailDetails = document.createElement("section");
  detailDetails.classList.add("detail-details");

  const heading = document.createElement("h2");
  heading.textContent = "Details";
  detailDetails.appendChild(heading);

  const city = document.createElement("p");
  city.textContent = `City:${event.detail_city}`;
  detailDetails.appendChild(city);

  const meetingPlace = document.createElement("p");
  meetingPlace.textContent = `Meeting Place: ${event.detail_meeting_place}`;
  detailDetails.appendChild(meetingPlace);

  const date = document.createElement("p");
  date.textContent = `Date: ${event.detail_date}`;
  detailDetails.appendChild(date);

  const time = document.createElement("p");
  time.textContent = `Time: ${event.detail_time}`;
  detailDetails.appendChild(time);

  const participants = document.createElement("p");
  participants.textContent = `Participants: ${event.detail_participants}`;
  detailDetails.appendChild(participants);

  const tags = document.createElement("p");
  tags.textContent = `Tags: ${event.detail_event_tags.join(", ")}`;
  detailDetails.appendChild(tags);

  const organizer = document.createElement("section");
  organizer.classList.add("organizer");

  const organizerTitle = document.createElement("h2");
  organizerTitle.textContent = "Organizer";
  organizer.appendChild(organizerTitle);

  const organizerImg = document.createElement("img");
  organizerImg.classList.add("organizer-img");
  organizerImg.src = event.detail_organizer_profile_img;
  organizer.appendChild(organizerImg);

  const organizerDetails = document.createElement("section");
  organizerDetails.classList.add("organizer-details");

  const organizerName = document.createElement("p");
  organizerName.classList.add("organizer-name");
  organizerName.textContent = event.detail_organizer_name;
  organizerDetails.appendChild(organizerName);

  const organizerEmail = document.createElement("p");
  organizerEmail.classList.add("organizer-email");
  organizerEmail.textContent = event.detail_organizer_email;

  const signMeUp = document.createElement("button");
  signMeUp.classList.add("button-1");
  signMeUp.textContent = "Sign me up";

  const ratings = document.createElement("section");
  ratings.classList.add("ratings");

  for (let i = 0; i < 5; i++) {
    const star = document.createElement("span");
    star.classList.add("star");
    star.innerHTML = "&#9734;"; // empty star, use &#9733; for filled
    ratings.appendChild(star);
  }

  organizerDetails.appendChild(ratings);

  eventDetailPage.appendChild(titleBio);
  eventDetailPage.appendChild(detailDetails);
  eventDetailPage.appendChild(organizer);

  organizer.appendChild(organizerDetails);

  organizerDetails.appendChild(organizerEmail);
  organizer.appendChild(ratings);

  organizer.appendChild(signMeUp);

  return eventDetailPage;
}
