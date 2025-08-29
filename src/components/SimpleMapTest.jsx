import React from 'react';

const SimpleMapTest = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-6">Teste Básico</h2>
      
      <div className="map-container bg-blue-100 rounded-lg flex items-center justify-center">
        <p className="text-lg font-semibold">
          ✅ Este é um div normal com fundo azul
        </p>
      </div>
      
      <div className="mt-4 p-3 bg-green-100 rounded">
        <p className="text-sm"><strong>Se você vê o quadrado azul acima:</strong> O problema é só com o Leaflet</p>
        <p className="text-sm"><strong>Se não vê:</strong> O problema é de renderização básica</p>
      </div>
    </div>
  );
};

export default SimpleMapTest;