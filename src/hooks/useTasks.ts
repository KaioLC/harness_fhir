import { useState, useEffect, useCallback } from 'react';
import type { FHIRTask } from '../types/fhir';
import { api } from '../services/api';

export function useTasks(pollingIntervalMs: number = 2000) {
  const [tasks, setTasks] = useState<FHIRTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {

      const data = await api.getTasks();
      setTasks(data);
      setError(null);

    } catch (err: any) {
      setError(err.message || 'Erro ao sincronizar tarefas com a API.');

    } finally {
      setLoading(false);
    }

  }, []);

  useEffect(() => {
    fetchTasks();

    const timer = setInterval(fetchTasks, pollingIntervalMs);

    return () => clearInterval(timer);

  }, [fetchTasks, pollingIntervalMs]);

  return { tasks, loading, error, refetch: fetchTasks };
}


