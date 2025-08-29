import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Rectangle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para ícones do Leaflet (importante!)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Ícone personalizado para containers
const containerIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3142/3142429.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const YardMap = ({ yardMap, containers, onAssignContainer }) => {
  const [selectedPosition, setSelectedPosition] = useState(null);

  // Coordenadas do pátio (exemplo - ajuste conforme sua localização real)
  const yardBounds = [
    [-23.5505, -46.6333], // canto sudoeste
    [-23.5500, -46.6320]  // canto nordeste
  ];

  // Grid de posições no pátio
  const gridPositions = [];
  const rows = 5;
  const cols = 5;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const lat = yardBounds[0][0] + (row * (yardBounds[1][0] - yardBounds[0][0]) / rows);
      const lng = yardBounds[0][1] + (col * (yardBounds[1][1] - yardBounds[0][1]) / cols);
      gridPositions.push({
        id: `P${row * cols + col + 1}`,
        position: [lat, lng],
        bounds: [
          [lat - 0.0001, lng - 0.0001],
          [lat + 0.0001, lng + 0.0001]
        ]
      });
    }
  }

  const handlePositionClick = (position) => {
    setSelectedPosition(position);
    
    const currentContainer = yardMap[position.id];
    if (currentContainer) {
      const shouldRemove = window.confirm(
        `Posição ${position.id} ocupada por ${currentContainer}\n\nDeseja liberar esta posição?`
      );
      if (shouldRemove) {
        onAssignContainer('', position.id);
      }
    } else {
      const containerNumber = prompt(`Digite o número do container para a posição ${position.id}:`);
      if (containerNumber) {
        onAssignContainer(containerNumber, position.id);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-6">Mapa do Pátio - Vista Satélite</h2>
      
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="bg-green-100 p-3 rounded">
          <span className="font-semibold">Ocupadas:</span> {Object.keys(yardMap).length}
        </div>
        <div className="bg-blue-100 p-3 rounded">
          <span className="font-semibold">Disponíveis:</span> {gridPositions.length - Object.keys(yardMap).length}
        </div>
      </div>

      <div className="h-96 w-full rounded-lg overflow-hidden">
        <MapContainer
          center={[-23.5503, -46.6326]}
          zoom={18}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Área total do pátio */}
          <Rectangle
            bounds={yardBounds}
            pathOptions={{ color: 'blue', weight: 2, fillOpacity: 0.1 }}
          />

          {/* Grid de posições */}
          {gridPositions.map((pos) => {
            const containerNumber = yardMap[pos.id];
            const container = containers.find(c => c.number === containerNumber);
            
            return (
              <Rectangle
                key={pos.id}
                bounds={pos.bounds}
                pathOptions={{
                  color: containerNumber ? 'red' : 'green',
                  weight: 2,
                  fillColor: containerNumber ? '#f87171' : '#4ade80',
                  fillOpacity: 0.6
                }}
                eventHandlers={{
                  click: () => handlePositionClick(pos)
                }}
              >
                <Popup>
                  <div className="text-center">
                    <strong>Posição {pos.id}</strong>
                    {containerNumber && (
                      <>
                        <br />
                        <span>Container: {containerNumber}</span>
                        <br />
                        {container && (
                          <>
                            <span>Tipo: {container.type}</span>
                            <br />
                            <span>Cliente: {container.client}</span>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </Popup>
              </Rectangle>
            );
          })}

          {/* Marcadores dos containers */}
          {gridPositions.map((pos) => {
            const containerNumber = yardMap[pos.id];
            if (!containerNumber) return null;

            return (
              <Marker
                key={pos.id}
                position={pos.position}
                icon={containerIcon}
              >
                <Popup>
                  <div className="text-sm">
                    <strong>Container {containerNumber}</strong>
                    <br />
                    Posição: {pos.id}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Legenda do Mapa:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 mr-2"></div>
            <span>Posição Disponível</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 mr-2"></div>
            <span>Posição Ocupada</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 mr-2 opacity-50"></div>
            <span>Área do Pátio</span>
          </div>
        </div>
      </div>

      {selectedPosition && (
        <div className="mt-4 p-3 bg-yellow-100 rounded">
          Posição selecionada: <strong>{selectedPosition.id}</strong>
        </div>
      )}
    </div>
  );
};

export default YardMap;