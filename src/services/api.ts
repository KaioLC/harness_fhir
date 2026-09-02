import { FHIRDevice, FHIRLocation, FHIRTask, TaskPatch } from "../types/fhir";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const api = {
  async getLocation(): Promise<FHIRLocation[]> {
    const res = await fetch(`${API_BASE_URL}/fhir/Location`);

    if (!res.ok) throw new Error('Failed to list locations');

    return res.json();
  },

  async getDevices(): Promise<FHIRDevice[]> {
    const res = await fetch(`${API_BASE_URL}/fhir/Device`);

    if (!res.ok) throw new Error('Failed to list devices');

    return res.json();

  },

  async getTasks(status?: string, owner?: string): Promise<FHIRTask[]> {
    const params = new URLSearchParams();

    if (status) params.append('status', status);
    if (owner) params.append('owner', owner);

    const res = await fetch(`${API_BASE_URL}/fhir/Task?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to list tasks');

    return res.json();
  },

  async getTask(taskId: string): Promise<FHIRTask> {

    const res = await fetch(`${API_BASE_URL}/fhir/Task/${taskId}`);
    if (!res.ok) throw new Error('Falha ao buscar tarefa.');

    return res.json();
  },

  async createTask(task: Partial<FHIRTask>): Promise<FHIRTask> {
    const res = await fetch(`${API_BASE_URL}/fhir/Task`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });

    if (!res.ok) throw new Error(`Error to create task: ${res.statusText}`);

    return res.json();
  },

  async patchTask(taskId: string, patchData: TaskPatch): Promise<FHIRTask> {
    const res = await fetch(`${API_BASE_URL}/fhir/Task/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patchData),
    });

    if (!res.ok) throw new Error(`Error in PATCH task: ${res.statusText}`);

    return res.json();
  }

}
