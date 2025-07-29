import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FormProvider } from './contexts/FormContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import InfiniteScrollPage from './pages/InfiniteScrollPage';
import DndPage from './pages/DndPage';
import CachingPage from './pages/CachingPage';
import PageCachingPage from './pages/PageCachingPage';
import MockApiPage from './pages/MockApiPage';
import './App.css'

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FormProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="infinite-scroll" element={<InfiniteScrollPage />} />
              <Route path="dnd" element={<DndPage />} />
              <Route path="caching-skeleton" element={<CachingPage />} />
              <Route path="page-caching" element={<PageCachingPage />} />
              <Route path="mock-api" element={<MockApiPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </FormProvider>
    </QueryClientProvider>
  )
}

export default App
