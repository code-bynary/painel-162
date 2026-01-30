import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import axios from 'axios';
import { CreditCard, CheckCircle, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DonatePackage {
    id: number;
    name: string;
    price: string; // Decimal comes as string from JSON often
    gold: number;
    bonus: number;
    image_url: string | null;
}

const Donate = () => {
    const [packages, setPackages] = useState<DonatePackage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/donate/packages', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPackages(response.data);
        } catch (error) {
            console.error('Error fetching packages', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBuy = async (packageId: number) => {
        setProcessingId(packageId);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:3000/api/donate/create',
                { packageId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // In a real app, redirect to external gateway.
            // Here we open the mock validation URL in a new tab for the user to "confirm"
            window.open(response.data.paymentUrl, '_blank');

            alert('Link de pagamento (simulado) aberto em nova aba! Após confirmar, atualize seu painel.');

        } catch (error) {
            console.error('Error creating payment', error);
            alert('Erro ao iniciar pagamento.');
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-studio-dark bg-[url('https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-fixed">
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm"></div>

            <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-12">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-white mb-2">Loja de Gold</h1>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Adquira Gold para comprar itens exclusivos no jogo. Escolha um dos pacotes abaixo e receba bônus especiais.
                    </p>
                </header>

                {isLoading ? (
                    <div className="text-center py-12">
                        <p className="text-slate-500">Carregando pacotes...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {packages.map((pkg, index) => (
                            <motion.div
                                key={pkg.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-slate-800 transition-all hover:scale-105 shadow-xl"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
                                    <Package className="w-8 h-8 text-white" />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>

                                <div className="mb-6">
                                    <span className="text-3xl font-bold text-white">R$ {parseFloat(pkg.price).toFixed(2)}</span>
                                </div>

                                <ul className="space-y-3 mb-8 w-full">
                                    <li className="flex items-center justify-center text-slate-300 bg-slate-900/50 py-2 rounded-lg">
                                        <span className="font-bold text-yellow-400 mr-2">{pkg.gold}</span> Gold
                                    </li>
                                    {pkg.bonus > 0 && (
                                        <li className="flex items-center justify-center text-green-400 text-sm font-semibold">
                                            + {pkg.bonus} Gold Bônus
                                        </li>
                                    )}
                                </ul>

                                <Button
                                    className="w-full mt-auto"
                                    onClick={() => handleBuy(pkg.id)}
                                    isLoading={processingId === pkg.id}
                                    variant={index === 3 ? 'primary' : 'outline'} // Highlight the last one
                                >
                                    <CreditCard className="w-4 h-4 mr-2" />
                                    Comprar Agora
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="mt-12 text-center">
                    <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                        Voltar para o Painel
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Donate;
