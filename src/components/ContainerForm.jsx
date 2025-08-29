import React, { useState } from "react";

const ContainerForm = ({ onAddContainer }) => {
  const [formData, setFormData] = useState({ 
    number: "", 
    type: "20ft", 
    status: "Vazio", 
    client: "" 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.number.trim()) return;
    
    onAddContainer(formData);
    setFormData({ number: "", type: "20ft", status: "Vazio", client: "" });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-6">Cadastrar Novo Contêiner</h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Número do Contêiner *</label>
          <input
            type="text"
            value={formData.number}
            onChange={(e) => setFormData({...formData, number: e.target.value})}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: ABCD1234567"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Tipo</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="20ft">20ft</option>
            <option value="40ft">40ft</option>
            <option value="HC">High Cube</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="Vazio">Vazio</option>
            <option value="Cheio">Cheio</option>
            <option value="Manutenção">Manutenção</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Cliente</label>
          <input
            type="text"
            value={formData.client}
            onChange={(e) => setFormData({...formData, client: e.target.value})}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Nome do cliente"
          />
        </div>
        
        <div className="md:col-span-4">
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold">
             Adicionar Contêiner
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContainerForm;
