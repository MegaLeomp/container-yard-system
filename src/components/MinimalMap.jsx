import React from 'react';

const MinimalMap = ({ yardMap, containers, onAssignContainer }) => {
  // Função para lidar com clique nas posições
  const handlePositionClick = (positionId) => {
    const currentContainer = yardMap[positionId];
    
    if (currentContainer) {
      // Se já tem container, oferece opções
      const option = prompt(
        `Posição ${positionId} ocupada por ${currentContainer}\n\n1. Liberar posição\n2. Trocar container\n\nDigite 1 ou 2:`
      );
      
      if (option === '1') {
        onAssignContainer('', positionId); // Libera a posição
      } else if (option === '2') {
        const newContainer = prompt('Digite o número do novo container:');
        if (newContainer) onAssignContainer(newContainer, positionId);
      }
    } else {
      // Posição vazia - atribuir container
      const containerNumber = prompt(`Atribuir container à posição ${positionId}:`);
      if (containerNumber) onAssignContainer(containerNumber, positionId);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-6">Mapa do Pátio</h2>
      
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="bg-red-200 p-3 rounded text-center">
          <span className="font-semibold">Ocupadas:</span> {Object.keys(yardMap).length}
        </div>
        <div className="bg-blue-100 p-3 rounded text-center">
          <span className="font-semibold">Disponíveis:</span> {25 - Object.keys(yardMap).length}
        </div>
      </div>

      {/* Grid do pátio - 5x5 igual ao original */}
      <div className="grid grid-cols-5 gap-2 p-4 bg-gray-100 rounded-lg">
        {[...Array(25)].map((_, index) => {
          const positionId = `P${index + 1}`;
          const containerNumber = yardMap[positionId];
          const container = containers.find(c => c.number === containerNumber);
          
          return (
            <div
              key={positionId}
              className={`border-2 p-3 rounded-lg text-center cursor-pointer transition-all ${
                containerNumber 
                  ? 'bg-red-100 border-red-500 hover:bg-red-200' 
                  : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
              }`}
              onClick={() => handlePositionClick(positionId)}
            >
              <div className="font-bold text-sm">{positionId}</div>
              {containerNumber && (
                <div className="text-xs mt-1">
                  <div>{containerNumber}</div>
                  {container && (
                    <div className="text-gray-600">
                      {container.type} • {container.client}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Legenda:</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-500 mr-2"></div>
            <span>Ocupado</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 mr-2"></div>
            <span>Disponível</span>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Total ocupado: {Object.keys(yardMap).length}/25 posições
        </div>
      </div>

      {/* Lista de containers posicionados */}
      {Object.keys(yardMap).length > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 rounded">
          <h4 className="font-semibold mb-2">Containers Posicionados:</h4>
          <div className="text-sm mt-2 space-y-1">
            {Object.entries(yardMap).map(([position, containerNumber]) => {
              const container = containers.find(c => c.number === containerNumber);
              return (
                <div key={position} className="flex justify-between items-center">
                  <span>🚢 <strong>{containerNumber}</strong> em {position}</span>
                  {container && (
                    <span className="text-gray-600 text-xs">
                      {container.type} • {container.client}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-green-50 rounded">
        <h4 className="font-semibold mb-2">Como usar:</h4>
        <ul className="text-sm list-disc list-inside space-y-1">
          <li>Clique em uma posição para atribuir ou remover container</li>
          <li>Posição <strong>verde</strong> = Ocupada</li>
          <li>Posição <strong>cinza</strong> = Disponível</li>
        </ul>
      </div>
    </div>
  );
};

export default MinimalMap;