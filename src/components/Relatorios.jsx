// src/components/Relatorios.jsx
import React from 'react';

const Relatorios = () => {
  // Dados de exemplo - depois conectamos com Firebase
  const movimentacoes = [
    { id: 1, container: "ABCU1234567", operacao: "Entrada", data: "28/08/2023 10:30", usuario: "teste@empresa.com" },
    { id: 2, container: "DEFU7654321", operacao: "Saída", data: "28/08/2023 14:15", usuario: "teste@empresa.com" }
  ];

  const exportarPDF = () => {
    alert('Relatório PDF será gerado aqui!');
  };

  const exportarExcel = () => {
    alert('Relatório Excel será gerado aqui!');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📊 Relatórios de Movimentações</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={exportarPDF} style={{ marginRight: '10px', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
          📄 Exportar PDF
        </button>
        <button onClick={exportarExcel} style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
          📊 Exportar Excel
        </button>
      </div>

      <h3>Últimas Movimentações</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Container</th>
              <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Operação</th>
              <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Usuário</th>
              <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Data/Hora</th>
            </tr>
          </thead>
          <tbody>
            {movimentacoes.map((mov) => (
              <tr key={mov.id}>
                <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{mov.container}</td>
                <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{mov.operacao}</td>
                <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{mov.usuario}</td>
                <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{mov.data}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Relatorios;