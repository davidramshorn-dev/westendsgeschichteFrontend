import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, WMSTileLayer } from
'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './style.css';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// --- ICONS ---
const standardIcon = L.icon({
iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
,
iconSize: [25, 41],
iconAnchor: [12, 41],
popupAnchor: [1, -34]
});

const specialIcon = L.icon({
iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
,
className: 'marker-lila',
iconSize: [25, 41],
iconAnchor: [12, 41],
popupAnchor: [1, -34]
});

const uBahnIcon = L.icon({
iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/U-Bahn_Berlin_logo.svg/120px-U-Bahn_Berlin_logo.svg.png',
iconSize: [22, 22],
iconAnchor: [11, 11],
className: 'u-bahn-icon-fix'
});

// Steuert die Kamera bei Quiz-Fragen
function MapController({ targetCoords }) {
const map = useMap();
useEffect(() => {
if (targetCoords) {
map.flyTo(targetCoords, map.getZoom(), { duration: 1.2 });
}
}, [targetCoords, map]);
return null;
}

// --- DATEN ---
const locations = [
{
id: 'lfs',
name: 'Liebfrauenschule',
coords: [52.5112, 13.2750],
from: 1923,
importance: 'detail',
isQuizRelevant: true,
text:
'Die Liebfrauenschule (LFS) in der Ahornallee ist eine traditionsreiche Schule im Westend. Gegründet wurde sie von den Schwestern Unserer Lieben Frau.'
,
img: 'https://via.placeholder.com/600x400?text=Liebfrauenschule'
},
{
id: 'brixplatz',
name: 'Brixplatz',
coords: [52.5188, 13.2553],
from: 1900,
importance: 'detail',
isQuizRelevant: true,
text:
'Der Brixplatz ist ein grünes Juwel. Er wurde als geologischer Garten angelegt und zeigt verschiedene Gesteinsschichten.'
,
img: 'https://via.placeholder.com/600x400?text=Brixplatz'
},
{
id: 'theodor-heuss-platz',
name: 'Theodor-Heuss-Platz',
coords: [52.51000, 13.27250],
from: 1906,
importance: 'u-bahn',
isQuizRelevant: true,
text:
'Ein zentraler Verkehrsknotenpunkt. Er hieß früher Reichskanzlerplatz und ist das Tor zum Westend.'
,
img: 'https://via.placeholder.com/600x400?text=Theodor-Heuss-Platz'
}
];

export default function App() {
const [year, setYear] = useState(2026);
const [selectedPlace, setSelectedPlace] = useState(null);
const [activeQuestion, setActiveQuestion] = useState(null);
const [quizJumpCoords, setQuizJumpCoords] = useState(null);

const visibleMarkers = locations.filter(loc => year >= loc.from);

const startQuiz = () => {
const quizPlaces = locations.filter(l => l.isQuizRelevant);
const randomPlace = quizPlaces[Math.floor(Math.random() * quizPlaces.
length)];
setActiveQuestion({ q: `Wo befindet sich "${randomPlace.name}"?`,
locationId: randomPlace.id });
setQuizJumpCoords(null);
};

const handleQuizJump = () => {
const target = locations.find(l => l.id === activeQuestion.locationId);
if (target) setQuizJumpCoords(target.coords);
};

return (
<div className="app-container">

{/* DETAIL-OVERLAY MIT ANIMATIONS-FIX */}
{selectedPlace && (
<div className="detail-overlay">
<button className="close-x" onClick={() => setSelectedPlace(null)}
> ✕</button>

<div className="detail-content" key={selectedPlace.id}>
<h1 className="fade-in-element">
{selectedPlace.name}
</h1>

{selectedPlace.img && (
<img
className="detail-img fade-in-element"
style={{ animationDelay: '0.1s' }}
src={selectedPlace.img}
alt={selectedPlace.name}
/>
)}

<p className="detail-text fade-in-element" style={{
animationDelay: '0.2s' }}>
{selectedPlace.text}
</p>
</div>
</div>
)}

{/* KARTE */}
<div className="map-section">
<div className="year-bar">
{[1866, 1925, 2026].map(y => (
<button key={y} className={year === y ? 'active' : ''} onClick={
() => setYear(y)}>
{y === 2026 ? 'Heute' : y}
</button>
))}
</div>

<MapContainer center={[52.513, 13.263]} zoom={15}>
<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
" />

{year === 1925 && (
<WMSTileLayer
url="
https://fbinter.stadt-berlin.de/fb/wms/senstadt/k_luftbild1928"
layers="0" format="image/png" transparent={true} opacity={0.6}
/>
)}

<MapController targetCoords={quizJumpCoords} />

{visibleMarkers.map(loc => {
let currentIcon = standardIcon;
if (loc.importance === 'detail') currentIcon = specialIcon;
if (loc.importance === 'u-bahn') currentIcon = uBahnIcon;

return (
<Marker
key={loc.id}
position={loc.coords}
icon={currentIcon}
eventHandlers={{
click: (e) => {
if (loc.importance === 'detail' || loc.importance ===
'u-bahn') {
setSelectedPlace(loc);
e.target.closePopup();
}
}
}}
/>
);
})}
</MapContainer>
</div>

{/* QUIZ-BEREICH */}
<div className="quiz-section">
<h3>Westend Challenge</h3>
<button onClick={() => window.location.href = "https://andere-seite.de"}>
  Quiz starten
</button>
</div>
</div>                                                                                                                                                                           
);
}