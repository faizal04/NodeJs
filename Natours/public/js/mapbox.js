export const displayMap = (locations) => {
  const map = L.map('map', {
    center: locations[0].coordinates,
    zoom: 15,
    scrollWheelZoom: false,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const bounds = L.latLngBounds();

  locations.forEach((loc) => {
    const [lat, lng] = loc.coordinates;

    const customIcon = L.divIcon({
      className: 'marker',
      iconSize: [32, 40],
      iconAnchor: [16, 40],
    });

    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

    const popup = L.popup({
      autoClose: false,
      closeOnClick: false,
      offset: [0, -20],
    })
      .setLatLng([lat, lng])
      .setContent(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .openOn(map);

    bounds.extend([lat, lng]);
  });

  map.fitBounds(bounds);
};
