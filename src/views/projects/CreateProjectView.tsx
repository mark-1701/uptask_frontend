import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { createProject } from '@/api/ProjectAPI';
import ProjectForm from '@/components/projects/ProjectForm';
import type { ProjectFormData } from '@/types/index';


const CreateProjectView = () => {
  const navigate = useNavigate();

  const initialValues: ProjectFormData = {
    projectName: '',
    clientName: '',
    description: ''
  };

  // * Hook de Mutation
  // mutationFn es la referencia a la consulta create
  // onError ejecuta un callback si hubo un error
  // onSuccess ejecuta un callback si la consulta fue éxitosa
  const { mutate } = useMutation({
    mutationFn: createProject,
    onError: error => {
      toast.error(error.message);
    },
    onSuccess: data => {
      // data es la resputa del a consulta http
      toast.success(data);
      navigate('/');
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: initialValues });

  const handleForm = (formData: ProjectFormData) => {
    // ? utilizar el hookMutation para ejecutar la consulta
    // internamente mutation ya maneja a asíncronidad de forma correcta
    mutate(formData);

    // ya no es necesario usar mutateAsync
    // await mutation.mutateAsync(formData);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-5xl font-black">Crear Proyecto</h1>
      <p className="mt-5 text-2xl font-light text-gray-500">
        Llena el siguiente formulario para crear un proyecto
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
          value="Crear Proyecto"
          className="fontbold w-full cursor-pointer bg-fuchsia-600 p-3 font-bold
            text-white uppercase transition-colors hover:bg-fuchsia-700"
        />
      </form>
    </div>
  );
};

export default CreateProjectView;
