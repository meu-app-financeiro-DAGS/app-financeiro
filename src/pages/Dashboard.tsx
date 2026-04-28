import {
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  ShoppingCart, Car, Tv, Heart, BookOpen, Fuel, UtensilsCrossed, Banknote,
  MoreHorizontal, Wallet, DollarSign,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { useFinance } from '../contexts/FinanceContext';
import { useTheme } from '../contexts/ThemeContext';

const categoryIcons: Record<string, React.ElementType> = {
  'Alimentação': ShoppingCart, 'Transporte': Car, 'Entretenimento': Tv,
  'Saúde': Heart, 'Educação': BookOpen, 'Combustível': Fuel,
  'Restaurante': UtensilsCrossed, 'Renda': Banknote,
  'Renda Extra': Banknote, 'Investimentos': TrendingUp,
};

const weeklyData = [
  { day: 'Seg', gasto: 120 }, { day: 'Ter', gasto: 85 },
  { day: 'Qua', gasto: 210 }, { day: 'Qui', gasto: 156 },
  { day: 'Sex', gasto: 287 }, { day: 'Sáb', gasto: 95 },
  { day: 'Dom', gasto: 44 },
];

const monthlyEvolution = [
  { month: 'Jan', ganhos: 8500, gastos: 5200 },
  { month: 'Fev', ganhos: 8500, gastos: 4800 },
  { month: 'Mar', ganhos: 9200, gastos: 6100 },
  { month: 'Abr', ganhos: 10845, gastos: 997 },
];

function fmt(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export default function Dashboard() {
  const { state } = useFinance();
  const { isDark } = useTheme();
  const dk = isDark;
  const limitPct = Math.min((state.dailySpent / state.dailyLimit) * 100, 100);
  const limitColor = limitPct > 80 ? 'bg-red-500' : limitPct > 50 ? 'bg-yellow-500' : 'bg-primary-500';
  const card = `rounded-2xl p-5 lg:p-6 h-full ${dk ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100 shadow-sm'}`;
  const muted = dk ? 'text-dark-muted' : 'text-gray-500';
  const title = dk ? 'text-white' : 'text-gray-900';
  const ttStyle = {
    backgroundColor: dk ? '#1e293b' : '#fff',
    border: `1px solid ${dk ? '#334155' : '#e2e8f0'}`,
    borderRadius: '12px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)', padding: '8px 14px',
  };

  const stats = [
    { label: 'Saldo Total', value: state.totalBalance, icon: Wallet, color: title, pct: '+15.24%', up: true },
    { label: 'Ganhos do Mês', value: state.monthlyEarnings, icon: TrendingUp, color: 'text-emerald-500', pct: '+4.25%', up: true },
    { label: 'Gastos do Mês', value: state.monthlySpending, icon: TrendingDown, color: 'text-red-500', pct: '-12.3%', up: false },
  ];

  return (
    <div className="space-y-6">
      {/* Top Cards: Stats + Daily Limit Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((s, i) => (
          <div key={s.label} className={`${card} card-hover animate-fade-in-up stagger-${i + 1}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center gap-2 text-xs lg:text-sm font-medium ${muted}`}>
                <s.icon size={16} className={i > 0 ? s.color : ''} /> {s.label}
              </div>
              <button className={`p-1 rounded-lg transition-colors ${dk ? 'hover:bg-dark-border text-dark-muted' : 'hover:bg-gray-100 text-gray-400'}`}>
                <MoreHorizontal size={16} />
              </button>
            </div>
            <p className={`text-2xl xl:text-3xl font-bold tabular-nums ${s.color}`}>{fmt(s.value)}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className={`flex items-center gap-0.5 text-[10px] lg:text-xs font-semibold ${s.up ? 'text-emerald-500' : 'text-red-500'}`}>
                {s.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {s.pct}
              </span>
              <span className={`text-[10px] lg:text-xs ${muted}`}>vs. mês anterior</span>
            </div>
          </div>
        ))}
        
        <div className={`${card} animate-fade-in-up stagger-4`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-xs lg:text-sm font-medium ${muted}`}>Limite Diário</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${limitPct > 80 ? 'bg-red-500/10 text-red-500' : 'bg-primary-500/10 text-primary-500'}`}>
              {limitPct.toFixed(0)}%
            </span>
          </div>
          <p className={`text-2xl xl:text-3xl font-bold tabular-nums mb-4 ${title}`}>{fmt(state.dailySpent)}</p>
          <div className={`w-full h-2 rounded-full overflow-hidden ${dk ? 'bg-dark-border' : 'bg-gray-100'}`}>
            <div className={`h-full rounded-full progress-bar-fill ${limitColor}`} style={{ width: `${limitPct}%` }} />
          </div>
          <p className={`text-[10px] mt-2 ${muted}`}>Meta: {fmt(state.dailyLimit)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 items-start">
        <div className="xl:col-span-2 space-y-4 lg:gap-6 grid grid-cols-1">
          <div className={`${card} animate-fade-in-up stagger-4`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`font-bold ${title}`}>Gastos da Semana</h3>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-[10px] text-primary-500 font-medium">
                  <div className="w-2 h-2 rounded-full bg-primary-500" /> Transações
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={weeklyData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke={dk ? '#2d3748' : '#f1f5f9'} vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `R$${v}`} />
                <Tooltip cursor={{fill: dk ? '#1e293b' : '#f8fafc', radius: 8}} contentStyle={ttStyle} formatter={(value: any) => [fmt(value), 'Gasto']} />
                <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#2563eb" /></linearGradient></defs>
                <Bar dataKey="gasto" fill="url(#bg)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={`${card} animate-fade-in-up stagger-5`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`font-bold ${title}`}>Evolução Financeira</h3>
              <select className={`text-xs bg-transparent border-none outline-none font-medium cursor-pointer ${muted}`}>
                <option>Últimos 4 meses</option>
                <option>Último ano</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyEvolution}>
                <defs>
                  <linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                  <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} /><stop offset="100%" stopColor="#ef4444" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={dk ? '#2d3748' : '#f1f5f9'} vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={ttStyle} formatter={(value: any) => [fmt(value)]} />
                <Area type="monotone" dataKey="ganhos" stroke="#10b981" strokeWidth={3} fill="url(#gg)" name="Ganhos" />
                <Area type="monotone" dataKey="gastos" stroke="#ef4444" strokeWidth={3} fill="url(#rg)" name="Gastos" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${card} animate-fade-in-up stagger-5 flex flex-col`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`font-bold ${title}`}>Transações Recentes</h3>
            <button className={`text-xs font-semibold px-2 py-1 rounded-lg ${dk ? 'text-primary-400 hover:bg-primary-500/10' : 'text-primary-600 hover:bg-primary-50'}`}>Ver Todas</button>
          </div>
          <div className="space-y-2 overflow-y-auto max-h-[640px] pr-1 custom-scrollbar">
            {state.transactions.slice(0, 12).map((tx, i) => {
              const Icon = categoryIcons[tx.category] || DollarSign;
              const inc = tx.type === 'income';
              return (
                <div key={tx.id} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${dk ? 'hover:bg-dark-border/40' : 'hover:bg-gray-50 border border-transparent hover:border-gray-100'} animate-fade-in-up`} style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${inc ? 'bg-emerald-500/10 text-emerald-500' : dk ? 'bg-dark-border text-dark-muted' : 'bg-gray-100 text-gray-500'}`}><Icon size={16} /></div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${title}`}>{tx.description}</p>
                    <p className={`text-[10px] lg:text-xs mt-0.5 ${muted}`}>{tx.category}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-bold tabular-nums ${inc ? 'text-emerald-500' : title}`}>{inc ? '+' : ''}{fmt(Math.abs(tx.amount))}</p>
                    <p className={`text-[10px] mt-0.5 ${muted}`}>{tx.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
