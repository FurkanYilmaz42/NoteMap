import { personIcon } from "./constant.js";
import { getNoteIcon, setStatus, formateDate } from "./helpers.js";
import uiElement from "./ui.js";
let clickedCoords;
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let map, layer;
navigator.geolocation.getCurrentPosition(
  (e) => loadMap([e.coords.latitude, e.coords.longitude]),
  () => loadMap([39.92, 32.85])
);
function loadMap(position) {
  map = L.map("map", { zoomControl: false }).setView(position, 10);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);
  L.control.zoom({ position: "bottomright" }).addTo(map);
  L.marker(position, { icon: personIcon }).addTo(map);
  layer = L.layerGroup().addTo(map);
  map.on("click", onMapClick);
  renderNotes(notes);
  renderMarker(notes);
}
function onMapClick(e) {
  clickedCoords = [e.latlng.lat, e.latlng.lng];
  uiElement.aside.classList.add("add");
  uiElement.asideTitle.textContent = "Yeni Not";
}
uiElement.cancelBtn.addEventListener("click", (e) => {
  e.preventDefault();
  uiElement.aside.classList.remove("add");
  uiElement.asideTitle.textContent = "Notlar";
});
uiElement.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = e.target[0].value;
  const date = e.target[1].value;
  const status = e.target[2].value;
  if (!title || !date || !status) return alert("Lütfen tüm alanları doldurun");
  const newNote = {
    id: Date.now(),
    title,
    date,
    status,
    coords: clickedCoords,
  };
  notes.push(newNote);
  localStorage.setItem("notes", JSON.stringify(notes));
  uiElement.form.reset();
  uiElement.aside.classList.remove("add");
  uiElement.asideTitle.textContent = "Notlar";
  renderNotes(notes);
  renderMarker(notes);
});
function renderNotes(data) {
  uiElement.noteList.innerHTML = data
    .map(
      (note) => `
      <li>
        <div>
          <h3>${note.title}</h3>
          <p>${formateDate(note.date)}</p>
          <p class="status">${setStatus(note.status)}</p>
        </div>
        <div class="icons">
          <i data-id="${note.id}" class="bi bi-airplane-fill fly-btn"></i>
          <i data-id="${note.id}" class="bi bi-trash delete-btn"></i>
        </div>
      </li>`
    )
    .join("");
  document
    .querySelectorAll(".fly-btn")
    .forEach((btn) =>
      btn.addEventListener("click", () => flyToNote(+btn.dataset.id))
    );
  document
    .querySelectorAll(".delete-btn")
    .forEach((btn) =>
      btn.addEventListener("click", () => deleteNote(+btn.dataset.id))
    );
}
function renderMarker(data) {
  layer.clearLayers();
  data.forEach((note) => {
    const icon = getNoteIcon(note.status);
    const marker = L.marker(note.coords, { icon }).addTo(layer);
    marker.on("click", () => showNoteInAside(note));
  });
}
function showNoteInAside(note) {
  uiElement.aside.classList.remove("add", "hide");
  uiElement.asideTitle.textContent = "Not Detayı";
  uiElement.noteList.innerHTML = `
    <li>
      <div>
        <h3>${note.title}</h3>
        <p>${formateDate(note.date)}</p>
        <p class="status">${setStatus(note.status)}</p>
      </div>
      <div class="icons">
        <i data-id="${note.id}" class="bi bi-airplane-fill fly-btn"></i>
        <i data-id="${note.id}" class="bi bi-trash delete-btn"></i>
      </div>
    </li>
  `;
  document
    .querySelector(".fly-btn")
    .addEventListener("click", () => flyToNote(note.id));
  document
    .querySelector(".delete-btn")
    .addEventListener("click", () => deleteNote(note.id));
}
function deleteNote(id) {
  if (!confirm("Silmek istediğine emin misin?")) return;
  notes = notes.filter((n) => n.id !== id);
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes(notes);
  renderMarker(notes);
}
function flyToNote(id) {
  const note = notes.find((n) => n.id === id);
  if (note) map.flyTo(note.coords, 15);
}
uiElement.asideArrow.addEventListener("click", () => {
  uiElement.aside.classList.toggle("hide");
});
