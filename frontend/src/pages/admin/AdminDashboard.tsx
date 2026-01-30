import React from 'react';
import { motion } from 'framer-motion';
import { Users, Server, DollarSign, Activity } from 'lucide-react';

const AdminDashboard = () => {
    // Mock Data for Dashboard Cards
    const stats = [
        { label: 'Jogadores Online', value: '142', icon: <Users className="text-blue-500" />, trend: '+12%' },
        { label: 'Total de Contas', value: '1,234', icon: <Server className="text-purple-500" />, trend: '+5 this week' },
        { label: 'Doações (Hoje)', value: 'R$ 450,00', icon: <DollarSign className="text-green-500" />, trend: '+20%' },
        { label: 'Status do Servidor', value: 'Estável', icon: <Activity className="text-emerald-500" />, trend: 'Uptime 48h' },
    ];

    const [broadcastMsg, setBroadcastMsg] = React.useState('');
    const [sending, setSending] = React.useState(false);

    const handleBroadcast = async () => {
        if (!broadcastMsg) return;
        setSending(true);
        try {
            const token = localStorage.getItem('token');
            await fetch('http://localhost:3000/api/admin/broadcast', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: broadcastMsg, channel: 9 })
            });
            alert('Mensagem enviada com sucesso!');
            setBroadcastMsg('');
        } catch (error) {
            console.error(error);
            alert('Erro ao enviar mensagem.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white">Visão Geral</h1>
                <p className="text-slate-400 mt-1">Estatísticas e monitoramento do servidor.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                                {stat.icon}
                            </div>
                            <span className="text-xs font-medium bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium">{stat.label}</h3>
                        <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Broadcast Section */}
            <div className="mb-8 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Anúncio Global (Broadcast)</h2>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={broadcastMsg}
                        onChange={(e) => setBroadcastMsg(e.target.value)}
                        placeholder="Digite a mensagem para todos os jogadores..."
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                    <button
                        onClick={handleBroadcast}
                        disabled={sending}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl disabled:opacity-50 transition-colors"
                    >
                        {sending ? 'Enviando...' : 'Enviar'}
                    </button>
                </div>
            </div>

            {/* Recent Activity Mock */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Atividade Recente</h2>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold">
                                    P{i}
                                </div>
                                <div>
                                    <p className="text-white font-medium">Player_{i} logou no painel</p>
                                    <p className="text-slate-500 text-sm">Há {i * 5} minutos</p>
                                </div>
                            </div>
                            <span className="text-slate-500 text-sm">IP: 192.168.1.{100 + i}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
