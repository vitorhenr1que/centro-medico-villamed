import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin: React.FC = () => {
    const [key, setKey] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Em uma app real, poderíamos ter um endpoint de validação.
        // Aqui vamos apenas salvar a chave no localStorage e tentar o primeiro fetch no Dashboard.
        if (key.trim().length < 5) {
            setError('Por favor, insira uma chave válida.');
            setLoading(false);
            return;
        }

        localStorage.setItem('admin_key', key);
        navigate('/admin/dashboard');
    };

    return (
        <div className="min-h-screen bg-brandDark flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
                <div className="p-8 md:p-12">
                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-secondary">
                            <ShieldCheck size={32} />
                        </div>
                    </div>

                    <div className="text-center mb-10">
                        <h1 className="font-heading text-3xl font-bold text-brandDark mb-2">Painel de Controle</h1>
                        <p className="text-gray-500">Acesso restrito ao Centro Médico VillaMed</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-brandDark ml-1">Chave de Acesso Admin</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="password"
                                    value={key}
                                    onChange={(e) => setKey(e.target.value)}
                                    placeholder="Insira sua ADMIN_API_KEY"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-brandDark"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm text-center font-medium">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-secondary text-white font-bold rounded-2xl hover:bg-brandDark transition-all flex items-center justify-center gap-2 group shadow-lg shadow-secondary/20"
                        >
                            {loading ? 'Validando...' : 'Entrar no Painel'}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>

                <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                        Sistema Seguro &middot; VillaMed &copy; {new Date().getFullYear()}
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
