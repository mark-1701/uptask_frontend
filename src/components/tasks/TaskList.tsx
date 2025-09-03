import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { toast } from 'react-toastify';
import { statusTranslations } from '@/locales/es';
import { updateStatus } from '@/api/TaskAPI';
import TaskCard from './TaskCard';
import DropTask from './DropTask';
import type { Project, TaskProject, TaskStatus } from '@/types/index';

type TaskListProps = {
  tasks: TaskProject[];
  canEdit: boolean;
};

type GroupedTasks = {
  [key: string]: TaskProject[];
};

const initialStatusGroups: GroupedTasks = {
  pending: [],
  onHold: [],
  inProgress: [],
  underReview: [],
  completed: []
};

const statusStyles: { [key: string]: string } = {
  pending: 'border-t-slate-500',
  onHold: 'border-t-red-500',
  inProgress: 'border-t-blue-500',
  underReview: 'border-t-amber-500',
  completed: 'border-t-emerald-500'
};

const TaskList = ({ tasks, canEdit }: TaskListProps) => {
  const params = useParams();
  const projectId = params.projectId!;

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: updateStatus,
    onError: error => {
      toast.error(error.message);
    },
    onSuccess: async data => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    }
  });

  const groupedTasks = tasks.reduce((acc, task) => {
    /*
      si hay algo dentro de alguno de los arrays de la tarea actual, se va 
      retornar ese array del array acumulado, sino se va a retornar un array
      vacío. (significa que recupera todas la tareas del estado de la tarea
      actual)
    */
    let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
    // le suma la tarea al grupo actual según su estado
    currentGroup = [...currentGroup, task];
    // se retorna el grupo actual, con el array del estado de la tarea modificada
    return { ...acc, [task.status]: currentGroup };
  }, initialStatusGroups);

  const handleDragEnd = (e: DragEndEvent) => {
    const { over, active } = e;
    // active es el elemento arrastrado
    // over es el elemento en donde se arrastro

    if (over && over.id) {
      // se suelta el elemento en un lugar válido
      const taskId = active.id.toString();
      const status = over.id as TaskStatus;
      mutate({ projectId, taskId, status });

      // * Actualizaciones Optimistas del estado
      /*
        Para evitar esperas de actualizaciones, y evitar errores gráficos, 
        podemos actualizar el estado de forma manual para tener un estado 
        actualizado más rápido. Ya cuando se invaliden los querys el estado ya 
        estaba actualizado.
      */
      queryClient.setQueryData(['project', projectId], (prevData: Project) => {
        const updatedTask = prevData.tasks.map(task => {
          if (task._id === taskId) {
            return {
              ...task,
              status
            };
          }
          return task;
        });

        return {
          ...prevData,
          tasks: updatedTask
        };
      });
    } else {
      // se suelta el elemento en un lugar no válido
    }
  };

  return (
    <>
      <h2 className="my-10 text-5xl font-black">Tareas</h2>

      <div className="flex gap-5 overflow-x-scroll pb-32 2xl:overflow-auto">
        {/* DndContext - Área en donde ocurren todos los arrastramientos*/}
        {/* handleDragEnd es el evento que se va a ejecutar cuando se deje de 
        arrastrar el elemento en el área soltable */}
        <DndContext onDragEnd={handleDragEnd}>
          {Object.entries(groupedTasks).map(([status, tasks]) => (
            <div key={status} className="min-w-[300px] 2xl:w-1/5 2xl:min-w-0">
              <h3
                className={`border border-t-8 border-slate-300 bg-white p-3
                text-xl font-light capitalize ${statusStyles[status]}`}
              >
                {statusTranslations[status]}
              </h3>

              <DropTask status={status} />

              <ul className="mt-5 space-y-5">
                {tasks.length === 0 ? (
                  <li className="pt-3 text-center text-gray-500">
                    No Hay tareas
                  </li>
                ) : (
                  tasks.map(task => (
                    <TaskCard key={task._id} task={task} canEdit={canEdit} />
                  ))
                )}
              </ul>
            </div>
          ))}
        </DndContext>
      </div>
    </>
  );
};

export default TaskList;
