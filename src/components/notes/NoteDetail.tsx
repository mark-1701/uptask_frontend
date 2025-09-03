import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { deleteNote } from '@/api/NoteAPI';
import { formatDate } from '@/utils/index';
import { useAuth } from '@/hooks/useAuth';
import type { Note } from '@/types/index';

type NoteDetailProps = {
  note: Note;
};

const NoteDetail = ({ note }: NoteDetailProps) => {
  const { data, isLoading } = useAuth();
  // true si la nota es de la persona que inicio sesión
  // recuerda que solo se vuelve a calcular el valor cuando cambia la data
  const canDelete = useMemo(() => data?._id === note.createdBy._id, [data]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const params = useParams();

  const projectId = params.projectId!;
  const taskId = queryParams.get('viewTask')!;

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: deleteNote,
    onError: error => toast.error(error.message),
    onSuccess: data => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
    }
  });

  if (isLoading) return 'Cargando...';

  return (
    <div className="flex items-center justify-between p-3">
      <div>
        <p>
          {note.content} por:{' '}
          <span className="font-bold">{note.createdBy.name}</span>
        </p>
        <p className="text-xs text-slate-500">{formatDate(note.createdAt)}</p>
      </div>

      {canDelete && (
        <button
          type="button"
          className="cursor-pointer bg-red-400 p-2 text-xs font-bold text-white
            hover:bg-red-500"
          onClick={() => mutate({ projectId, taskId, noteId: note._id })}
        >
          Eliminar
        </button>
      )}
    </div>
  );
};

export default NoteDetail;
