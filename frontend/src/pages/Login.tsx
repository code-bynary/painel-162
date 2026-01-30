import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Should be in an environment variable, using localhost for dev
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                username,
                password
            });

            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Falha ao realizar login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-studio-dark flex items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md bg-slate-900/50 border border-slate-700 backdrop-blur-md rounded-2xl shadow-2xl p-8"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20"
                    >
                        <Lock className="w-8 h-8 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-white mb-2">Painel 162</h2>
                    <p className="text-slate-400">Entre com suas credenciais para acessar</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-500" />
                            </div>
                            <Input
                                placeholder="Usuário"
                                className="pl-10"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-500" />
                            </div>
                            <Input
                                type="password"
                                placeholder="Senha"
                                className="pl-10"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-red-500/10 border border-red-500/50 rounded-lg p-3"
                        >
                            <p className="text-red-500 text-sm text-center">{error}</p>
                        </motion.div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        isLoading={isLoading}
                    >
                        Entrar
                    </Button>

                    <div className="text-center mt-4">
                        <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                            Esqueceu sua senha?
                        </a>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
