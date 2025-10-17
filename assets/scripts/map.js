/*
  Docs:
    - Field migration & deprecation: https://developers.google.com/maps/documentation/javascript/place_field_js_migration
    - PlacesService.getDetails + PlaceOpeningHours.isOpen(): https://developers.google.com/maps/documentation/javascript/reference/places-service
*/

let map;
let placesService;
let infoWindow;
let autocomplete;
let markers = [];
let markerRefs = []; // For linking cards and markers

const DEFAULT_CENTER = { lat: 35.4676, lng: -97.5164 };

window.initMap = function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: DEFAULT_CENTER,
    zoom: 13,
    mapTypeControl: false,
  });

  infoWindow = new google.maps.InfoWindow();
  placesService = new google.maps.places.PlacesService(map);

  // Geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        map.setCenter(userLoc);
        new google.maps.Marker({ map, position: userLoc, title: "Your location" });
      },
      () => console.warn("Geolocation denied; using default center.")
    );
  }

  // Autocomplete
  const input = document.getElementById("search-input");
  autocomplete = new google.maps.places.Autocomplete(input, {
    fields: [
      "geometry", "name", "formatted_address", "place_id",
      "opening_hours", "rating", "user_ratings_total",
      "types", "vicinity"
    ],
  });
  autocomplete.bindTo("bounds", map);
  autocomplete.addListener("place_changed", onAutocompletePlaceChanged);

  document.getElementById("search-button").addEventListener("click", () => {
    const q = input.value.trim();
    if (q) runTextSearch(q);
  });
};


// When a user picks an autocomplete suggestion
function onAutocompletePlaceChanged() {
  const place = autocomplete.getPlace();
  if (!place || !place.geometry) {
    const query = document.getElementById("search-input").value.trim();
    if (query) runTextSearch(query);
    return;
  }

  if (place.geometry.viewport) {
    map.fitBounds(place.geometry.viewport);
  } else {
    map.setCenter(place.geometry.location);
    map.setZoom(16);
  }

  clearMarkers();
  clearResults();

  // Show the selected place (marker + card)
  addMarker(place);
  appendResultCardWithOpenStatus(place);
  
  // Also run a broader Text Search using the query typed
  const query = document.getElementById("search-input").value.trim();
  if (query) runTextSearch(query);
}

// === main search logic ===
function runTextSearch(query) {
  const request = { query, location: map.getCenter(), radius: 5000 };

  placesService.textSearch(request, (results, status) => {
    if (status !== google.maps.places.PlacesServiceStatus.OK || !results) {
      console.warn("Places textSearch failed:", status);
      return;
    }

    clearMarkers();
    clearResults();
    markerRefs = [];

    // Only keep first 5 results
    const top5 = results.slice(0, 5);

    top5.forEach((place, idx) => {
      if (!place.geometry || !place.geometry.location) return;

      const marker = addMarker(place, idx + 1);
      markerRefs.push({ marker, place });

      // Add result card
      setTimeout(() => appendResultCard(place, idx + 1), 50 * idx);
    });

    fitMapToMarkers();
  });
}

// === markers & cards ===
function addMarker(place, index) {
  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
    title: place.name || "",
    label: String(index),
  });

  marker.addListener("click", () => showInfo(place, marker));
  markers.push(marker);
  return marker;
}

function showInfo(place, marker) {
  const address = place.formatted_address || place.vicinity || "(No address)";
  const rating = typeof place.rating === "number" ? place.rating.toFixed(1) : "N/A";
  const reviews = place.user_ratings_total ? ` (${place.user_ratings_total})` : "";
  const types = place.types ? place.types[0].replaceAll("_", " ") : "N/A";
  const openNowText = formatOpenStatus(place);

  const emoji = "⭐";
  infoWindow.setContent(`
    <div>
      <strong>${escapeHTML(place.name || "Unknown")}</strong><br/>
      ${escapeHTML(address)}<br/>
      ${emoji} ${escapeHTML(rating)}${escapeHTML(reviews)}<br/>
      Type: ${escapeHTML(types)}<br/>
      ${escapeHTML(openNowText)}
    </div>
  `);
  infoWindow.open(map, marker);
}

async function appendResultCard(place, index) {
  const container = document.getElementById("results");
  const card = document.createElement("div");
  card.classList.add("result-card");

  const name = place.name || "Unknown";
  const address = place.formatted_address || place.vicinity || "N/A";
  const rating = typeof place.rating === "number" ? place.rating.toFixed(1) : "N/A";
  const reviews = place.user_ratings_total ? ` (${place.user_ratings_total})` : "";
  const types = place.types ? place.types[0].replaceAll("_", " ") : "N/A";
  const openNowText = formatOpenStatus(place);
  const emoji = "⭐";

  // HTML using template literals
  card.innerHTML = `
      <h3>${index}. ${escapeHTML(name)}</h3>
      <p><span class="address">${escapeHTML(address)}</span></p>
      <br>
      <div class="tag-group">
        <p><span class="tag">${escapeHTML(types)}</span></p>
        <p><span class="tag">${emoji} ${escapeHTML(rating)} ${escapeHTML(reviews)}</span></p>
        <p><span class="tag">${escapeHTML(openNowText)}</span></p>
      </div>
  `;

  // click to focus marker
  card.addEventListener("click", () => {
    const ref = markerRefs.find(r => r.place.place_id === place.place_id);
    if (ref) {
      map.setCenter(ref.marker.getPosition());
      map.setZoom(16);
      showInfo(place, ref.marker);
    }
  });

  card.classList.add("result-card");
  container.appendChild(card);
}

function clearResults() {
  document.getElementById("results").innerHTML = "";
}

function clearMarkers() {
  markers.forEach((m) => m.setMap(null));
  markers = [];
}

function fitMapToMarkers() {
  if (markers.length === 0) return;
  const bounds = new google.maps.LatLngBounds();
  markers.forEach((m) => bounds.extend(m.getPosition()));
  map.fitBounds(bounds);
}

function formatOpenStatus(place) {
  if (place.opening_hours && typeof place.opening_hours.isOpen === "function") {
    try {
      return place.opening_hours.isOpen() ? "Open now" : "Closed";
    } catch {
      return "Not available";
    }
  }
  return "Not available";
}

function escapeHTML(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
