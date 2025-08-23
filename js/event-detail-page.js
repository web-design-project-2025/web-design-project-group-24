import {
  createEventContainer,
  addToRecentlyViewed,
  recentlyViewedButtons,
  addToSignedUp,
  isSignedUp,
} from "./functions.js";

const LOGGED_IN_KEY = "loggedIn";
const isAuthed = () =>
  localStorage.getItem(LOGGED_IN_KEY) === "true" ||
  sessionStorage.getItem(LOGGED_IN_KEY) === "true";

function getEventIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function organizerRatings(event) {
  const fields = ["detail_organizer_rating"];

  for (const field of fields) {
    const value = event[field];
    if (value !== undefined && value !== null && !Number.isNaN(Number(value))) {
      return Math.max(0, Math.min(5, Number(value)));
    }
  }
  return 0; // Default rating if not found
}

document.addEventListener("DOMContentLoaded", async () => {
  const eventId = getEventIdFromURL();

  const res = await fetch("data/eventDetails.json");
  const data = await res.json();
  const events = data.events || [];

  const event = events.find((e) => e.event_id === eventId);
  if (!event) return;

  const main = document.querySelector("main");
  main.prepend(createDetailPage(event));

  addToRecentlyViewed(event.event_id);
  renderRecentlyViewed(events, eventId);
  recentlyViewedButtons();
});

function createDetailPage(event) {
  const eventDetailPage = document.createElement("section");
  eventDetailPage.classList.add("event-detail-page");

  const detailTitleSmall = document.createElement("h1");
  detailTitleSmall.classList.add("detail-title-small");
  detailTitleSmall.textContent = event.detail_event_name;
  eventDetailPage.appendChild(detailTitleSmall);

  const detailImg = document.createElement("img");
  detailImg.classList.add("detail-img");
  detailImg.src = event.detail_image;
  eventDetailPage.appendChild(detailImg);

  const titleBio = document.createElement("section");
  titleBio.classList.add("title-bio");

  const detailTitleBig = document.createElement("h1");
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
  city.textContent = `City: ${event.detail_city}`;
  detailDetails.appendChild(city);

  const meetingPlace = document.createElement("p");
  meetingPlace.textContent = `Meeting Place:${event.detail_meeting_place}`;
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
  signMeUp.classList.add("button-1", "sign-me-up");
  signMeUp.textContent = "Sign me up";

  const updateBtn = () => {
    const on = isSignedUp(event.event_id);
    signMeUp.textContent = on ? "Signed up" : "Sign me up";
    signMeUp.classList.toggle("is-signed", on);
  };
  updateBtn();

  signMeUp.addEventListener("click", () => {
    if (!isAuthed()) {
      localStorage.setItem("redirectAfterLogin", window.location.href);
      window.location.href = "login.html";
      return;
    }

    addToSignedUp(event.event_id);
    updateBtn();

    window.dispatchEvent(
      new CustomEvent("signupsChanged", {
        detail: {
          eventId: event.event_id,
          signedUp: isSignedUp(event.event_id),
        },
      })
    );
  });

  const ratingValue = organizerRatings(event);
  const ratings = document.createElement("section");
  ratings.classList.add("ratings");

  const filled = Math.round(ratingValue);
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.className = i <= filled ? "star-filled" : "star-empty";
    star.textContent = i <= filled ? "★" : "☆";
    ratings.appendChild(star);
  }

  eventDetailPage.appendChild(titleBio);
  eventDetailPage.appendChild(detailDetails);
  eventDetailPage.appendChild(organizer);

  organizer.appendChild(organizerDetails);
  organizer.appendChild(ratings);
  organizer.appendChild(signMeUp);

  return eventDetailPage;
}

function renderRecentlyViewed(allEvents, currentId) {
  const container = document.getElementById("recently-viewed");
  if (!container) return;

  let ids = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
  ids = ids.filter((id) => id && id !== currentId);

  container.innerHTML = "";
  ids.forEach((id) => {
    const ev = allEvents.find((e) => e.event_id === id);
    if (!ev) return;

    const listEvent = {
      event_id: ev.event_id,
      event_image: ev.detail_image,
      event_name: ev.detail_event_name,
      event_place: ev.detail_city,
      event_date_time: ev.detail_date,
      event_tags: ev.detail_event_tags || [],
    };

    container.appendChild(createEventContainer(listEvent));
  });
}
