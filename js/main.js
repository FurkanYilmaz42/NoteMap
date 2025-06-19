import { personIcon } from "./constant.js";
import uiElement from "./ui.js";
import { formateDate, getNoteIcon, setStatus } from "./helpers.js";



let clickedCoords;
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let layer;
let map;

window.navigator.geolocation.getCurrentPosition(
  (e) => {
    loadMap([e.coords.latitude, e.coords.longitude]);
  },
  (e) => {
    loadMap([39.924771, 32.837034]);
  }
);

function loadMap(currentPosition) {
  map = L.map("map", { zoomControl: false }).setView(currentPosition, 10);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  L.control.zoom({ position: "bottomright" }).addTo(map);

  L.marker(currentPosition, { icon: personIcon }).addTo(map);

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
  uiElement.aside.classList.remove("add");
  e.preventDefault();
  uiElement.asideTitle.textContent = "Notlar";
});

uiElement.form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = e.target[0].value;
  const date = e.target[1].value;
  const status = e.target[2].value;

  if (!title || !date || !status) {
    alert("Lütfen formu eksiksiz şekilde doldurunuz!");

    return;
  }

  const noteObject = {
    id: new Date().getTime(),
    title,
    date,
    status,
    coords: clickedCoords,
  };

  notes.push(noteObject);

  localStorage.setItem("notes", JSON.stringify(notes));

  uiElement.form.reset();

  uiElement.asideTitle.textContent = "Notlar";

  uiElement.aside.classList.remove("add");

  renderNotes(notes);

  renderMarker(notes);
});

function renderNotes(notes) {
  const notesHtml = notes
    .map(
      (note) => `        <li>
          <div>
            <h3>${note.title}</h3>
            <p>${formateDate(note.date)}</p>
            <p class="status">${setStatus(note.status)}</p>
          </div>
          <div class="icons">
            <i data-id='${
              note.id
            }' id="fly-btn"><i class="bi bi-airplane-fill"></i></i>
            <i data-id='${
              note.id
            }' id="delete-btn"><i class="bi bi-trash"></i></i>
          </div>
        </li>`
    )
    .join("");

  uiElement.noteList.innerHTML = notesHtml;

  document.querySelectorAll("#delete-btn").forEach((icon) => {
    const id = +icon.dataset.id;

    icon.addEventListener("click", () => {
      deleteNote(id);
    });
  });

  document.querySelectorAll("#fly-btn").forEach((btn) => {
    const noteId = +btn.dataset.id;

    btn.addEventListener("click", () => {
      flyToNote(noteId);
    });
  });
}

function renderMarker(notes) {
  layer.clearLayers();
  notes.map((note) => {
    const noteIcon = getNoteIcon(note.status);

    L.marker(note.coords, { icon: noteIcon }).addTo(layer);
  });
}

function deleteNote(id) {
  const response = confirm("Not silme işlemini onaylıyor musunuz ?");

  if (response) {
    notes = notes.filter((note) => note.id != id);

    localStorage.setItem("notes", JSON.stringify(notes));

    renderNotes(notes);
    renderMarker(notes);
  }
}

function flyToNote(id) {
  const foundedNote = notes.find((note) => note.id == id);

  map.flyTo(foundedNote.coords, 15);
}

uiElement.asideArrow.addEventListener("click", () => {
  uiElement.aside.classList.toggle("hide");
});
