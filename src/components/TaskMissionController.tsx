import React, { useState } from 'react';
import { FHIRTask } from '../types/fhir';
import { api } from '../services/api';

interface Props {
  task: FHIRTask;
  onRefresh: () => void;
  onInspectJson: (task: FHIRTask) => void;
}

export const TaskMissionController: React.FC<Props> = ({ task, onRefresh, onInspectJson }) => {
  const [busy, setBusy] = useState(false);

  const handleAction = async (patchPayload: Parameters<typeof api.patchTask>[1]) => {
    setBusy(true);
    try {
      await api.patchTask(task.id, patchPayload);
      onRefresh();
    } catch (err) {
      alert(`Erro na transição: ${err}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <span className="font-mono text-xs text-gray-400">{task.id}</span>
          <h4 className="font-semibold text-gray-800">{task.description || 'Missão sem descrição'}</h4>
        </div>
        <button
          onClick={() => onInspectJson(task)}
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded"
        >
          Inspecionar FHIR
        </button>
      </div>

      <div className="text-xs space-y-1 bg-gray-50 p-2 rounded">
        <div><strong>Status:</strong> <span className="font-mono text-blue-600">{task.status}</span></div>
        <div><strong>Prioridade:</strong> <span className="font-mono">{task.priority}</span></div>
        <div><strong>Destino:</strong> {task.location?.display || task.location?.reference || 'N/A'}</div>
        <div><strong>Robô:</strong> {task.owner?.display || task.owner?.reference || 'Não atribuído'}</div>
        <div><strong>Telemetria:</strong> <em>{task.businessStatus?.text || 'Sem telemetria recente'}</em></div>
      </div>


      <div className="flex flex-wrap gap-2 pt-2 border-t">
        {task.status === 'requested' && (
          <button
            disabled={busy}
            onClick={() => handleAction({
              status: 'accepted',
              owner: { reference: 'Device/MOCK-ROBOT-01', display: 'Robô Simulado 01' },
              businessStatus: { text: 'Robô aceitou a ordem e iniciou preparação' }
            })}
            className="px-3 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded font-medium"
          >
            1. Aceitar (Robô)
          </button>
        )}

        {task.status === 'accepted' && (
          <button
            disabled={busy}
            onClick={() => handleAction({
              status: 'in-progress',
              businessStatus: { text: 'Em trânsito no corredor rumo ao destino' }
            })}
            className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded font-medium"
          >
            2. Iniciar trajeto
          </button>
        )}

        {task.status === 'in-progress' && (
          <>
            <button
              disabled={busy}
              onClick={() => handleAction({
                businessStatus: { text: 'Cruzando porta automática / elevador A' }
              })}
              className="px-2 py-1 text-xs bg-purple-500 hover:bg-purple-600 text-white rounded font-medium"
            >
              3. Enviar Telemetria
            </button>
            <button
              disabled={busy}
              onClick={() => handleAction({
                status: 'completed',
                businessStatus: { text: 'Carga descarregada com sucesso no destino' }
              })}
              className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded font-medium"
            >
              4. Concluir Entrega
            </button>
          </>
        )}

        {!['completed', 'cancelled', 'failed'].includes(task.status) && (
          <button
            disabled={busy}
            onClick={() => handleAction({
              status: 'cancelled',
              businessStatus: { text: 'Missão cancelada pelo operador do harness' }
            })}
            className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded font-medium ml-auto"
          >
            5. Abortar
          </button>
        )}
      </div>
    </div>
  );
};



