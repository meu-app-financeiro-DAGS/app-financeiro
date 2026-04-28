import { useState } from 'react';
import { Plus, Trash2, Edit3, Calculator, TrendingDown, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';
import { useTheme } from '../contexts/ThemeContext';
import Modal from '../components/Modal';
import type { Debt } from '../types';

function fmt(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

const typeLabels: Record<string, string> = {
  cartao: 'Cartão de Crédito', emprestimo: 'Empréstimo',
  financiamento: 'Financiamento', outro: 'Outro',
};
const typeColors: Record<string, string> = {
  cartao: 'bg-purple-500/10 text-purple-500',
  emprestimo: 'bg-orange-500/10 text-orange-500',
  financiamento: 'bg-blue-500/10 text-blue-500',
  outro: 'bg-gray-500/10 text-gray-500',
};

function DebtCard({ debt, onEdit, onDelete, onSimulate }: {
  debt: Debt; onEdit: () => void; onDelete: () => void; onSimulate: () => void;
}) {
  const { isDark: dk } = useTheme();
  const progress = (debt.paidAmount / debt.totalAmount) * 100;
  const remaining = debt.totalAmount - debt.paidAmount;
  const remainingInstallments = debt.totalInstallments - debt.paidInstallments;
  const totalWithInterest = remaining + (remaining * (debt.interestRate / 100) * remainingInstallments);
  const progressColor = progress >= 75 ? 'from-emerald-500 to-emerald-400' :
    progress >= 50 ? 'from-primary-500 to-primary-400' :
    progress >= 25 ? 'from-yellow-500 to-yellow-400' : 'from-red-500 to-red-400';

  return (
    <div className={`rounded-2xl p-5 lg:p-6 card-hover group
      ${dk ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100 shadow-sm'}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${typeColors[debt.type]}`}>
            {typeLabels[debt.type]}
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onSimulate} className={`p-1.5 rounded-lg transition-colors ${dk ? 'hover:bg-dark-border text-dark-muted hover:text-primary-400' : 'hover:bg-gray-100 text-gray-400 hover:text-primary-500'}`}>
            <Calculator size={14} />
          </button>
          <button onClick={onEdit} className={`p-1.5 rounded-lg transition-colors ${dk ? 'hover:bg-dark-border text-dark-muted hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-700'}`}>
            <Edit3 size={14} />
          </button>
          <button onClick={onDelete} className={`p-1.5 rounded-lg transition-colors ${dk ? 'hover:bg-red-500/10 text-dark-muted hover:text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'}`}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Title */}
      <h4 className={`text-lg font-bold mb-1 ${dk ? 'text-white' : 'text-gray-900'}`}>{debt.name}</h4>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-2">
          <span className={dk ? 'text-dark-muted' : 'text-gray-500'}>Progresso</span>
          <span className={`font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>{progress.toFixed(1)}%</span>
        </div>
        <div className={`w-full h-3 rounded-full overflow-hidden ${dk ? 'bg-dark-border' : 'bg-gray-100'}`}>
          <div className={`h-full rounded-full progress-bar-fill bg-gradient-to-r ${progressColor}`}
            style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={`rounded-xl p-3 ${dk ? 'bg-dark-border' : 'bg-gray-50'}`}>
          <p className={`text-[10px] uppercase tracking-wider ${dk ? 'text-dark-muted' : 'text-gray-400'}`}>Valor Total</p>
          <p className={`text-sm font-bold mt-0.5 tabular-nums ${dk ? 'text-white' : 'text-gray-900'}`}>{fmt(debt.totalAmount)}</p>
        </div>
        <div className={`rounded-xl p-3 ${dk ? 'bg-dark-border' : 'bg-gray-50'}`}>
          <p className={`text-[10px] uppercase tracking-wider ${dk ? 'text-dark-muted' : 'text-gray-400'}`}>Restante</p>
          <p className="text-sm font-bold mt-0.5 tabular-nums text-red-500">{fmt(remaining)}</p>
        </div>
        <div className={`rounded-xl p-3 ${dk ? 'bg-dark-border' : 'bg-gray-50'}`}>
          <p className={`text-[10px] uppercase tracking-wider ${dk ? 'text-dark-muted' : 'text-gray-400'}`}>Parcela</p>
          <p className={`text-sm font-bold mt-0.5 tabular-nums ${dk ? 'text-white' : 'text-gray-900'}`}>{fmt(debt.monthlyPayment)}</p>
        </div>
        <div className={`rounded-xl p-3 ${dk ? 'bg-dark-border' : 'bg-gray-50'}`}>
          <p className={`text-[10px] uppercase tracking-wider ${dk ? 'text-dark-muted' : 'text-gray-400'}`}>Parcelas</p>
          <p className={`text-sm font-bold mt-0.5 ${dk ? 'text-white' : 'text-gray-900'}`}>
            {debt.paidInstallments}/{debt.totalInstallments}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className={`flex items-center justify-between pt-3 border-t ${dk ? 'border-dark-border' : 'border-gray-100'}`}>
        <div className="flex items-center gap-1.5">
          <TrendingDown size={14} className="text-yellow-500" />
          <span className={`text-xs ${dk ? 'text-dark-muted' : 'text-gray-500'}`}>
            Juros: <span className="font-semibold">{debt.interestRate}% a.m.</span>
          </span>
        </div>
        <span className={`text-xs ${dk ? 'text-dark-muted' : 'text-gray-400'}`}>
          Vence dia {debt.dueDay}
        </span>
      </div>
    </div>
  );
}

export default function DebtsPage() {
  const { state, dispatch } = useFinance();
  const { isDark: dk } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [simModalOpen, setSimModalOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [simDebt, setSimDebt] = useState<Debt | null>(null);
  const [simAmount, setSimAmount] = useState('');

  const [form, setForm] = useState({
    name: '', type: 'emprestimo' as Debt['type'], totalAmount: '', paidAmount: '',
    totalInstallments: '', paidInstallments: '', monthlyPayment: '',
    interestRate: '', dueDay: '',
  });

  const openAdd = () => {
    setEditingDebt(null);
    setForm({ name: '', type: 'emprestimo', totalAmount: '', paidAmount: '', totalInstallments: '', paidInstallments: '', monthlyPayment: '', interestRate: '', dueDay: '' });
    setModalOpen(true);
  };
  const openEdit = (d: Debt) => {
    setEditingDebt(d);
    setForm({
      name: d.name, type: d.type, totalAmount: String(d.totalAmount), paidAmount: String(d.paidAmount),
      totalInstallments: String(d.totalInstallments), paidInstallments: String(d.paidInstallments),
      monthlyPayment: String(d.monthlyPayment), interestRate: String(d.interestRate), dueDay: String(d.dueDay),
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const debtData: Debt = {
      id: editingDebt?.id || Date.now().toString(),
      name: form.name, type: form.type,
      totalAmount: parseFloat(form.totalAmount) || 0,
      paidAmount: parseFloat(form.paidAmount) || 0,
      totalInstallments: parseInt(form.totalInstallments) || 12,
      paidInstallments: parseInt(form.paidInstallments) || 0,
      monthlyPayment: parseFloat(form.monthlyPayment) || 0,
      interestRate: parseFloat(form.interestRate) || 0,
      dueDay: parseInt(form.dueDay) || 10,
      startDate: editingDebt?.startDate || new Date().toISOString().split('T')[0],
    };
    dispatch({ type: editingDebt ? 'UPDATE_DEBT' : 'ADD_DEBT', payload: debtData });
    setModalOpen(false);
  };

  const deleteDebt = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta dívida?')) dispatch({ type: 'REMOVE_DEBT', payload: id });
  };

  // Simulation
  const openSim = (d: Debt) => { setSimDebt(d); setSimAmount(''); setSimModalOpen(true); };
  const remaining = simDebt ? simDebt.totalAmount - simDebt.paidAmount : 0;
  const simVal = parseFloat(simAmount) || 0;
  const normalInterest = simDebt ? remaining * (simDebt.interestRate / 100) * (simDebt.totalInstallments - simDebt.paidInstallments) : 0;
  const newRemaining = Math.max(remaining - simVal, 0);
  const savedInterest = simDebt && simVal > 0 ? normalInterest - (newRemaining * (simDebt.interestRate / 100) * Math.ceil(newRemaining / simDebt.monthlyPayment)) : 0;

  const totalDebt = state.debts.reduce((s, d) => s + (d.totalAmount - d.paidAmount), 0);
  const totalPaid = state.debts.reduce((s, d) => s + d.paidAmount, 0);
  const totalOriginal = state.debts.reduce((s, d) => s + d.totalAmount, 0);
  const overallProgress = totalOriginal > 0 ? (totalPaid / totalOriginal) * 100 : 0;

  const inputCls = `w-full px-4 py-3 rounded-xl text-sm transition-all ${dk ? 'bg-dark-border border border-dark-border text-white placeholder:text-dark-muted focus:border-primary-500' : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-primary-500'}`;
  const labelCls = `block text-sm font-medium mb-1.5 ${dk ? 'text-dark-muted' : 'text-gray-600'}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className={`text-sm ${dk ? 'text-dark-muted' : 'text-gray-500'}`}>{state.debts.length} dívida(s) ativa(s)</p>
        <button id="add-debt-btn" onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/25">
          <Plus size={18} /> Nova Dívida
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`rounded-2xl p-5 ${dk ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-red-500" />
            <p className={`text-xs font-medium ${dk ? 'text-dark-muted' : 'text-gray-500'}`}>Total Restante</p>
          </div>
          <p className="text-2xl font-bold text-red-500 tabular-nums">{fmt(totalDebt)}</p>
        </div>
        <div className={`rounded-2xl p-5 ${dk ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <p className={`text-xs font-medium ${dk ? 'text-dark-muted' : 'text-gray-500'}`}>Total Pago</p>
          </div>
          <p className="text-2xl font-bold text-emerald-500 tabular-nums">{fmt(totalPaid)}</p>
        </div>
        <div className={`rounded-2xl p-5 ${dk ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={16} className="text-primary-500" />
            <p className={`text-xs font-medium ${dk ? 'text-dark-muted' : 'text-gray-500'}`}>Progresso Geral</p>
          </div>
          <p className={`text-2xl font-bold tabular-nums ${dk ? 'text-white' : 'text-gray-900'}`}>{overallProgress.toFixed(1)}%</p>
          <div className={`w-full h-2 rounded-full mt-2 ${dk ? 'bg-dark-border' : 'bg-gray-100'}`}>
            <div className="h-full rounded-full progress-bar-fill bg-gradient-to-r from-primary-500 to-emerald-500" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>
      </div>

      {/* Debts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {state.debts.map((d, i) => (
          <div key={d.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <DebtCard debt={d} onEdit={() => openEdit(d)} onDelete={() => deleteDebt(d.id)} onSimulate={() => openSim(d)} />
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingDebt ? 'Editar Dívida' : 'Nova Dívida'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelCls}>Nome</label>
            <input className={inputCls} placeholder="Ex: Financiamento Carro" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div>
            <label className={labelCls}>Tipo</label>
            <select className={inputCls} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as Debt['type'] }))}>
              <option value="cartao">Cartão de Crédito</option><option value="emprestimo">Empréstimo</option>
              <option value="financiamento">Financiamento</option><option value="outro">Outro</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Valor Total (R$)</label><input type="number" step="0.01" className={inputCls} value={form.totalAmount} onChange={e => setForm(f => ({ ...f, totalAmount: e.target.value }))} required /></div>
            <div><label className={labelCls}>Valor Pago (R$)</label><input type="number" step="0.01" className={inputCls} value={form.paidAmount} onChange={e => setForm(f => ({ ...f, paidAmount: e.target.value }))} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Total Parcelas</label><input type="number" className={inputCls} value={form.totalInstallments} onChange={e => setForm(f => ({ ...f, totalInstallments: e.target.value }))} required /></div>
            <div><label className={labelCls}>Parcelas Pagas</label><input type="number" className={inputCls} value={form.paidInstallments} onChange={e => setForm(f => ({ ...f, paidInstallments: e.target.value }))} required /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className={labelCls}>Parcela (R$)</label><input type="number" step="0.01" className={inputCls} value={form.monthlyPayment} onChange={e => setForm(f => ({ ...f, monthlyPayment: e.target.value }))} required /></div>
            <div><label className={labelCls}>Juros (% a.m.)</label><input type="number" step="0.01" className={inputCls} value={form.interestRate} onChange={e => setForm(f => ({ ...f, interestRate: e.target.value }))} required /></div>
            <div><label className={labelCls}>Dia Vcto.</label><input type="number" min="1" max="31" className={inputCls} value={form.dueDay} onChange={e => setForm(f => ({ ...f, dueDay: e.target.value }))} required /></div>
          </div>
          <button type="submit" className="w-full py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/25">
            {editingDebt ? 'Salvar Alterações' : 'Adicionar Dívida'}
          </button>
        </form>
      </Modal>

      {/* Simulation Modal */}
      <Modal isOpen={simModalOpen} onClose={() => setSimModalOpen(false)} title="Simular Pagamento Antecipado">
        {simDebt && (
          <div className="space-y-5">
            <div className={`rounded-xl p-4 ${dk ? 'bg-dark-border' : 'bg-gray-50'}`}>
              <p className={`font-semibold ${dk ? 'text-white' : 'text-gray-900'}`}>{simDebt.name}</p>
              <p className={`text-sm mt-1 ${dk ? 'text-dark-muted' : 'text-gray-500'}`}>Saldo devedor: <span className="font-bold text-red-500">{fmt(remaining)}</span></p>
            </div>
            <div>
              <label className={labelCls}>Valor do pagamento antecipado (R$)</label>
              <input type="number" step="0.01" className={inputCls} placeholder="0,00" value={simAmount} onChange={e => setSimAmount(e.target.value)} />
            </div>
            {simVal > 0 && (
              <div className={`space-y-3 rounded-xl p-4 border-2 border-emerald-500/20 ${dk ? 'bg-emerald-500/5' : 'bg-emerald-50'}`}>
                <h4 className="text-emerald-500 font-semibold flex items-center gap-2"><CheckCircle2 size={16} /> Resultado da Simulação</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className={`text-xs ${dk ? 'text-dark-muted' : 'text-gray-500'}`}>Novo Saldo</p>
                    <p className={`font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>{fmt(newRemaining)}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${dk ? 'text-dark-muted' : 'text-gray-500'}`}>Economia em Juros</p>
                    <p className="font-bold text-emerald-500">{fmt(Math.max(savedInterest, 0))}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${dk ? 'text-dark-muted' : 'text-gray-500'}`}>Parcelas Restantes</p>
                    <p className={`font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>{simDebt.monthlyPayment > 0 ? Math.ceil(newRemaining / simDebt.monthlyPayment) : 0}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
