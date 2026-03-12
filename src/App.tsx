import { Layout } from '@/components/Layout';
import { WalletProvider } from '@/contexts/WalletContext';
import { DatasetDetail } from '@/pages/DatasetDetail';
import { Home } from '@/pages/Home';
import { MyDatasets } from '@/pages/MyDatasets';
import { PublishDataset } from '@/pages/PublishDataset';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><Home /></Layout>,
  },
  {
    path: '/marketplace',
    element: <Navigate to="/" replace />,
  },
  {
    path: '/dataset/:id',
    element: <Layout><DatasetDetail /></Layout>,
  },
  {
    path: '/publish',
    element: <Layout><PublishDataset /></Layout>,
  },
  {
    path: '/my-datasets',
    element: <Layout><MyDatasets /></Layout>,
  },
  {
    path: '/mcp-agents',
    element: <Layout><Home /></Layout>, // Just routes to home with mcp filter via links in header
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <RouterProvider router={router} />
      </WalletProvider>
    </QueryClientProvider>
  );
}
