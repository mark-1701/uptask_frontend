import { Fragment } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';
import { createTask } from '@/api/TaskAPI';
import TaskForm from './TaskForm';
import type { TaskFormData } from '@/types/index';

export default function AddTaskModal() {
  const navigate = useNavigate();

  // Leer si el modal existe
  // * Hook para recuperar los parámetros
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const modalTask = queryParams.get('newTask');
  const show = modalTask ? true : false;

  // Obtener projectId
  const params = useParams();
  const projectId = params.projectId!;

  const initialValues: TaskFormData = {
    name: '',
    description: ''
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ defaultValues: initialValues });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: createTask,
    onError: error => {
      toast.error(error.message);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      toast.success(data);
      // reiniciar el formulario
      reset();
      navigate(location.pathname, { replace: true });
    }
  });

  const handleCreateTask = (formData: TaskFormData) => {
    const data = {
      formData,
      projectId
    };
    mutate(data);
  };

  return (
    <>
      <Transition appear show={show} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            // * Quitarle los parámetros a la url
            navigate(location.pathname, { replace: true });
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div
              className="flex min-h-full items-center justify-center p-4
                text-center"
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className="w-full max-w-4xl transform overflow-hidden
                    rounded-2xl bg-white p-16 text-left align-middle shadow-xl
                    transition-all"
                >
                  <Dialog.Title as="h3" className="my-5 text-4xl font-black">
                    Nueva Tarea
                  </Dialog.Title>

                  <p className="text-xl font-bold">
                    Llena el formulario y crea {''}
                    <span className="text-fuchsia-600">una tarea</span>
                  </p>

                  <form
                    action=""
                    className="mt-10 space-y-3"
                    noValidate
                    // no es necesario usar () => {} porque no es una ejecución
                    // inmedianta. handleSubmit solo prepara la función.
                    onSubmit={handleSubmit(handleCreateTask)}
                  >
                    <TaskForm register={register} errors={errors} />

                    <input
                      type="submit"
                      className="fontbold w-full cursor-pointer bg-fuchsia-600
                        p-3 font-bold text-white uppercase transition-colors
                        hover:bg-fuchsia-700"
                      value="Guardar Tarea"
                    />
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
