import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/api/AuthAPI';

// * Hooks para devolver la información del usuario que inicio sesión
export const useAuth = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    retry: 1, // intentar solo una vez
    // no hacer refetch al enfocar la pestaña
    refetchOnWindowFocus: false
  });

  return { data, isError, isLoading };
};
