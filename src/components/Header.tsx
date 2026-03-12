import { useWallet } from '@/contexts/WalletContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Database, Globe, LayoutDashboard, LogOut, Menu, Plus, Wallet, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShelbyLogo } from './ShelbyLogo';

const NAV = [
  { path: '/marketplace', label: 'Marketplace', icon: Database },
  { path: '/publish',     label: 'Publish',     icon: Plus },
  { path: '/my-datasets', label: 'My Datasets', icon: LayoutDashboard },
  { path: '/mcp-agents',  label: 'MCP Agents',  icon: Bot },
];

export function Header() {
  const { connected, connecting, address, connect, disconnect } = useWallet();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Database className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold flex items-center">
              <ShelbyLogo className="h-[22px] w-auto -mt-[3px] mr-[2px]" />
              <span className="text-foreground">Market</span>
            </span>
            <span className="hidden sm:inline text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
              TESTNET
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(({ path, label, icon: Icon }) => {
              const active = location.pathname === path || location.pathname.startsWith(path + '/');
              return (
                <Link key={path} to={path}>
                  <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }`}>
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                </Link>
              );
            })}
          </nav>

          {/* Wallet + Mobile Toggle */}
          <div className="flex items-center gap-2">
            {/* Testnet indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-400/5 border border-green-400/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400 font-medium">Shelby Testnet</span>
            </div>

            {connected ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/60 border border-border/50">
                  <Wallet className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-mono text-muted-foreground">
                    {address ? `${address.slice(0, 6)}…${address.slice(-4)}` : 'Connected'}
                  </span>
                </div>
                <button
                  onClick={disconnect}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                  title="Disconnect"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={connect}
                disabled={connecting}
                className="btn-primary text-sm"
              >
                <Globe className="w-4 h-4" />
                {connecting ? 'Connecting…' : 'Connect Wallet'}
              </button>
            )}

            {/* Mobile menu */}
            <button
              className="md:hidden p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition"
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-card/95 backdrop-blur-xl"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV.map(({ path, label, icon: Icon }) => {
                const active = location.pathname === path;
                return (
                  <Link key={path} to={path} onClick={() => setOpen(false)}>
                    <button className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                      active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }`}>
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
