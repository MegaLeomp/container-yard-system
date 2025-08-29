import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const Reports = ({ containers = [], history = [], yardMap = {} }) => {
  const [reportType, setReportType] = useState('inventory');

  // Gerar PDF usando método alternativo (nativo do navegador)
  const generatePDF = () => {
    try {
      // Criar conteúdo HTML para o PDF
      const content = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Relatório do Pátio</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #2c5282; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #2c5282; color: white; padding: 10px; }
            td { padding: 8px; border: 1px solid #ddd; }
            .header { text-align: center; margin-bottom: 30px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>RELATÓRIO DO PÁTIO DE CONTAINERS</h1>
            <p>Data: ${new Date().toLocaleDateString()}</p>
            <p>Total de Containers: ${containers.length}</p>
          </div>
          
          ${reportType === 'inventory' ? generateInventoryHTML() : generateMovementsHTML()}
        </body>
        </html>
      `;

      // Abrir nova janela para impressão
      const printWindow = window.open('', '_blank');
      printWindow.document.write(content);
      printWindow.document.close();
      
      // Esperar o conteúdo carregar e imprimir
      setTimeout(() => {
        printWindow.print();
        printWindow.onafterprint = () => printWindow.close();
      }, 250);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Use a impressão do navegador.');
    }
  };

  // HTML para Inventário
  const generateInventoryHTML = () => {
    if (containers.length === 0) {
      return '<p>Nenhum container cadastrado</p>';
    }

    return `
      <h2>Inventário de Containers</h2>
      <table>
        <tr>
          <th>Número</th>
          <th>Tipo</th>
          <th>Status</th>
          <th>Cliente</th>
          <th>Posição</th>
        </tr>
        ${containers.map(container => `
          <tr>
            <td>${container.number || 'N/A'}</td>
            <td>${container.type || 'N/A'}</td>
            <td>${container.status || 'N/A'}</td>
            <td>${container.client || 'N/A'}</td>
            <td>${Object.entries(yardMap).find(([pos, num]) => num === container.number)?.[0] || 'Não posicionado'}</td>
          </tr>
        `).join('')}
      </table>
    `;
  };

  // HTML para Movimentações
  const generateMovementsHTML = () => {
    if (history.length === 0) {
      return '<p>Nenhuma movimentação registrada</p>';
    }

    return `
      <h2>Histórico de Movimentações</h2>
      <table>
        <tr>
          <th>Data/Hora</th>
          <th>Ação</th>
          <th>Container</th>
          <th>Posição</th>
        </tr>
        ${history.map(item => `
          <tr>
            <td>${item.date || 'N/A'}</td>
            <td>${item.action || 'N/A'}</td>
            <td>${item.container || 'N/A'}</td>
            <td>${item.position || '-'}</td>
          </tr>
        `).join('')}
      </table>
    `;
  };

  // Gerar Excel (mantém funcionando)
  const generateExcel = () => {
    try {
      let data = [];
      
      if (reportType === 'inventory') {
        data = containers.map(container => ({
          'Número': container.number || '',
          'Tipo': container.type || '',
          'Status': container.status || '',
          'Cliente': container.client || '',
          'Posição': Object.entries(yardMap).find(([pos, num]) => num === container.number)?.[0] || 'Não posicionado'
        }));
      } else {
        data = history.map(item => ({
          'Data': item.date || '',
          'Ação': item.action || '',
          'Container': item.container || '',
          'Posição': item.position || '-'
        }));
      }

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');
      XLSX.writeFile(workbook, `relatorio-patio-${new Date().getTime()}.xlsx`);
      alert('Excel gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar Excel:', error);
      alert('Erro ao gerar Excel. Verifique o console.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-6">Relatórios</h2>
      
      <div className="mb-6">
        <label className="block font-medium mb-2">Tipo de Relatório:</label>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="inventory">Inventário de Containers</option>
          <option value="movements">Movimentações</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={generatePDF}
          className="bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-semibold"
        >
          📄 Exportar PDF (Impressão)
        </button>
        <button
          onClick={generateExcel}
          className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
        >
          📊 Exportar Excel
        </button>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Dados Disponíveis:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Containers: <strong>{containers.length}</strong></div>
          <div>Movimentações: <strong>{history.length}</strong></div>
          <div>Posições Ocupadas: <strong>{Object.keys(yardMap).length}</strong></div>
          <div>Disponível: <strong>{25 - Object.keys(yardMap).length}</strong></div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 rounded">
        <h4 className="font-semibold mb-2">💡 Dica:</h4>
        <p className="text-sm">
          O PDF abrirá em uma nova janela para impressão. 
          Use "Salvar como PDF" nas opções de impressão do navegador.
        </p>
      </div>
    </div>
  );
};

export default Reports;