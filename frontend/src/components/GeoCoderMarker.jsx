import React, { useEffect, useState } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import * as ELG from 'esri-leaflet-geocoder';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

const GeoCoderMarker = ({ address }) => {
  const map = useMap();
  const [position, setPosition] = useState([60, 19]);

  useEffect(() => {
    ELG.geocode({
      apikey: import.meta.env.VITE_ESRI_API_KEY,
    })
      .text(address)
      //.run((err, results, response) => {
      .run((err, results /*response*/) => {
        //console.log(err);
        if (err) {
          console.error('Geocode error:', err);
          return;
        }

        const first = results?.results?.[0];
        const latlng = first?.latlng;

        if (latlng) {
          const { lat, lng } = latlng;
          setPosition([lat, lng]);
          map.flyTo([lat, lng], 6);
        } else {
          console.warn('No geocode results for:', address, results);
        }
      });
  }, [address, map]);

  return (
    <Marker position={position} icon={DefaultIcon}>
      <Popup>{address}</Popup>
    </Marker>
  );
};

export default GeoCoderMarker;
