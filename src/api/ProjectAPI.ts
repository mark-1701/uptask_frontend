import api from '@/lib/axios';
import {
  dashboardProjectSchema,
  projectSchema,
  type Project,
  type ProjectFormData
} from '@/types/index';
import { isAxiosError } from 'axios';

// TODO: la explicación de las mutaciones están el componente de CreateProjectView

/*
  TODO

  type GroupedTasks = {
    [key: string]: Task[];
  };
  
  entender este tipo de sintaxis para extraer nombres para atributos

  const statusTranslations: { [key: string]: string } = {
    pending: 'Pendiente',
    onHold: 'En Espera',
    inProgress: 'En Progreso',
    underReview: 'En Revisión',
    completed: 'Completado'
  };

 */

export async function createProject(formData: ProjectFormData) {
  try {
    const { data } = await api.post('/projects', formData);
    return data;
  } catch (error) {
    // ? Verificar si es un error de Axios y si hay un mensaje en error.response
    if (isAxiosError(error) && error.response) {
      // ! Lanzar error para que sea capturado por el mutation
      throw new Error(error.response.data.error);
    }
  }
}

// export async function getProjects(): Promise<DashboardProject[] | undefined> {
export async function getProjects() {
  try {
    const { data } = await api('/projects');

    const response = dashboardProjectSchema.safeParse(data);

    if (response.success) {
      return response.data;
    }
  } catch (error) {
    // ? Verificar si es un error de Axios y si hay un mensaje en error.response
    if (isAxiosError(error) && error.response) {
      // ! Lanzar error para que sea capturado por el mutation
      throw new Error(error.response.data.error);
    }
  }
}

export async function getProjectById(id: Project['_id']) {
  try {
    const { data } = await api(`/projects/${id}`);

    const response = projectSchema.safeParse(data);
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getFullProject(id: Project['_id']) {
  try {
    const { data } = await api(`/projects/${id}`);

    const response = projectSchema.safeParse(data);
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

type ProjectAPIType = {
  formData: ProjectFormData;
  projectId: Project['_id'];
};

export async function updateProject({ formData, projectId }: ProjectAPIType) {
  try {
    // es preferible solo comprobar respuestas de consultas con zod para get
    // la resputas sabe que es un string
    const { data } = await api.put<string>(`/projects/${projectId}`, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function deleteProyect(id: Project['_id']) {
  try {
    const url = `/projects/${id}`;
    const { data } = await api.delete<string>(url);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
