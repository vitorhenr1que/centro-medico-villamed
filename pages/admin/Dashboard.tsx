import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    LogOut,
    TrendingUp,
    Users,
    MousePointer2,
    DollarSign,
    Calendar,
    AlertCircle,
    RefreshCw,
    Search,
    Filter
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#1a4b49', '#c5a35a', '#2d6a4f', '#d4a373', '#003049'];

// Helper function for dates, defined outside to be available for initial state
function getPastDate(days: number) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
}

const AdminDashboard: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // New date filters
    const [since, setSince] = useState(getPastDate(7));
    const [until, setUntil] = useState(getPastDate(0));

    const navigate = useNavigate();

    const fetchInsights = async () => {
        setLoading(true);
        setError('');
        const key = localStorage.getItem('admin_key');

        if (!key) {
            navigate('/admin/login');
            return;
        }

        try {
            const response = await fetch(`/api/meta/insights?since=${since}&until=${until}`, {
                headers: {
                    'x-admin-key': key,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) throw new Error('Chave inválida ou expirada.');
                throw new Error('Falha ao carregar dados da Meta API.');
            }

            const json = await response.json();
            setData(json);
        } catch (err: any) {
            setError(err.message);
            if (err.message.includes('Chave')) {
                localStorage.removeItem('admin_key');
                setTimeout(() => navigate('/admin/login'), 2000);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInsights();
    }, [since, until, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('admin_key');
        navigate('/admin/login');
    };

    const filteredCampaigns = data?.campaigns?.filter((c: any) =>
        c.campaign_name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    if (loading && !data) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <RefreshCw className="w-12 h-12 text-secondary animate-spin mx-auto" />
                    <p className="font-heading font-bold text-brandDark">Sincronizando dados da Meta...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-brandDark text-white hidden lg:flex flex-col p-6 fixed h-full z-20">
                <div className="mb-12 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary font-bold">
                        V
                    </div>
                    <span className="font-heading font-bold text-xl tracking-tight">VillaMed Admin</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-medium">
                        <LayoutDashboard size={20} /> Dashboard Ads
                    </button>
                </nav>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors mt-auto rounded-xl"
                >
                    <LogOut size={20} /> Sair do Painel
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-12">
                <header className="mb-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                    <div>
                        <h1 className="font-heading text-3xl font-bold text-brandDark">Performance de Ads</h1>
                        <p className="text-gray-500 mt-1">Análise detalhada por campanha e período</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Filtros de Data */}
                        <div className="flex items-center bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden p-1">
                            <div className="flex items-center gap-2 px-3 border-r border-gray-100">
                                <Calendar size={14} className="text-gray-400" />
                                <input
                                    type="date"
                                    value={since}
                                    onChange={(e) => setSince(e.target.value)}
                                    className="text-sm font-medium text-brandDark outline-none bg-transparent"
                                />
                            </div>
                            <div className="flex items-center gap-2 px-3">
                                <input
                                    type="date"
                                    value={until}
                                    onChange={(e) => setUntil(e.target.value)}
                                    className="text-sm font-medium text-brandDark outline-none bg-transparent"
                                />
                            </div>
                        </div>

                        {/* Busca por Campanha */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Filtrar por nome..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 w-48 shadow-sm"
                            />
                        </div>

                        {/* Seletor de Campanha Única */}
                        <select
                            className="bg-white border border-gray-100 px-4 py-2 rounded-xl text-sm font-medium text-brandDark shadow-sm outline-none focus:ring-2 focus:ring-primary/20"
                            onChange={(e) => setSearchTerm(e.target.value === 'all' ? '' : e.target.value)}
                        >
                            <option value="all">Todas as campanhas</option>
                            {data?.campaigns?.map((c: any) => (
                                <option key={c.campaign_id} value={c.campaign_name}>
                                    {c.campaign_name}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={fetchInsights}
                            disabled={loading}
                            className="p-2.5 bg-secondary text-white rounded-xl hover:bg-brandDark transition-colors shadow-sm disabled:opacity-50"
                            title="Atualizar dados"
                        >
                            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </header>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3">
                        <AlertCircle size={20} /> {error}
                    </div>
                )}

                {/* Totals Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                                <DollarSign size={24} />
                            </div>
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded uppercase tracking-wider">Investimento</span>
                        </div>
                        <h3 className="text-2xl font-bold text-brandDark">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data?.totals?.spend || 0)}
                        </h3>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                <Users size={24} />
                            </div>
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider">Alcance Médio</span>
                        </div>
                        <h3 className="text-2xl font-bold text-brandDark">
                            {(data?.totals?.reach || 0).toLocaleString()}
                        </h3>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                                <TrendingUp size={24} />
                            </div>
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase tracking-wider">Impressões</span>
                        </div>
                        <h3 className="text-2xl font-bold text-brandDark">
                            {(data?.totals?.impressions || 0).toLocaleString()}
                        </h3>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                                <RefreshCw size={24} />
                            </div>
                            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded uppercase tracking-wider">Frequência</span>
                        </div>
                        <h3 className="text-2xl font-bold text-brandDark">
                            {(data?.totals?.frequency || 0).toFixed(2)}x
                        </h3>
                    </div>

                    {/* 
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center">
                                <TrendingUp size={24} />
                            </div>
                            <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded uppercase tracking-wider">Leads (CPA)</span>
                        </div>
                        <h3 className="text-2xl font-bold text-brandDark">
                            {Object.values(data?.totals?.conversions || {}).reduce((a: any, b: any) => a + b, 0) as number}
                            <span className="ml-2 text-sm text-secondary font-medium lowercase">
                                (R$ {Object.values(data?.totals?.cpa || {}).length > 0 ? (Object.values(data?.totals?.cpa || {})[0] as number).toFixed(2) : '0.00'})
                            </span>
                        </h3>
                    </div>
                    */}
                </div>

                {/* Charts & Table Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chart */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                        <h4 className="font-heading font-bold text-xl mb-8 flex items-center gap-2">
                            <TrendingUp size={20} className="text-secondary" /> Investimento por Campanha
                        </h4>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={filteredCampaigns.slice(0, 10)}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="campaign_name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10 }}
                                        interval={0}
                                        width={100}
                                    />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="spend" radius={[10, 10, 0, 0]}>
                                        {filteredCampaigns.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Table / List */}
                    {/* 
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                        <h4 className="font-heading font-bold text-xl mb-4">Rank de Conversões</h4>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {filteredCampaigns.sort((a: any, b: any) =>
                                (Object.values(b.conversions)[0] as number || 0) - (Object.values(a.conversions)[0] as number || 0)
                            ).map((c: any, idx: number) => {
                                const totalConv = Object.values(c.conversions).reduce((a: any, b: any) => a + b, 0) as number;
                                const cpaValue = Object.values(c.cpa)[0] as number || 0;

                                return (
                                    <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-primary/5 transition-colors">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-brandDark truncate">{c.campaign_name}</p>
                                            <p className="text-xs text-gray-500">{totalConv} Conversões &middot; R$ {cpaValue.toFixed(2)}/lead</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${totalConv > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                                {totalConv}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    */}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
