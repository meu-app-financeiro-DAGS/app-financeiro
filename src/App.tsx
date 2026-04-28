import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FinanceProvider } from './contexts/FinanceContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Cards from './pages/Cards';
import Debts from './pages/Debts';

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0e1a] transition-colors">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`${collapsed ? 'lg:pl-20' : 'lg:pl-64'} flex flex-col min-h-screen transition-all duration-300 w-full`} id="main-content">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/cartoes" element={<Cards />} />
              <Route path="/dividas" element={<Debts />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <FinanceProvider>
        <Router>
          <AppLayout />
        </Router>
      </FinanceProvider>
    </ThemeProvider>
  );
}
