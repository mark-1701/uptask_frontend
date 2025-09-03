import { useLocation, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/api/NoteAPI';
import { toast } from 'react-toastify';
import ErrorMessage from '../ErrorMessage';
import type { NoteFormData } from '@/types/index';

const AddNoteForm = () => {
  const params = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  // obtener parametros de url
  const projectId = params.projectId!;
  // obtener query params de url
  const taskId = queryParams.get('viewTask')!;

  const initialValues: NoteFormData = {
    content: ''
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ defaultValues: initialValues });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: createNote,
    onError: error => {
      toast.error(error.message);
    },
    onSuccess: data => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
    }
  });

  const handleAddNote = (formData: NoteFormData) => {
    mutate({ projectId, taskId, formData });
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(handleAddNote)}
      className="space-y-3"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="">
          Crear Nota
        </label>
        <input
          id="content"
          type="text"
          placeholder="Contenido de la nota"
          className="w-full border border-gray-300 p-3"
          {...register('content', {
            required: 'El Contenido de la nota es obligatorio'
          })}
        />
        {errors.content && (
          <ErrorMessage>{errors.content.message}</ErrorMessage>
        )}
      </div>

      <input
        type="submit"
        value="Crear Nota"
        className="w-full cursor-pointer bg-fuchsia-600 p-2 font-black
          text-white hover:bg-fuchsia-700"
      />
    </form>
  );
};

export default AddNoteForm;
