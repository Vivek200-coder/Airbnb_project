if (typeof coordinates !== 'undefined' && coordinates) {
  const map = L.map('map').setView(
    [coordinates[1], coordinates[0]],
    9
  );

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);

  L.marker([coordinates[1], coordinates[0]])
    .addTo(map)
    .bindPopup('<b>Exact Location provided after booking!</b>')
    .openPopup();
}