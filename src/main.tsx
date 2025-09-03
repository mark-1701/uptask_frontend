import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './index.css';
import Router from './router';

// instanciar al query client
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* rodear aplicación con el query client provider */}
    <QueryClientProvider client={queryClient}>
      <Router />
      {/* instalar las devtools de react query */}
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>
);
