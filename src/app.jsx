import { ServiceWorkerUpdater } from './components/ServiceWorkerUpdater'
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Login from './components/Login';
import MinimalMap from './components/MinimalMap';
import ContainerForm from './components/ContainerForm';
import ContainerList from './components/ContainerList';
import Reports from './components/Reports';

export default function App() {
  const [containers, setContainers] = useState([]);
  const [yardMap, setYardMap] = useState({});
  const [history, setHistory] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Carregar dados com sistema de recuperação robusto
  useEffect(() => {
    const savedUser = Cookies.get('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }

    const loadData = () => {
      // Tentativa 1: Dados principais
      try {
        const mainData = localStorage.getItem('yardData');
        if (mainData) {
          const parsed = JSON.parse(mainData);
          if (parsed.containers && parsed.yardMap && parsed.history) {
            setContainers(parsed.containers);
            setYardMap(parsed.yardMap);
            setHistory(parsed.history);
            return true;
          }
        }
      } catch (error) {
        console.warn('Erro nos dados principais:', error);
      }

      // Tentativa 2: Backup recente
      try {
        const recentData = localStorage.getItem('yardData_recent');
        if (recentData) {
          const parsed = JSON.parse(recentData);
          setContainers(parsed.containers || []);
          setYardMap(parsed.yardMap || {});
          setHistory(parsed.history || []);
          return true;
        }
      } catch (error) {
        console.warn('Erro no backup recente:', error);
      }

      // Tentativa 3: Backup diário
      try {
        const today = new Date().toDateString();
        const dailyData = localStorage.getItem(`yardData_${today}`);
        if (dailyData) {
          const parsed = JSON.parse(dailyData);
          setContainers(parsed.containers || []);
          setYardMap(parsed.yardMap || {});
          setHistory(parsed.history || []);
          return true;
        }
      } catch (error) {
        console.warn('Erro no backup diário:', error);
      }

      return false;
    };

    loadData();
  }, []);

  // Backup automático transparente (usuário não vê)
  useEffect(() => {
    if (containers.length > 0 || history.length > 0 || Object.keys(yardMap).length > 0) {
      const backupData = {
        containers,
        yardMap, 
        history,
        lastBackup: new Date().toISOString(),
        version: '1.0'
      };
      
      // Backup principal
      localStorage.setItem('yardData', JSON.stringify(backupData));
      
      // Backup de segurança (atualizado a cada 5 ações)
      if (history.length % 5 === 0) {
        localStorage.setItem('yardData_backup', JSON.stringify(backupData));
      }
    }
  }, [containers, yardMap, history]);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    Cookies.set('user', JSON.stringify(userData), { expires: 7 });
  };

  const handleLogout = () => {
    Cookies.remove('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const handleAddContainer = (containerData) => {
    if (!containerData.number) return;
    
    setContainers([...containers, containerData]);
    setHistory([...history, { 
      action: 'ENTRADA', 
      container: containerData.number, 
      date: new Date().toLocaleString(),
      type: containerData.type,
      client: containerData.client
    }]);
  };

  const handleRemoveContainer = (containerNumber) => {
    const container = containers.find(c => c.number === containerNumber);
    setContainers(containers.filter(c => c.number !== containerNumber));
    setHistory([...history, { 
      action: 'SAÍDA', 
      container: containerNumber, 
      date: new Date().toLocaleString(),
      type: container?.type,
      client: container?.client
    }]);
    
    // Limpar posição no pátio
    const newMap = { ...yardMap };
    for (const pos in newMap) {
      if (newMap[pos] === containerNumber) delete newMap[pos];
    }
    setYardMap(newMap);
  };

  const assignToYard = (containerNumber, positionId) => {
    const newMap = { ...yardMap };
    
    if (containerNumber) {
      // Remove de outras posições se já existir
      for (const pos in newMap) {
        if (newMap[pos] === containerNumber) {
          delete newMap[pos];
        }
      }
      newMap[positionId] = containerNumber;
    } else {
      // Remove container da posição
      delete newMap[positionId];
    }
    
    setYardMap(newMap);
    
    if (containerNumber) {
      setHistory([...history, { 
        action: 'POSICIONADO', 
        container: containerNumber, 
        position: positionId,
        date: new Date().toLocaleString()
      }]);
    }
  };

  // Estatísticas para dashboard
  const stats = {
    totalContainers: containers.length,
    occupiedSpots: Object.keys(yardMap).length,
    availableSpots: 25 - Object.keys(yardMap).length,
    recentActivity: history.slice(-5).reverse()
  };

  // Se não estiver autenticado, mostrar login
  if (!isAuthenticated) {
    return (
      <>
        <ServiceWorkerUpdater />
        <Login onLogin={handleLogin} />
      </>
    );
  }

  return (
    <>
      <ServiceWorkerUpdater />
      
      <div className="min-h-screen bg-gray-100">
        {/* Header com Navegação */}
        <header className="bg-red-800 text-white p-4 shadow-lg">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <h1 className="text-2xl font-bold">🏗️ Sistema de Gerenciamento de Pátio</h1>
            
            <div className="flex items-center space-x-4">
              <span className="bg-white-600 px-3 py-1 rounded">Olá, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-700 transition"
              >
                Sair
              </button>
            </div>
          </div>

          <nav className="container mx-auto mt-4 flex flex-wrap justify-center gap-2">
            <button onClick={() => setCurrentView('dashboard')} className={`px-4 py-2 rounded ${currentView === 'dashboard' ? 'bg-gray-600' : 'bg-gray-400 hover:bg-gray-500'}`}>
              📊 Dashboard
            </button>
            <button onClick={() => setCurrentView('containers')} className={`px-4 py-2 rounded ${currentView === 'containers' ? 'bg-gray-600' : 'bg-gray-400 hover:bg-gray-500'}`}>
              📦 Contêineres
            </button>
            <button onClick={() => setCurrentView('yard')} className={`px-4 py-2 rounded ${currentView === 'yard' ? 'bg-gray-600' : 'bg-gray-400 hover:bg-gray-500'}`}>
              🗺️ Mapa do Pátio
            </button>
            <button onClick={() => setCurrentView('history')} className={`px-4 py-2 rounded ${currentView === 'history' ? 'bg-gray-600' : 'bg-gray-400 hover:bg-gray-500'}`}>
              📋 Histórico
            </button>
            <button onClick={() => setCurrentView('reports')} className={`px-4 py-2 rounded ${currentView === 'reports' ? 'bg-gray-600' : 'bg-gray-400 hover:bg-gray-500'}`}>
              📄 Relatórios
            </button>
          </nav>
        </header>

        <main className="container mx-auto p-4 md:p-6">
          {/* Dashboard */}
          {currentView === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl shadow text-center">
                  <div className="text-3xl font-bold text-black-600">{stats.totalContainers}</div>
                  <div className="text-gray-600">Total Containers</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow text-center">
                  <div className="text-3xl font-bold text-red-700">{stats.occupiedSpots}</div>
                  <div className="text-gray-600">Posições Ocupadas</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow text-center">
                  <div className="text-3xl font-bold text-green-600">{stats.availableSpots}</div>
                  <div className="text-gray-600">Posições Livres</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow text-center">
                  <div className="text-3xl font-bold text-black-600">{history.length}</div>
                  <div className="text-gray-600">Movimentações</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-4">Últimas Movimentações</h2>
                <div className="space-y-2">
                  {stats.recentActivity.map((item, index) => (
                    <div key={index} className="border-b pb-2 last:border-b-0">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{item.action}</span>
                        <span className="text-sm text-gray-600">{item.date}</span>
                      </div>
                      <div className="text-sm">Container: {item.container}</div>
                      {item.position && <div className="text-sm">Posição: {item.position}</div>}
                    </div>
                  ))}
                  {stats.recentActivity.length === 0 && (
                    <div className="text-gray-500 text-center py-4">Nenhuma movimentação recente</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Contêineres */}
          {currentView === 'containers' && (
            <div className="space-y-6">
              <ContainerForm onAddContainer={handleAddContainer} />
              <ContainerList 
                containers={containers} 
                onRemoveContainer={handleRemoveContainer} 
              />
            </div>
          )}

          {/* Mapa do Pátio */}
          {currentView === 'yard' && (
            <MinimalMap 
              yardMap={yardMap}
              containers={containers}
              onAssignContainer={assignToYard}
            />
          )}

          {/* Histórico */}
          {currentView === 'history' && (
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-2xl font-semibold mb-6">Histórico Completo</h2>
              <div className="overflow-x-auto">
                <table className="w-full border">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="p-3 text-left">Data/Hora</th>
                      <th className="p-3 text-left">Ação</th>
                      <th className="p-3 text-left">Container</th>
                      <th className="p-3 text-left">Posição</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.slice().reverse().map((item, index) => (
                      <tr key={index} className="border-t hover:bg-gray-50">
                        <td className="p-3">{item.date}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-sm ${
                            item.action === 'ENTRADA' ? 'bg-green-100 text-green-800' :
                            item.action === 'SAÍDA' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {item.action}
                          </span>
                        </td>
                        <td className="p-3">{item.container}</td>
                        <td className="p-3">{item.position || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {history.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum histórico encontrado
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Relatórios */}
          {currentView === 'reports' && (
            <Reports 
              containers={containers}
              history={history}
              yardMap={yardMap}
            />
          )}
        </main>
      </div>
    </>
  );
}