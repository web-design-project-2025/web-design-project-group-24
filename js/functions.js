export function createEventContainer(event) {
  const eventContainerElement = document.createElement("article");
  eventContainerElement.classList.add("event-container");
  eventContainerElement.dataset.eventId = event.event_id;

  if (event.status) {
    eventContainerElement.dataset.status = event.status;
  }

  const wrapperHeart = document.createElement("div");
  wrapperHeart.classList.add("event-wrapper-heart");
  eventContainerElement.appendChild(wrapperHeart);

  const eventImg = document.createElement("img");
  eventImg.classList.add("event-img");
  eventImg.src = event.event_image;
  eventImg.style.cursor = "pointer";
  wrapperHeart.appendChild(eventImg);

  eventImg.addEventListener("click", () => {
    addToRecentlyViewed(event.event_id);
    window.location.href = `event-detail.html?id=${event.event_id}`;
  });

  const favoriteBtn = createFavoriteButton(event.event_id);
  wrapperHeart.appendChild(favoriteBtn);

  if (event.status) {
    const statusMap = {
      past: "Past",
      today: "Today",
      tomorrow: "Tomorrow",
      "this-week": "This week",
      "this-month": "This month",
    };
    const statusElement = document.createElement("span");
    statusElement.classList.add("status-label");
    statusElement.textContent = statusMap[event.status] || event.status;
    eventContainerElement.appendChild(statusElement);
  }

  const eventName = document.createElement("h1");
  eventName.classList.add("event-name");
  eventName.textContent = event.event_name;
  eventName.style.cursor = "pointer";
  eventContainerElement.appendChild(eventName);

  eventName.addEventListener("click", () => {
    addToRecentlyViewed(event.event_id);
    window.location.href = `event-detail.html?id=${event.event_id}`;
  });

  const eventPlace = document.createElement("h2");
  eventPlace.classList.add("place");
  eventPlace.textContent = event.event_place;
  eventContainerElement.appendChild(eventPlace);

  const eventDate = document.createElement("span");
  eventDate.classList.add("date-time-place");
  eventDate.textContent = event.event_date_display || event.event_date_time;
  eventContainerElement.appendChild(eventDate);

  const eventTags = document.createElement("p");
  eventTags.classList.add("event-tags");
  eventTags.textContent = (event.event_tags || []).join(", ");
  eventContainerElement.appendChild(eventTags);

  const readMoreButton = document.createElement("button");
  readMoreButton.classList.add("button-1", "event-button");
  readMoreButton.textContent = "Read more";

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

export function addToRecentlyViewed(eventId) {
  let viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

  viewed = viewed.filter((id) => id !== eventId);
  viewed.unshift(eventId);

  if (viewed.length > 12) {
    viewed = viewed.slice(0, 12);
  }

  localStorage.setItem("recentlyViewed", JSON.stringify(viewed));
}

export function recentlyViewedButtons() {
  const rvContainer = document.getElementById("recently-viewed");
  const rvPrev = document.querySelector(".rv-prev");
  const rvNext = document.querySelector(".rv-next");

  if (rvContainer && rvPrev && rvNext) {
    rvPrev.addEventListener("click", () => {
      rvContainer.scrollBy({
        left: -rvContainer.offsetWidth,
        behavior: "smooth",
      });
    });

    rvNext.addEventListener("click", () => {
      rvContainer.scrollBy({
        left: rvContainer.offsetWidth,
        behavior: "smooth",
      });
    });
  }
}

export function createFavoriteButton(eventId) {
  const favoriteBtn = document.createElement("button");
  favoriteBtn.classList.add("favorite-btn");
  favoriteBtn.dataset.eventId = eventId;

  const setIcon = (btn = favoriteBtn) => {
    const fav = isFavorited(eventId);
    btn.innerHTML = `<i class="bi ${fav ? "bi-heart-fill" : "bi-heart"}"></i>`;
  };

  setIcon();

  favoriteBtn.addEventListener("click", async () => {
    const wasFav = isFavorited(eventId);
    addToFavorites(eventId);

    const isNowFav = !wasFav;

    setIcon();

    document
      .querySelectorAll(`.favorite-btn[data-event-id="${eventId}"]`)
      .forEach((btn) => setIcon(btn));

    window.dispatchEvent(
      new CustomEvent("favoritesChanged", {
        detail: { eventId, favorited: isNowFav },
      })
    );

    if (!window.location.pathname.includes("favorites.html")) return;

    const list = document.getElementById("favorite-events-container");
    if (!list) return;

    if (wasFav) {
      const favCard = list.querySelector(
        `.event-container[data-event-id="${eventId}"]`
      );
      if (favCard) favCard.remove();
    } else if (list) {
      const res = await fetch("data/events.json");
      const { events = [] } = await res.json();
      const ev = events.find((e) => e.event_id === eventId);
      if (ev) {
        list.prepend(createEventContainer(ev));
      }
    }
  });

  return favoriteBtn;
}

export function addToFavorites(eventId) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.includes(eventId)) {
    // Remove from favorites
    favorites = favorites.filter((id) => id !== eventId);
  } else {
    // Add to favorites
    favorites.unshift(eventId);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
}

export function isFavorited(eventId) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  return favorites.includes(eventId);
}

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  } catch {
    return [];
  }
}

