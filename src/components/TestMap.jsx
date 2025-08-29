import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix necessário para os ícones
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const TestMap = () => {
  const position = [-23.5505, -46.6333]; // Coordenadas de São Paulo

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-6">Teste do Mapa</h2>
      
      <div style={{ height: '400px', width: '100%' }} className="rounded-lg overflow-hidden">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position}>
            <Popup>
              ✅ Mapa funcionando! <br /> Se você vê isso, o Leaflet está ok!
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      
      <div className="mt-4 p-3 bg-green-100 rounded">
        <p className="text-sm"><strong>Se o mapa aparecer acima:</strong> O Leaflet está funcionando!</p>
        <p className="text-sm"><strong>Se não aparecer:</strong> Verifique o console do navegador (F12)</p>
      </div>
    </div>
  );
};

export default TestMap;