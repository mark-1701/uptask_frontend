import AddNoteForm from './AddNoteForm';
import NoteDetail from './NoteDetail';
import type { Task } from '@/types/index';

type NotesPanelProps = {
  notes: Task['notes']; // solo extrae la parte de las notas
};

const NotesPanel = ({ notes }: NotesPanelProps) => {
  return (
    <>
      <AddNoteForm />

      <div className="mt-10 divide-y divide-gray-100">
        {notes.length ? (
          <>
            <p className="my-5 text-2xl font-bold text-slate-600">Notas:</p>
            {notes.map(note => (
              <NoteDetail key={note._id} note={note} />
            ))}
          </>
        ) : (
          <p className="pt-3 text-center text-gray-500">No hay notas</p>
        )}
      </div>
    </>
  );
};

export default NotesPanel;
