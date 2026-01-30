import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Ban, CheckCircle, Search, Eye, MapPin, Package, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface User {
    ID: number;
    name: string;
    email: string;
    is_admin: number;
    status?: number; // Mocked status
}

interface Character {
    id: number;
    name: string;
    level: number;
    cls: number;
    reputation: number;
}

interface InventoryItem {
    id: number;
    name: string;
    count: number;
}

const PlayerManager = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Modal States
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userCharacters, setUserCharacters] = useState<Character[]>([]);
    const [selectedChar, setSelectedChar] = useState<Character | null>(null);
    const [charInventory, setCharInventory] = useState<InventoryItem[]>([]);
    const [inventoryOpen, setInventoryOpen] = useState(false);
    const [teleportOpen, setTeleportOpen] = useState(false);
    const [teleportCoords, setTeleportCoords] = useState({ x: 0, y: 0, z: 0, worldtag: 1 });

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        setFilteredUsers(
            users.filter(u =>
                u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, users]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:3000/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleBan = async (user: User) => {
        const action = user.status === 0 ? 'unban' : 'ban'; // Assumes status 0 = banned, 1 = active (mock)
        // Since we don't have real status in DB from listUsers yet, let's just call the endpoints
        // and toggle a local mock state for UI feedback.

        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:3000/api/admin/users/${user.ID}/${action}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(`User ${user.name} ${action}ned!`);
            fetchUsers(); // Refresh
        } catch (err) {
            console.error(err);
            alert('Action failed');
        }
    };

    const openCharacterModal = async (user: User) => {
        setSelectedUser(user);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:3000/api/admin/users/${user.ID}/characters`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserCharacters(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleViewInventory = async (char: Character) => {
        setSelectedChar(char);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:3000/api/admin/characters/${char.id}/inventory`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCharInventory(res.data);
            setInventoryOpen(true);
        } catch (err) {
            console.error(err);
        }
    };

    const [mailModalOpen, setMailModalOpen] = useState(false);
    const [mailData, setMailData] = useState({ receiverId: 0, title: '', context: '', money: 0, itemId: 0, itemCount: 1 });

    const openMailModal = (user: User) => {
        setMailData({ ...mailData, receiverId: user.ID });
        setMailModalOpen(true);
    };

    const handleSendMail = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3000/api/admin/mail', mailData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Email enviado com sucesso!');
            setMailModalOpen(false);
        } catch (err) {
            console.error(err);
            alert('Falha ao enviar email.');
        }
    };

    const handleTeleport = async () => {
        if (!selectedChar) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:3000/api/admin/characters/${selectedChar.id}/teleport`, teleportCoords, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Teleported successfully!');
            setTeleportOpen(false);
        } catch (err) {
            console.error(err);
            alert('Teleport failed');
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Gestão de Jogadores</h1>
                    <p className="text-slate-400">Verifique, puna ou auxilie jogadores.</p>
                </div>
                <div className="w-64">
                    <Input
                        placeholder="Buscar por nome ou email..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="bg-slate-800 border-slate-700"
                    />
                </div>
            </header>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-900/50 text-slate-200 font-medium border-b border-slate-700">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">Nome</th>
                            <th className="p-4">Email</th>
                            <th className="p-4 text-center">Admin</th>
                            <th className="p-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                        {isLoading ? (
                            <tr><td colSpan={5} className="p-8 text-center">Carregando...</td></tr>
                        ) : filteredUsers.map(user => (
                            <tr key={user.ID} className="hover:bg-slate-800/30 transition-colors">
                                <td className="p-4 font-mono">{user.ID}</td>
                                <td className="p-4 font-bold text-white">{user.name}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4 text-center">
                                    {user.is_admin === 1 ? (
                                        <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs border border-purple-500/30">Admin</span>
                                    ) : (
                                        <span className="bg-slate-700/50 text-slate-400 px-2 py-1 rounded-full text-xs">Player</span>
                                    )}
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <Button size="sm" variant="outline" onClick={() => openCharacterModal(user)}>
                                        <Eye className="w-4 h-4 mr-1" />
                                        Chars
                                    </Button>
                                    <Button size="sm" variant="secondary" onClick={() => openMailModal(user)}>
                                        <Mail className="w-4 h-4 mr-1" />
                                        Mail
                                    </Button>
                                    <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-900/20" onClick={() => toggleBan(user)}>
                                        <Ban className="w-4 h-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Character List Modal */}
            <AnimatePresence>
                {selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-2xl shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">Personagens de {selectedUser.name}</h2>
                                <Button size="sm" variant="ghost" onClick={() => setSelectedUser(null)}>Fechar</Button>
                            </div>

                            <div className="space-y-3">
                                {userCharacters.length > 0 ? userCharacters.map(char => (
                                    <div key={char.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700">
                                        <div>
                                            <h3 className="font-bold text-white">{char.name}</h3>
                                            <p className="text-sm text-slate-400">Lv. {char.level} (ID: {char.id})</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button size="sm" variant="secondary" onClick={() => handleViewInventory(char)}>
                                                <Package className="w-4 h-4 mr-1" /> Inv
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => { setSelectedChar(char); setTeleportOpen(true); }}>
                                                <MapPin className="w-4 h-4 mr-1" /> Telar
                                            </Button>
                                        </div>
                                    </div>
                                )) : <p className="text-slate-500">Nenhum personagem encontrado.</p>}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Inventory Modal */}
            {inventoryOpen && selectedChar && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white">Inventário: {selectedChar.name}</h3>
                            <Button size="sm" variant="ghost" onClick={() => setInventoryOpen(false)}>Fechar</Button>
                        </div>
                        <ul className="space-y-2 max-h-96 overflow-y-auto">
                            {charInventory.map(item => (
                                <li key={item.id} className="flex justify-between p-3 bg-slate-800 rounded-lg">
                                    <span className="text-slate-200">{item.name}</span>
                                    <span className="text-slate-400 font-mono">x{item.count}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Teleport Modal */}
            {teleportOpen && selectedChar && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                        <h3 className="text-lg font-bold text-white mb-4">Telar {selectedChar.name}</h3>
                        <div className="space-y-3 mb-6">
                            <Input label="X" type="number" value={teleportCoords.x} onChange={e => setTeleportCoords({ ...teleportCoords, x: Number(e.target.value) })} />
                            <Input label="Y" type="number" value={teleportCoords.y} onChange={e => setTeleportCoords({ ...teleportCoords, y: Number(e.target.value) })} />
                            <Input label="Z" type="number" value={teleportCoords.z} onChange={e => setTeleportCoords({ ...teleportCoords, z: Number(e.target.value) })} />
                            <Input label="World Tag" type="number" value={teleportCoords.worldtag} onChange={e => setTeleportCoords({ ...teleportCoords, worldtag: Number(e.target.value) })} />
                        </div>
                        <div className="flex space-x-3">
                            <Button className="flex-1" onClick={handleTeleport}>Confirmar</Button>
                            <Button className="flex-1" variant="ghost" onClick={() => setTeleportOpen(false)}>Cancelar</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mail Modal */}
            {mailModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
                        <h3 className="text-lg font-bold text-white mb-4">Enviar Correio (Sistema)</h3>
                        <div className="space-y-3 mb-6">
                            <Input label="Título" value={mailData.title} onChange={e => setMailData({ ...mailData, title: e.target.value })} />
                            <Input label="Mensagem" value={mailData.context} onChange={e => setMailData({ ...mailData, context: e.target.value })} />
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Gold" type="number" value={mailData.money} onChange={e => setMailData({ ...mailData, money: Number(e.target.value) })} />
                                <Input label="Item ID" type="number" value={mailData.itemId} onChange={e => setMailData({ ...mailData, itemId: Number(e.target.value) })} />
                            </div>
                            <Input label="Quantidade Item" type="number" value={mailData.itemCount} onChange={e => setMailData({ ...mailData, itemCount: Number(e.target.value) })} />
                        </div>
                        <div className="flex space-x-3">
                            <Button className="flex-1" onClick={handleSendMail}>Enviar</Button>
                            <Button className="flex-1" variant="ghost" onClick={() => setMailModalOpen(false)}>Cancelar</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlayerManager;
