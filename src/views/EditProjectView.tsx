import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProjectById } from '@/api/ProjectAPI';
import EditProjectform from '@/components/projects/EditProjectForm';

const EditProjectView = () => {
  const params = useParams();
  const projectId = params.projectId!;

  // recuerda agregar un querykey diferente para que no se anexe a otra id
  const { data, isLoading, isError } = useQuery({
    queryKey: ['editProject', projectId],
    queryFn: () => getProjectById(projectId),
    retry: false // si hay un error, no volver a intentarlo
  });

  if (isLoading) return 'Cargando...';

  if (isError) return <Navigate to="/404" />;

  if (data) return <EditProjectform data={data} projectId={projectId} />;
};

export default EditProjectView;
