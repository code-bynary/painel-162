import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import CharacterCard from '../components/CharacterCard';
import axios from 'axios';
import { LogOut, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Character {
    id: number;
    name: string;
    level: number;
    cls: number;
    reputation: number;
    gender: number;
    roleid: number;
}

const Dashboard = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCharacters = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/characters', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCharacters(response.data);
        } catch (error) {
            console.error('Error fetching characters', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCharacters();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-studio-dark bg-[url('https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-fixed">
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm"></div>

            <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-12">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Painel do Jogador</h1>
                        <p className="text-slate-400">Gerencie sua conta e personagens</p>
                    </div>
                    <Button variant="ghost" onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                        <LogOut className="w-5 h-5 mr-2" />
                        Sair
                    </Button>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Character Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-white">Seus Personagens</h2>
                            <Button size="sm" variant="ghost" onClick={fetchCharacters} isLoading={isLoading}>
                                <RefreshCcw className="w-4 h-4 mr-2" />
                                Atualizar
                            </Button>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-12">
                                <p className="text-slate-500">Carregando personagens...</p>
                            </div>
                        ) : characters.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {characters.map((char, index) => (
                                    <CharacterCard key={char.id} character={char} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-8 text-center">
                                <p className="text-slate-400">Nenhum personagem encontrado.</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Stats */}
                    <div className="space-y-6">
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Resumo da Conta</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Status</span>
                                    <span className="text-green-400 bg-green-900/30 px-2 py-0.5 rounded text-xs border border-green-800">Ativa</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Cash (Gold)</span>
                                    <span className="text-yellow-400 font-mono">0</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Último Login</span>
                                    <span className="text-white">Hoje</span>
                                </div>
                            </div>
                            <Button className="w-full mt-6" variant="primary" onClick={() => navigate('/donate')}>
                                Doar / Comprar Gold
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
