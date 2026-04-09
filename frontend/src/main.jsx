import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './styles/index.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 30_000,
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                    <App />
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            style: {
                                background: 'var(--surface)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border)',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '0.9375rem',
                            },
                            success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
                            error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
                        }}
                    />
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>
);
