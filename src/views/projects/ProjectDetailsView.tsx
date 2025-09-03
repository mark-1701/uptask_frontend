import { useMemo } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { isManager } from '@/utils/policies';
import { useAuth } from '@/hooks/useAuth';
import { getFullProject } from '@/api/ProjectAPI';
import AddTaskModal from '@/components/tasks/AddTaskModal';
import EditTaskData from '@/components/tasks/EditTaskData';
import TaskList from '@/components/tasks/TaskList';
import TaskModalDetails from '@/components/tasks/TaskModalDetails';

const ProjectDetailsView = () => {
  const { data: user, isLoading: authLoading } = useAuth();

  console.log(user);

  const navigate = useNavigate();

  const params = useParams();
  const projectId = params.projectId!;

  // recuerda agregar un querykey diferente para que no se anexe a otra id
  const { data, isLoading, isError } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getFullProject(projectId),
    retry: false // si hay un error, no volver a intentarlo
  });

  // true o false si puede editar
  const canEdit = useMemo(() => data?.manager === user?._id, [data, user]);

  if (isLoading && authLoading) return 'Cargando...';

  if (isError) return <Navigate to="/404" />;

  if (data && user)
    return (
      <>
        <h1 className="text-5xl font-black">{data.projectName}</h1>
        <p className="mt-5 text-2xl font-light text-gray-500">
          {data.description}
        </p>

        {isManager(data.manager, user._id) && (
          <nav className="my-5 flex gap-3">
            <button
              type="button"
              className="fontbold cursor-pointer bg-purple-400 px-10 py-3
                text-xl text-white transition-colors hover:bg-purple-500"
              onClick={() => navigate(location.pathname + '?newTask=true')}
            >
              Agregar Tarea
            </button>

            <Link
              to={'team'}
              className="fontbold cursor-pointer bg-fuchsia-600 px-10 py-3
                text-xl text-white transition-colors hover:bg-fuchsia-700"
            >
              Colaboradores
            </Link>
          </nav>
        )}

        <TaskList tasks={data.tasks} canEdit={canEdit} />
        <AddTaskModal />
        <EditTaskData />
        <TaskModalDetails />
      </>
    );
};

export default ProjectDetailsView;
