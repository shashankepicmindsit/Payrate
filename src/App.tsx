/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ReactNode } from 'react';
import { DollarSign, Calculator, Briefcase, Users, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [billRate, setBillRate] = useState<number | string>('');
  const [rates, setRates] = useState({
    starting: {
      w2: { pay: 0, margin: 0 },
      c2c: { pay: 0, margin: 0 },
      i1099: { pay: 0, margin: 0 },
    },
    max: {
      w2: { pay: 0, margin: 0 },
      c2c: { pay: 0, margin: 0 },
      i1099: { pay: 0, margin: 0 },
    }
  });

  useEffect(() => {
    const rate = typeof billRate === 'number' ? billRate : parseFloat(billRate) || 0;

    if (rate <= 0) {
      const empty = { pay: 0, margin: 0 };
      setRates({
        starting: { w2: empty, c2c: empty, i1099: empty },
        max: { w2: empty, c2c: empty, i1099: empty },
      });
      return;
    }

    // Starting Rates (W2-45%, C2C-25%, 1099-25%)
    const sW2Pay = Math.max(0, Math.round(rate / 1.45) - 5);
    const sC2CPay = Math.max(0, Math.round(rate / 1.25) - 5);
    const s1099Pay = Math.max(0, Math.round(rate / 1.25) - 5);

    // Max Rates (W2-35%, C2C-15%, 1099-15%)
    const mW2Pay = Math.max(0, Math.round(rate / 1.35) - 5);
    const mC2CPay = Math.max(0, Math.round(rate / 1.15) - 5);
    const m1099Pay = Math.max(0, Math.round(rate / 1.15) - 5);

    setRates({
      starting: {
        w2: { pay: sW2Pay, margin: rate - sW2Pay },
        c2c: { pay: sC2CPay, margin: rate - sC2CPay },
        i1099: { pay: s1099Pay, margin: rate - s1099Pay },
      },
      max: {
        w2: { pay: mW2Pay, margin: rate - mW2Pay },
        c2c: { pay: mC2CPay, margin: rate - mC2CPay },
        i1099: { pay: m1099Pay, margin: rate - m1099Pay },
      }
    });
  }, [billRate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-white to-emerald-50/50 text-slate-900 font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-3 px-4 shrink-0 shadow-sm relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-2 lg:gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-emerald-600 p-1.5 rounded-lg shadow-md shadow-emerald-200">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-800">Pay Rate Calculator</h1>
          </div>
          <div className="text-center lg:text-right mt-1 lg:mt-0">
            <span className="text-emerald-600 font-bold italic uppercase tracking-widest text-[10px] sm:text-xs">
              <b>"The max rate is your red line—NEVER your FIRST PITCH. Now get back on the phones and close that deal!"</b>
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center max-w-6xl mx-auto w-full px-4 py-6 sm:py-10">
        {/* Input Section */}
        <section className="mb-6 shrink-0 mt-2 sm:mt-4">
          <div className="max-w-[340px] mx-auto bg-white p-4 sm:p-5 rounded-xl shadow-md shadow-slate-200/50 border border-slate-100 bg-gradient-to-br from-white to-teal-50/20">
            <label
              htmlFor="billRate"
              className="block text-[11px] sm:text-xs font-black text-slate-500 uppercase tracking-widest mb-2 text-center"
            >
              Client Bill Rate ($/hr)
            </label>
            <div className="relative group max-w-[220px] mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500 group-focus-within:text-emerald-600 transition-colors" />
              </div>
              <input
                type="number"
                id="billRate"
                value={billRate}
                onChange={(e) => setBillRate(e.target.value)}
                className="block w-full pl-10 sm:pl-12 pr-3 py-2 sm:py-2.5 text-2xl sm:text-3xl font-black text-slate-800 bg-slate-100 border-2 border-transparent rounded-lg focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-center shadow-inner"
                placeholder="0"
                autoFocus
              />
            </div>
          </div>
        </section>

        {(!billRate || Number(billRate) <= 0) ? (
          <div className="flex-1 flex flex-col items-center mt-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/60 p-8 rounded-3xl border border-emerald-100/50 shadow-sm max-w-sm w-full text-center"
            >
              <Calculator className="w-16 h-16 text-emerald-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700 mb-2">Ready to Calculate?</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Enter a Client Bill Rate above to automatically generate your starting and maximum rate ranges.
              </p>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col"
          >
            {/* Starting Rates Row */}
            <div className="mb-3 shrink-0">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <div className="h-px bg-emerald-100 flex-1 max-w-[40px]" />
                <h2 className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.25em]">
                  Starting Offer
                </h2>
                <div className="h-px bg-emerald-100 flex-1 max-w-[40px]" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <RateCard
                  title="W2"
                  pay={rates.starting.w2.pay}
                  margin={rates.starting.w2.margin}
                  icon={<Briefcase className="w-3.5 h-3.5" />}
                  theme="green"
                  label="Starting Pay"
                  delay={0.1}
                />
                <RateCard
                  title="C2C"
                  pay={rates.starting.c2c.pay}
                  margin={rates.starting.c2c.margin}
                  icon={<Users className="w-3.5 h-3.5" />}
                  theme="green"
                  label="Starting Pay"
                  delay={0.2}
                />
                <RateCard
                  title="1099"
                  pay={rates.starting.i1099.pay}
                  margin={rates.starting.i1099.margin}
                  icon={<UserCheck className="w-3.5 h-3.5" />}
                  theme="green"
                  label="Starting Pay"
                  delay={0.3}
                />
              </div>
            </div>

            {/* Maximum Rates Row */}
            <div className="mb-3 shrink-0">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <div className="h-px bg-rose-100 flex-1 max-w-[40px]" />
                <h2 className="text-[9px] font-black text-rose-600 uppercase tracking-[0.25em]">
                  Maximum Offer
                </h2>
                <div className="h-px bg-rose-100 flex-1 max-w-[40px]" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <RateCard
                  title="W2"
                  pay={rates.max.w2.pay}
                  margin={rates.max.w2.margin}
                  icon={<Briefcase className="w-3.5 h-3.5" />}
                  theme="red"
                  label="Max Pay Rate"
                  delay={0.4}
                />
                <RateCard
                  title="C2C"
                  pay={rates.max.c2c.pay}
                  margin={rates.max.c2c.margin}
                  icon={<Users className="w-3.5 h-3.5" />}
                  theme="red"
                  label="Max Pay Rate"
                  delay={0.5}
                />
                <RateCard
                  title="1099"
                  pay={rates.max.i1099.pay}
                  margin={rates.max.i1099.margin}
                  icon={<UserCheck className="w-3.5 h-3.5" />}
                  theme="red"
                  label="Max Pay Rate"
                  delay={0.6}
                />
              </div>
            </div>
          </motion.div>
        )}

      </main>
    </div>
  );
}

