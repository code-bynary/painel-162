import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
                <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                        <Shield className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight">Painel ADM</h1>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Perfect World</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Link to="/admin/dashboard">
                        <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/dashboard') ? 'bg-red-600/10 text-red-500 border border-red-600/20' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
                            <LayoutDashboard className="w-5 h-5" />
                            <span className="font-medium">Dashboard</span>
                        </div>
                    </Link>
                    <Link to="/admin/players">
                        <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/players') ? 'bg-red-600/10 text-red-500 border border-red-600/20' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
                            <Users className="w-5 h-5" />
                            <span className="font-medium">Jogadores</span>
                        </div>
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-slate-900">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