export function updateHeaderHeartUI({ animate = false } = {}) {
  const icons = document.querySelectorAll(
    'header a[href="favorites.html"] i.bi'
  );
  const hasFavs = getFavorites().length > 0;

  icons.forEach((icon) => {
    icon.classList.remove("bi-heart-fill", "bi-heart");
    icon.classList.add(hasFavs ? "bi-heart-fill" : "bi-heart");

    if (animate) {
      icon.classList.remove("header-heart-animate");
      icon.offsetWidth;
      icon.classList.add("header-heart-animate");

      setTimeout(() => icon.classList.remove("header-heart-animate"), 500);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateHeaderHeartUI({ animate: false });
});

window.addEventListener("favoritesChanged", (e) => {
  const { favorited } = e.detail || {};
  updateHeaderHeartUI({ animate: !!favorited });
});

export async function tagDropdown(events) {
  const tagFilter = document.getElementById("tag-filter-btn");
  const tagList = document.getElementById("tag-list");
  if (!tagFilter || !tagList) return;

  const set = new Set();
  (events || []).forEach((e) =>
    (e.event_tags || []).forEach((tag) => set.add(tag))
  );
  const tags = ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];

  tagList.innerHTML = "";
  tags.forEach((tag) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "tag-option";
    checkbox.dataset.value = tag === "All" ? "all" : tag.toLowerCase();
    if (tag === "All") checkbox.checked = true;

    const text = document.createElement("span");
    text.textContent = tag;

    label.appendChild(checkbox);
    label.appendChild(text);
    tagList.appendChild(label);
  });

  tagFilter.addEventListener("click", (e) => {
    e.preventDefault();
    tagList.hidden = !tagList.hidden;
  });

  document.addEventListener("click", (e) => {
    if (!tagList.hidden) {
      if (!tagList.contains(e.target) && !tagFilter.contains(e.target)) {
        tagList.hidden = true;
      }
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !tagList.hidden) {
      tagList.hidden = true;
      tagFilter.focus(); // optional: return focus to button
    }
  });

  const updateAndFilter = () => {
    const allCheckbox = tagList.querySelector(
      "input.tag-option[data-value='all']"
    );
    let selectedTags = [
      ...tagList.querySelectorAll("input.tag-option:checked"),
    ].map((el) => el.dataset.value);

    if (selectedTags.includes("all") && selectedTags.length > 1) {
      if (allCheckbox) allCheckbox.checked = false;
      selectedTags = selectedTags.filter((tag) => tag !== "all");
    }

    if (selectedTags.length === 0) {
      selectedTags = ["all"];
      if (allCheckbox) allCheckbox.checked = true;
    }

    let labelText = "Filter by tags";
    if (!selectedTags.includes("all")) {
      if (selectedTags.length === 1) {
        labelText = selectedTags[0];
      } else if (selectedTags.length === 2) {
        labelText = selectedTags.join(", ");
      } else {
        labelText = `${selectedTags.length} tags selected`;
      }
    }

    tagFilter.querySelector("span").textContent = labelText;

    window.dispatchEvent(
      new CustomEvent("tagsChanged", {
        detail: { selectedTags },
      })
    );
  };

  tagList.addEventListener("change", (e) => {
    const input = e.target;
    if (!(input instanceof HTMLInputElement)) return;
    if (!input.classList.contains("tag-option")) return;

    if (input.dataset.value === "all" && input.checked) {
      tagList
        .querySelectorAll("input.tag-option:not([data-value='all'])")
        .forEach((checkbox) => (checkbox.checked = false));
    }

    updateAndFilter();
  });
}

export function getEventMeta(
  event,
  { locale = "sv-SE", timeZone = "Europe/Stockholm" } = {}
) {
  const now = new Date();
  const eventDate = new Date(event.event_date_time);

  const upperFirst = (s) =>
    s.replace(/^./u, (c) => c.toLocaleUpperCase(locale));

  const displayRaw = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    year: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  }).format(eventDate);

  const event_date_display = upperFirst(displayRaw).replace(", ", " kl. ");

  const weekdayRaw = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    timeZone,
  }).format(eventDate);

  const weekday =
    weekdayRaw.substring(0, 1).toLocaleUpperCase(locale) +
    weekdayRaw.substring(1);

  const toLocalMidnight = (date) => {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);
    const year = parts.find((p) => p.type === "year").value;
    const month = parts.find((p) => p.type === "month").value;
    const day = parts.find((p) => p.type === "day").value;
    return new Date(`${year}-${month}-${day}T00:00:00`);
  };

  const todayMidnight = toLocalMidnight(now);
  const eventMidnight = toLocalMidnight(eventDate);
  const diffDays = Math.round(
    (eventMidnight - todayMidnight) / (1000 * 60 * 60 * 24)
  );

  let status;
  if (event.past === true || diffDays < 0) status = "past";
  else if (diffDays === 0) status = "today";
  else if (diffDays === 1) status = "tomorrow";
  else if (diffDays <= 7) status = "this-week";
  else if (diffDays <= 30) status = "this-month";
  {
    return {
      event_date_display,
      weekday,
      status,
    };
  }
}

export const SORT_MODES = {
  DATE: "date",
  PASSED: "passed",
  // PARTICIPANTS: "participants",
};

export function sortEvents(list, mode = SORT_MODES.DATE) {
  const items = (list || []).map((e) => ({ e, meta: getEventMeta(e) }));
  const byAsc = (a, b) =>
    new Date(a.e.event_date_time) - new Date(b.e.event_date_time);

  let sorted;
  if (mode === SORT_MODES.DATE) {
    sorted = items.filter((x) => x.meta.status !== "past").sort(byAsc);
  } else if (mode === SORT_MODES.PASSED) {
    sorted = items
      .filter((x) => x.meta.status === "past")
      .sort(
        (a, b) => new Date(b.e.event_date_time) - new Date(a.e.event_date_time)
      );
  } else {
    const past = items.filter((x) => x.meta.status === "past").sort(byAsc);
    sorted = [...past];
  }

  return sorted.map((x) => ({ ...x.e, ...x.meta }));
}
