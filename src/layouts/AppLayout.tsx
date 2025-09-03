import { Link, Navigate, Outlet } from 'react-router-dom';
import Logo from '@/components/Logo';
import NavMenu from '@/components/NavMenu';
import { ToastContainer } from 'react-toastify';

// Hoja de estilos para los toasts
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '@/hooks/useAuth';

const AppLayout = () => {
  const { data, isError, isLoading } = useAuth();

  if (isLoading) return 'Cargando...';
  if (isError) {
    return <Navigate to={'/auth/login'} />;
  }

  // retornar los componentes con la data si hay una data
  if (data)
    return (
      <>
        <header className="bg-gray-800 py-5">
          <div
            className="mx-auto flex max-w-screen-2xl flex-col items-center
              justify-between lg:flex-row"
          >
            <div className="w-64">
              <Link to={'/'}>
                <Logo />
              </Link>
            </div>

            <NavMenu
              name={data.name}
            />
          </div>
        </header>
        <section className="mx-auto mt-10 max-w-screen-2xl p-5">
          <Outlet />
        </section>

        <footer className="py-5">
          <p className="text-center">
            Todos los derechos reservados {new Date().getFullYear()}
          </p>
        </footer>

        {/* Componente Toast */}
        <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
      </>
    );
};

export default AppLayout;
