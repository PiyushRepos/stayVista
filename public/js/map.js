maptilersdk.config.apiKey = mapToken;

const map = new maptilersdk.Map({
  container: "map", // container's id or the HTML element to render the map
  style: maptilersdk.MapStyle.STREETS,
  center: listing.geometry.coordinates, // starting position [lng, lat]
  zoom: 12, // starting zoom
});

const marker = new maptilersdk.Marker({ color: "red", offset: [0, -35] }) // Adjust the offset vertically
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new maptilersdk.Popup({ offset: 30 }).setHTML(
      `<h5>${listing.location}</h5><h6>Exact location provided after booking</h6>`
    )
  )
  .addTo(map);

