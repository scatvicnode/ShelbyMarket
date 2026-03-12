import { Database, ExternalLink, Github, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ShelbyLogo } from './ShelbyLogo';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm mt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
                <Database className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-sm flex items-center">
                <ShelbyLogo className="h-[18px] w-auto -mt-[2px] pr-[2px]" />
                <span className="text-foreground">Market</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Decentralized AI dataset marketplace with cryptographic access proofs, settled on Aptos.
            </p>
            <div className="flex items-center gap-1.5 mt-3">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400">Shelby Testnet</span>
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Marketplace</h4>
            <ul className="space-y-2">
              {[
                { to: '/marketplace', label: 'Browse Datasets' },
                { to: '/marketplace?category=training_data', label: 'Training Data' },
                { to: '/marketplace?category=embeddings', label: 'Embeddings' },
                { to: '/marketplace?category=rag_corpus', label: 'RAG Corpus' },
                { to: '/marketplace?mcpOnly=true', label: 'MCP-Enabled' },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Publish */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Publish</h4>
            <ul className="space-y-2">
              {[
                { to: '/publish', label: 'Publish Dataset' },
                { to: '/my-datasets', label: 'My Listings' },
                { to: '/mcp-agents', label: 'MCP Agents' },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Resources</h4>
            <ul className="space-y-2">
              {[
                { href: 'https://docs.shelby.xyz/protocol', label: 'Shelby Protocol Docs' },
                { href: 'https://docs.shelby.xyz/sdks/typescript', label: 'TypeScript SDK' },
                { href: 'https://explorer.shelby.xyz', label: 'Shelby Explorer' },
                { href: 'https://faucet.shelbynet.shelby.xyz', label: 'Testnet Faucet' },
              ].map(({ href, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ShelbyMarket by Auranode · Built on Shelby Protocol · Settled on Aptos
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/hidayahhtaufik" target="_blank" rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://x.com/hidayahhtaufik" target="_blank" rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
