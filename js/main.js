import { personIcon } from "./constant.js";

window.navigator.geolocation.getCurrentPosition(
  (e) => {
    loadMap([e.coords.latitude, e.coords.longitude]);
  },
  (e) => {
    loadMap([39.924771, 32.837034]);
  }
);

function loadMap(currentPosition) {
  var map = L.map("map", { zoomControl: false }).setView(currentPosition, 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  L.control.zoom({position: "bottomright"}).addTo(map);

  L.marker(currentPosition, { icon: personIcon }).addTo(map);

  map.on("click", onMapClick);
}

function onMapClick(e) {
  let clickedCoords = [e.latlng.lat, e.latlng.lng];

  console.log(clickedCoords);
}
