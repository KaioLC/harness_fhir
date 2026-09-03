import React, { useState, useEffect } from 'react';
import { useTasks } from './hooks/useTasks';
import { TaskMissionController } from './components/TaskMissionController';
import type { FHIRDevice, FHIRLocation, FHIRTask } from './types/fhir';
import { api } from './services/api';

export const App: React.FC = () => {
  const { tasks, loading, error, refetch } = useTasks(2000);
  const [devices, setDevices] = useState<FHIRDevice[]>([]);
  const [locations, setLocations] = useState<FHIRLocation[]>([]);
  const [inspectedTask, setInspectedTask] = useState<FHIRTask | null>(null);

  const [priority, setPriority] = useState<'routine' | 'urgent' | 'stat'>('routine');
  const [description, setDescription] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    api.getDevices().then(setDevices).catch(console.error);
    api.getLocation().then(setLocations).catch(console.error);
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const locationObj = locations.find(l => l.id === selectedLocation);
    await api.createTask({
      priority,
      description: description || 'Transporte de insumo hospitalar',
      location: locationObj ? { reference: `Location/${locationObj.id}`, display: locationObj.name } : undefined,
    });
    setDescription('');
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="max-w-7xl mx-auto mb-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FHIR Hospital Robotics Harness</h1>
          <p className="text-sm text-gray-500">Test Harness Interativo para Simulação e Despacho de Robôs</p>
        </div>
        <div className="flex gap-2">
          {devices.map(d => (
            <div key={d.id} className="text-xs bg-gray-50 border p-2 rounded text-right">
              <div className="font-bold">{d.id}</div>
              <div className={d.status === 'online' ? 'text-green-600' : 'text-red-600'}>
                ● {d.status} ({d.battery}%)
              </div>
            </div>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

        <section className="bg-white p-5 rounded-xl shadow-sm h-fit space-y-4">
          <h2 className="text-lg font-bold text-gray-800"> Nova Missão</h2>
          <form onSubmit={handleCreateTask} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-600">Descrição:</label>
              <input
                type="text"
                placeholder="Ex: Transporte de Bolsa de Sangue O-"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full border p-2 rounded text-sm mt-1"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Prioridade:</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full border p-2 rounded text-sm mt-1"
              >
                <option value="routine">Routine (Rotina)</option>
                <option value="urgent">Urgent (Urgente)</option>
                <option value="stat">Stat (Emergência Imediata)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Destino:</label>
              <select
                value={selectedLocation}
                onChange={e => setSelectedLocation(e.target.value)}
                className="w-full border p-2 rounded text-sm mt-1"
                required
              >
                <option value="">Selecione o local...</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name} ({loc.floor})</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded text-sm transition"
            >
              Despachar Ordem Hospitalar
            </button>
          </form>
        </section>


        <section className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">
              Fila de Tarefas e Controle ({tasks.length})
            </h2>
            {loading && <span className="text-xs text-blue-500 animate-pulse">Sincronizando...</span>}
          </div>

          {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded">{error}</div>}

          <div className="grid grid-cols-1 gap-3">
            {tasks.map(task => (
              <TaskMissionController
                key={task.id}
                task={task}
                onRefresh={refetch}
                onInspectJson={setInspectedTask}
              />
            ))}
            {tasks.length === 0 && !loading && (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed text-gray-400">
                Nenhuma tarefa ativa no momento. Despache uma ordem à esquerda!
              </div>
            )}
          </div>
        </section>
      </main>


      {inspectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-800">Recurso Canônico FHIR: {inspectedTask.id}</h3>
              <button onClick={() => setInspectedTask(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-xs flex-1 font-mono">
              {JSON.stringify(inspectedTask, null, 2)}
            </pre>
            <button
              onClick={() => setInspectedTask(null)}
              className="mt-4 bg-gray-800 text-white py-2 rounded text-sm font-medium hover:bg-gray-700"
            >
              Fechar Inspetor
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;


