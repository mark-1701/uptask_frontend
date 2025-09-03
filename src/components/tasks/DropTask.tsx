import { useDroppable } from '@dnd-kit/core';

type DropTaskProps = {
  status: string;
};

const DropTask = ({ status }: DropTaskProps) => {
  // * Droppable
  // Área en donde caen los elementos

  // id es para indentificar el elemento
  // isOver es para saber cuando el elemento esta encima de nosotros
  // setNodeRef es para anchar este elemento como arrastrable
  const { isOver, setNodeRef } = useDroppable({
    id: status
  });

  const style = {
    opacity: isOver ? 0.4 : undefined
  };

  return (
    <div
      style={style}
      ref={setNodeRef}
      className="mt-5 grid place-content-around border border-dashed
        border-slate-500 p-2 text-xs font-semibold text-slate-500 uppercase"
    >
      Soltar tarea aquí
    </div>
  );
};

export default DropTask;
