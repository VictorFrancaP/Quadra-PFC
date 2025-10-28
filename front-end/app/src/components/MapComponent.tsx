import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

interface MapQuadraInfo {
  id: string;
  name: string;
  latitude?: number | null;
  longitude?: number | null;
  priceHour?: number;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface MapComponentProps {
  quadras: MapQuadraInfo[];
  userLocation?: UserLocation | null;
  initialZoom?: number;
}

const defaultIcon = L.icon({
     iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
     iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
     shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
     iconSize: [25, 41],
     iconAnchor: [12, 41],
     popupAnchor: [1, -34],
     tooltipAnchor: [16, -28],
     shadowSize: [41, 41]
});
const userIcon = L.icon({
     iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
     shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
     iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const ChangeMapView = ({ center }: { center: LatLngExpression }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  quadras,
  userLocation,
  initialZoom = 13,
}) => {
  let mapCenter: LatLngExpression;

  if (userLocation?.latitude && userLocation?.longitude) {
    mapCenter = [userLocation.latitude, userLocation.longitude];
  } else if (quadras.length > 0 && quadras[0].latitude && quadras[0].longitude) {
    mapCenter = [quadras[0].latitude, quadras[0].longitude];
  } else {
    mapCenter = [-23.5238, -46.1888];
  }

  return (
    <MapContainer center={mapCenter} zoom={initialZoom} style={{ height: '500px', width: '100%', borderRadius: '8px' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ChangeMapView center={mapCenter} />

      {userLocation?.latitude && userLocation?.longitude && (
        <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon} >
          <Popup>Sua Localização Aproximada</Popup>
        </Marker>
      )}
      {quadras.map((quadra) => {
        if (quadra.latitude && quadra.longitude) {
          return (
            <Marker
              key={quadra.id}
              position={[quadra.latitude, quadra.longitude]}
              icon={defaultIcon}
            >
              <Popup>
                <strong>{quadra.name}</strong><br />
                {quadra.priceHour ? `A partir de ${quadra.priceHour.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/hora` : 'Preço não informado'}
                <br />
                <a href={`/quadra/${quadra.id}`} target="_blank" rel="noopener noreferrer">Ver detalhes</a>
              </Popup>
            </Marker>
          );
        }
        return null;
      })}

    </MapContainer>
  );
};