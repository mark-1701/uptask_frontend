import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTaskById } from '@/api/TaskAPI';
import EditTaskModal from './EditTaskModal';

const EditTaskData = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get('editTask')!;

  const params = useParams();
  const projectId = params.projectId!;

  // se activa cuando hay un taskId
  // !! significa que si tiene algu retorna true, y viceversa
  const { data, isError } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTaskById({ projectId, taskId }),
    enabled: !!taskId
  });

  // error si no encuentra la página
  if (isError) return <Navigate to={'/404'} />;

  if (data) return <EditTaskModal data={data} taskId={taskId} />;
};

export default EditTaskData;
