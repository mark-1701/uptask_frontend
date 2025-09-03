import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { updateProject } from '@/api/ProjectAPI';
import ProjectForm from './ProjectForm';
import type { ProjectFormData } from '@/types/index';

type EditProjectFormProps = {
  data: ProjectFormData;
  projectId: string;
};

const EditProjectForm = ({ data, projectId }: EditProjectFormProps) => {
  const navigate = useNavigate();
  // Limpiar la cache de las anteriores querys
  const queryClient = useQueryClient();

  const initialValues: ProjectFormData = {
    projectName: data.projectName,
    clientName: data.clientName,
    description: data.description
  };

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: updateProject,
    onError: error => {
      toast.error(error.message);
    },
    onSuccess: data => {
      // * Limpiar cache
      // Le envíamos la key de la query que deseamos desabilitar
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['editProject', projectId] });
      toast.success(data);
      navigate('/');
    }
  });

  const handleForm = (formData: ProjectFormData) => {
    const data = {
      formData,
      projectId
    };
    // ? solo puede recibir una variable
    mutate(data);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-5xl font-black">Editar Proyecto</h1>
      <p className="mt-5 text-2xl font-light text-gray-500">
        Llena el siguiente formulario para editar el proyecto
      </p>

      <nav className="my-5">
        <Link
          className="cursor-pointer bg-purple-400 px-10 py-3 text-xl font-bold
            text-white transition-colors hover:bg-purple-500"
          to="/"
        >
          Volver a Proyecto
        </Link>
      </nav>

      <form
        className="mt-10 rounded-lg bg-white p-10 shadow-lg"
        onSubmit={handleSubmit(handleForm)}
        // desactivar la validación de html
        noValidate
      >
        <ProjectForm register={register} errors={errors} />

        <input
          type="submit"
          value="Guardar Cambios"
          className="fontbold w-full cursor-pointer bg-fuchsia-600 p-3 font-bold
            text-white uppercase transition-colors hover:bg-fuchsia-700"
        />
      </form>
    </div>
  );
};

export default EditProjectForm;