interface RateCardProps {
  title: string;
  pay: number;
  margin: number;
  icon: ReactNode;
  theme: 'green' | 'red';
  label: string;
  delay: number;
}

function RateCard({ title, pay, margin, icon, theme, label, delay }: RateCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const colors = {
    green: {
      icon: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      pay: 'text-emerald-600',
      margin: 'text-slate-800',
      card: 'bg-gradient-to-br from-white to-emerald-50/80 border-emerald-100/60 shadow-md shadow-emerald-200/40 hover:shadow-lg hover:shadow-emerald-300/50 hover:-translate-y-0.5'
    },
    red: {
      icon: 'text-rose-600 bg-rose-50 border-rose-100',
      pay: 'text-rose-600',
      margin: 'text-slate-800',
      card: 'bg-gradient-to-br from-white to-rose-50/80 border-rose-100/60 shadow-md shadow-rose-200/40 hover:shadow-lg hover:shadow-rose-300/50 hover:-translate-y-0.5'
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`${colors[theme].card} p-3 sm:p-4 rounded-xl border flex flex-col items-center text-center group transition-all duration-300`}
    >
      <div className={`p-1 rounded-md mb-1.5 ${colors[theme].icon} border`}>
        {icon}
      </div>

      <h3 className="text-sm font-black text-slate-600 uppercase tracking-widest mb-1.5">
        {title}
      </h3>

      <div className="space-y-0 mb-1.5 overflow-hidden">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
          {label}
        </p>
        <motion.p
          key={pay}
          initial={{ opacity: 0, scale: 0.95, y: 2 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`text-2xl sm:text-3xl font-black ${colors[theme].pay} tracking-tight`}
        >
          {formatCurrency(pay)}
        </motion.p>
      </div>

    </motion.div>
  );
}
