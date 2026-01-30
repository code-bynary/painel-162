import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Sword, Crosshair, Skull, Heart } from 'lucide-react';

interface Character {
    id: number;
    name: string;
    level: number;
    cls: number; // Class ID
    reputation: number;
    gender: number;
}

// Map PW class IDs to Names and Icons
const CLASS_MAP: Record<number, { name: string; icon: React.ReactNode; color: string }> = {
    0: { name: 'Guerreiro', icon: <Sword className="w-5 h-5" />, color: 'text-red-500' },
    1: { name: 'Mago', icon: <Zap className="w-5 h-5" />, color: 'text-blue-500' },
    2: { name: 'Espiritualista', icon: <Zap className="w-5 h-5" />, color: 'text-purple-500' }, // Psy
    3: { name: 'Feiticeira', icon: <Skull className="w-5 h-5" />, color: 'text-green-500' },
    4: { name: 'Bárbaro', icon: <Shield className="w-5 h-5" />, color: 'text-orange-500' },
    5: { name: 'Mercenário', icon: <Sword className="w-5 h-5" />, color: 'text-red-400' },
    6: { name: 'Arqueiro', icon: <Crosshair className="w-5 h-5" />, color: 'text-emerald-500' },
    7: { name: 'Sacerdote', icon: <Heart className="w-5 h-5" />, color: 'text-cyan-500' },
    // Add others as needed
    1024: { name: 'Guerreiro (Mock)', icon: <Sword />, color: 'text-red-500' }, // Init.sql used 1024 for testing
    1025: { name: 'Mago (Mock)', icon: <Zap />, color: 'text-blue-500' },
};

const CharacterCard: React.FC<{ character: Character; index: number }> = ({ character, index }) => {
    const clsInfo = CLASS_MAP[character.cls] || CLASS_MAP[character.roleid] || { name: 'Desconhecido', icon: <Shield />, color: 'text-gray-500' };
    // Check if init.sql uses 'cls' or 'roleid' for class mapping. The schema has 'cls' and 'roleid'. 
    // Usually 'cls' is the class ID (0-9/11). 'roleid' is the unique character ID in some contexts or generic ID.
    // In init.sql I put: (userid, roleid, name, cls, ...) 
    // But in VALUES I put: (1, 1024, 'AdminChar', 0, ...) -> so cls is 0.

    const displayClass = CLASS_MAP[character.cls] || { name: 'Desconhecido', icon: <Shield />, color: 'text-gray-500' };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:bg-slate-800 transition-colors flex items-center justify-between group"
        >
            <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center border border-slate-700 group-hover:border-slate-600 transition-colors ${displayClass.color}`}>
                    {displayClass.icon}
                </div>
                <div>
                    <h3 className="font-bold text-white text-lg">{character.name}</h3>
                    <div className="flex items-center text-sm text-slate-400 space-x-2">
                        <span>Lv. {character.level}</span>
                        <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                        <span className={displayClass.color}>{displayClass.name}</span>
                    </div>
                </div>
            </div>

            <div className="text-right">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Fama</p>
                <p className="text-slate-300 font-mono">{character.reputation.toLocaleString()}</p>
            </div>
        </motion.div>
    );
};

export default CharacterCard;
