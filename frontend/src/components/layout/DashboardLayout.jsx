import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';

export default function DashboardLayout() {
    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="page-content fade-in">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
