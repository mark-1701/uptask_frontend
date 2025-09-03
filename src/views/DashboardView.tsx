import { Fragment } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { getProjects } from '@/api/ProjectAPI';
import { isManager } from '@/utils/policies';
import { useAuth } from '@/hooks/useAuth';
import DeleteProjectModal from '@/components/projects/DeleteProjectModal';

const DashboardView = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { data: user, isLoading: authLoading } = useAuth();

  // La query key es una clave única

  // * Hook de Query
  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  });


  if (isLoading && authLoading) return 'Cargando...';

  // useQuery recomienda esta condición
  if (data && user)
    return (
      <>
        <h1 className="text-5xl font-black">Mis Proyectos</h1>
        <p className="mt-5 text-2xl font-light text-gray-500">
          Maneja y administra tus proyectos
        </p>

        <nav className="my-5">
          <Link
            className="cursor-pointer bg-purple-400 px-10 py-3 text-xl font-bold
              text-white transition-colors hover:bg-purple-500"
            to="/projects/create"
          >
            Nuevo Proyecto
          </Link>
        </nav>

        {data.length ? (
          <ul
            role="list"
            className="mt-10 divide-y divide-gray-100 border border-gray-100
              bg-white shadow-lg"
          >
            {data.map(project => (
              <li
                key={project._id}
                className="flex justify-between gap-x-6 px-5 py-10"
              >
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto space-y-2">
                    <div className="mb-2">
                      {isManager(project.manager, user._id) ? (
                        <p
                          className="inline-block rounded-lg border-2
                            border-indigo-500 bg-indigo-50 px-5 py-1 text-xs
                            font-bold text-indigo-500 uppercase"
                        >
                          Manager
                        </p>
                      ) : (
                        <p
                          className="inline-block rounded-lg border-2
                            border-green-500 bg-green-50 px-5 py-1 text-xs
                            font-bold text-green-500 uppercase"
                        >
                          Colaborad@r
                        </p>
                      )}
                    </div>

                    <Link
                      to={`/projects/${project._id}`}
                      className="cursor-pointer text-3xl font-bold text-gray-600
                        hover:underline"
                    >
                      {project.projectName}
                    </Link>
                    <p className="text-sm text-gray-400">
                      Cliente: {project.clientName}
                    </p>
                    <p className="text-sm text-gray-400">
                      {project.description}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-x-6">
                  <Menu as="div" className="relative flex-none">
                    <Menu.Button
                      className="-m-2.5 block p-2.5 text-gray-500
                        hover:text-gray-900"
                    >
                      <span className="sr-only">opciones</span>
                      <EllipsisVerticalIcon
                        className="h-9 w-9"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items
                        className="absolute right-0 z-10 mt-2 w-56
                          origin-top-right rounded-md bg-white py-2 shadow-lg
                          ring-1 ring-gray-900/5 focus:outline-none"
                      >
                        <Menu.Item>
                          <Link
                            to={`/projects/${project._id}`}
                            className="block px-3 py-1 text-sm leading-6
                              text-gray-900"
                          >
                            Ver Proyecto
                          </Link>
                        </Menu.Item>

                        {isManager(project.manager, user._id) && (
                          <>
                            <Menu.Item>
                              <Link
                                to={`/projects/${project._id}/edit`}
                                className="block px-3 py-1 text-sm leading-6
                                  text-gray-900"
                              >
                                Editar Proyecto
                              </Link>
                            </Menu.Item>
                            <Menu.Item>
                              <button
                                type="button"
                                className="block px-3 py-1 text-sm leading-6
                                  text-red-500"
                                onClick={() =>
                                  navigate(
                                    location.pathname +
                                      `?deleteProject=${project._id}`
                                  )
                                }
                              >
                                Eliminar Proyecto
                              </button>
                            </Menu.Item>
                          </>
                        )}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-28 text-center">
            No hay proyectos aún {''}
            <Link
              to={'/projects/create'}
              className="font-bold text-fuchsia-500"
            >
              Crear proyecto
            </Link>
          </p>
        )}

        <DeleteProjectModal />
      </>
    );
};

export default DashboardView;
