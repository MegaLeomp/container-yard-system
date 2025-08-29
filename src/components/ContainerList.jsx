import React from 'react';

const ContainerList = ({ containers, onRemoveContainer }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-6">Lista de Contêineres</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Número</th>
              <th className="p-3 text-left">Tipo</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Cliente</th>
              <th className="p-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {containers.map(container => (
              <tr key={container.number} className="border-t hover:bg-gray-50">
                <td className="p-3 font-semibold">{container.number}</td>
                <td className="p-3">{container.type}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${
                    container.status === 'Cheio' ? 'bg-green-100 text-green-800' :
                    container.status === 'Vazio' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {container.status}
                  </span>
                </td>
                <td className="p-3">{container.client}</td>
                <td className="p-3">
                  <button
                    onClick={() => onRemoveContainer(container.number)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {containers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum contêiner cadastrado
          </div>
        )}
      </div>
    </div>
  );
};

export default ContainerList;