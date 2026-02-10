(function () {
  // Do nothing if listing is not available
  if (typeof listing === "undefined") {
    return;
  }

  mapboxgl.accessToken = mapToken;

  // Use saved geometry or fallback
  const coordinates =
    listing.geometry &&
    Array.isArray(listing.geometry.coordinates)
      ? listing.geometry.coordinates
      : [77.209, 28.6139]; // fallback (Delhi)

  // Create map
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: coordinates,
    zoom: 10,
  });

  map.addControl(new mapboxgl.NavigationControl());

  // POPUP
  const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
    <h6>${listing.title}</h6>
    <p>${listing.location}</p>
  `);

  //  MARKER WITH POPUP
  new mapboxgl.Marker({ color: "red" })
    .setLngLat(coordinates)
    .setPopup(popup) 
    .addTo(map);
})();
