export type TaskStatus =
  | 'draft'
  | 'requested'
  | 'received'
  | 'accepted'
  | 'in-progress'
  | 'on-hold'
  | 'completed'
  | 'cancelled'
  | 'failed';

export type TaskPriority =
  | 'routine'
  | 'urgent'
  | 'asap'
  | 'stat';

export interface Reference {
  reference: string; // MOCK-ROBOT-01
  display?: string;
}

export interface BusinessStatus {
  text: string;
}

export interface FHIRTask {
  resourceType: 'Task';
  id: string;
  status: TaskStatus;
  intent: string;
  priority: TaskPriority;
  description?: string;
  focus?: Record<string, any>;
  location?: Reference;
  businessStatus?: BusinessStatus;
  authoredOn: string;
  lastModified: string;
}

export interface TaskPatch {
  status?: TaskStatus;
  businessStatus?: BusinessStatus;
  priority?: TaskPriority;
  description?: string;
  owner?: Reference;
  location?: Reference;
  focus?: Record<string, any>;
}

export interface FHIRLocation {
  resourceType: 'Location';
  id: string;
  name: string;
  floor: string;
  status: string;
  physicalType?: string;
}

export interface FHIRDevice {
  resourceType: 'Device';
  id: string;
  displayName: string;
  status: 'online' | 'offline' | 'busy';
  battery: number;
  currentLocation?: string;
}
