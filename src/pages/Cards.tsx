import { useState, useRef } from 'react';
import { Plus, Edit3, Trash2, Upload } from 'lucide-react';
import { useFinance, getCardPreset } from '../contexts/FinanceContext';
import { useTheme } from '../contexts/ThemeContext';
import Modal from '../components/Modal';
import type { CreditCard } from '../types';

function fmt(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

const brandLogos: Record<string, string> = {
  visa: 'VISA',
  mastercard: 'MC',
  elo: 'ELO',
  amex: 'AMEX',
  hipercard: 'HIPER',
  other: '••',
};

function CreditCardVisual({ card, onEdit, onDelete }: { card: CreditCard; onEdit: () => void; onDelete: () => void }) {
  const { isDark } = useTheme();
  return (
    <div className="relative group">
      <div
        className="relative w-full aspect-[1.6/1] rounded-2xl p-5 sm:p-6 flex flex-col justify-between
          credit-card-shine cursor-pointer transition-transform duration-300 group-hover:scale-[1.02]
          shadow-xl overflow-hidden"
        style={{
          background: card.customImage ? `url(${card.customImage}) center/cover` : card.gradient,
        }}
      >
        {/* Decorative circles */}
        {!card.customImage && (
          <>
            <div className="absolute top-[-30%] right-[-10%] w-48 h-48 rounded-full bg-white/10" />
            <div className="absolute bottom-[-20%] left-[-5%] w-36 h-36 rounded-full bg-white/5" />
          </>
        )}
        {/* Top row */}
        <div className="flex items-start justify-between relative z-10">
          <div>
            <p className="text-white/70 text-xs font-medium tracking-wider uppercase">{card.name}</p>
            <div className="flex items-center gap-1 mt-2">
              <div className="w-8 h-5 rounded bg-yellow-400/80 shadow-inner" />
              <div className="w-5 h-5 rounded bg-white/20 ml-1" />
            </div>
          </div>
          <span className="text-white text-lg font-black tracking-wider">{brandLogos[card.brand]}</span>
        </div>
        {/* Card Number */}
        <div className="relative z-10">
          <p className="text-white/80 text-sm sm:text-base font-mono tracking-[0.2em]">{card.number}</p>
        </div>
        {/* Bottom - Invoice amount */}
        <div className="flex items-end justify-between relative z-10">
          <div>
            <p className="text-white/60 text-[10px] uppercase tracking-wider">Fatura Atual</p>
            <p className="text-white text-xl sm:text-2xl font-bold tabular-nums mt-0.5">{fmt(card.invoiceAmount)}</p>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-[10px] uppercase tracking-wider">Vencimento</p>
            <p className="text-white text-sm font-semibold">Dia {card.dueDate}</p>
          </div>
        </div>
      </div>
      {/* Action buttons on hover */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <button onClick={onEdit} className="p-2 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors">
          <Edit3 size={14} />
        </button>
        <button onClick={onDelete} className="p-2 rounded-xl bg-red-500/40 backdrop-blur-sm text-white hover:bg-red-500/60 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
      {/* Limit bar */}
      <div className={`mt-3 rounded-xl p-3 ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100 shadow-sm'}`}>
        <div className="flex justify-between text-xs mb-1.5">
          <span className={isDark ? 'text-dark-muted' : 'text-gray-500'}>Limite Usado</span>
          <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{((card.invoiceAmount / card.limit) * 100).toFixed(0)}%</span>
        </div>
        <div className={`w-full h-2 rounded-full ${isDark ? 'bg-dark-border' : 'bg-gray-100'}`}>
          <div className="h-full rounded-full progress-bar-fill bg-gradient-to-r from-primary-500 to-primary-400"
            style={{ width: `${Math.min((card.invoiceAmount / card.limit) * 100, 100)}%` }} />
        </div>
        <p className={`text-[10px] mt-1 ${isDark ? 'text-dark-muted' : 'text-gray-400'}`}>
          {fmt(card.invoiceAmount)} de {fmt(card.limit)}
        </p>
      </div>
    </div>
  );
}

export default function CardsPage() {
  const { state, dispatch } = useFinance();
  const { isDark } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const dk = isDark;
  const card = `${dk ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100 shadow-sm'}`;

  const [form, setForm] = useState({
    name: '', number: '', brand: 'visa' as CreditCard['brand'],
    invoiceAmount: '', limit: '', dueDate: '', customImage: '',
  });

  const openAdd = () => {
    setEditingCard(null);
    setForm({ name: '', number: '', brand: 'visa', invoiceAmount: '', limit: '', dueDate: '', customImage: '' });
    setModalOpen(true);
  };

  const openEdit = (c: CreditCard) => {
    setEditingCard(c);
    setForm({
      name: c.name, number: c.number, brand: c.brand,
      invoiceAmount: String(c.invoiceAmount), limit: String(c.limit),
      dueDate: String(c.dueDate), customImage: c.customImage || '',
    });
    setModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({ ...f, customImage: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const preset = getCardPreset(form.name);
    const cardData: CreditCard = {
      id: editingCard?.id || Date.now().toString(),
      name: form.name,
      number: form.number || `•••• •••• •••• ${Math.floor(1000 + Math.random() * 9000)}`,
      brand: form.brand,
      invoiceAmount: parseFloat(form.invoiceAmount) || 0,
      limit: parseFloat(form.limit) || 5000,
      dueDate: parseInt(form.dueDate) || 10,
      color: preset.color,
      gradient: preset.gradient,
      customImage: form.customImage || undefined,
    };
    dispatch({ type: editingCard ? 'UPDATE_CARD' : 'ADD_CARD', payload: cardData });
    setModalOpen(false);
  };

  const deleteCard = (id: string) => {
    if (confirm('Tem certeza que deseja remover este cartão?')) {
      dispatch({ type: 'REMOVE_CARD', payload: id });
    }
  };

  const inputCls = `w-full px-4 py-3 rounded-xl text-sm transition-all ${dk ? 'bg-dark-border border border-dark-border text-white placeholder:text-dark-muted focus:border-primary-500' : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-primary-500'}`;
  const labelCls = `block text-sm font-medium mb-1.5 ${dk ? 'text-dark-muted' : 'text-gray-600'}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${dk ? 'text-dark-muted' : 'text-gray-500'}`}>
            {state.cards.length} cartão(ões) cadastrado(s)
          </p>
        </div>
        <button id="add-card-btn" onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/25 hover:shadow-primary-600/40">
          <Plus size={18} /> Novo Cartão
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {state.cards.map((c, i) => (
          <div key={c.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <CreditCardVisual card={c} onEdit={() => openEdit(c)} onDelete={() => deleteCard(c.id)} />
          </div>
        ))}
        {/* Add card placeholder */}
        <button onClick={openAdd}
          className={`rounded-2xl border-2 border-dashed aspect-[1.6/1] flex flex-col items-center justify-center gap-3 transition-all hover:scale-[1.02]
            ${dk ? 'border-dark-border hover:border-primary-500/50 text-dark-muted hover:text-primary-400' : 'border-gray-200 hover:border-primary-300 text-gray-400 hover:text-primary-500'}`}>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${dk ? 'bg-dark-border' : 'bg-gray-100'}`}>
            <Plus size={24} />
          </div>
          <span className="text-sm font-medium">Adicionar Cartão</span>
        </button>
      </div>

      {/* Total invoices */}
      <div className={`rounded-2xl p-6 ${card}`}>
        <h3 className={`font-semibold mb-4 ${dk ? 'text-white' : 'text-gray-900'}`}>Resumo de Faturas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`rounded-xl p-4 ${dk ? 'bg-dark-border' : 'bg-gray-50'}`}>
            <p className={`text-xs ${dk ? 'text-dark-muted' : 'text-gray-500'}`}>Total Faturas</p>
            <p className={`text-xl font-bold mt-1 text-red-500 tabular-nums`}>
              {fmt(state.cards.reduce((s, c) => s + c.invoiceAmount, 0))}
            </p>
          </div>
          <div className={`rounded-xl p-4 ${dk ? 'bg-dark-border' : 'bg-gray-50'}`}>
            <p className={`text-xs ${dk ? 'text-dark-muted' : 'text-gray-500'}`}>Limite Total</p>
            <p className={`text-xl font-bold mt-1 tabular-nums ${dk ? 'text-white' : 'text-gray-900'}`}>
              {fmt(state.cards.reduce((s, c) => s + c.limit, 0))}
            </p>
          </div>
          <div className={`rounded-xl p-4 ${dk ? 'bg-dark-border' : 'bg-gray-50'}`}>
            <p className={`text-xs ${dk ? 'text-dark-muted' : 'text-gray-500'}`}>Limite Disponível</p>
            <p className="text-xl font-bold mt-1 text-emerald-500 tabular-nums">
              {fmt(state.cards.reduce((s, c) => s + (c.limit - c.invoiceAmount), 0))}
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingCard ? 'Editar Cartão' : 'Novo Cartão'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelCls}>Nome do Banco/Cartão</label>
            <input className={inputCls} placeholder="Ex: Nubank, Inter, Itaú..." value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            <p className={`text-[10px] mt-1 ${dk ? 'text-dark-muted' : 'text-gray-400'}`}>
              As cores do cartão serão ajustadas automaticamente pelo banco informado
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Bandeira</label>
              <select className={inputCls} value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value as CreditCard['brand'] }))}>
                <option value="visa">Visa</option><option value="mastercard">MasterCard</option>
                <option value="elo">Elo</option><option value="amex">American Express</option>
                <option value="hipercard">Hipercard</option><option value="other">Outra</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Número (últimos 4)</label>
              <input className={inputCls} placeholder="•••• 1234" maxLength={4} value={form.number}
                onChange={e => setForm(f => ({ ...f, number: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Fatura Atual (R$)</label>
              <input type="number" step="0.01" className={inputCls} placeholder="0,00" value={form.invoiceAmount}
                onChange={e => setForm(f => ({ ...f, invoiceAmount: e.target.value }))} required />
            </div>
            <div>
              <label className={labelCls}>Limite (R$)</label>
              <input type="number" step="0.01" className={inputCls} placeholder="5000" value={form.limit}
                onChange={e => setForm(f => ({ ...f, limit: e.target.value }))} required />
            </div>
            <div>
              <label className={labelCls}>Vencimento</label>
              <input type="number" min="1" max="31" className={inputCls} placeholder="10" value={form.dueDate}
                onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} required />
            </div>
          </div>
          <div>
            <label className={labelCls}>Imagem Personalizada (opcional)</label>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <button type="button" onClick={() => fileRef.current?.click()}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed transition-colors
                ${dk ? 'border-dark-border hover:border-primary-500/50 text-dark-muted' : 'border-gray-200 hover:border-primary-300 text-gray-400'}`}>
              <Upload size={16} /> {form.customImage ? 'Imagem selecionada ✓' : 'Enviar imagem PNG'}
            </button>
          </div>
          {/* Preview */}
          {form.name && (
            <div className="rounded-xl overflow-hidden" style={{ background: form.customImage ? `url(${form.customImage}) center/cover` : getCardPreset(form.name).gradient }}>
              <div className="p-4 text-white">
                <p className="text-xs opacity-70">{form.name}</p>
                <p className="font-mono text-sm mt-2 tracking-wider">•••• •••• •••• {form.number || '0000'}</p>
                <p className="text-lg font-bold mt-2">{fmt(parseFloat(form.invoiceAmount) || 0)}</p>
              </div>
            </div>
          )}
          <button type="submit"
            className="w-full py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/25">
            {editingCard ? 'Salvar Alterações' : 'Adicionar Cartão'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
