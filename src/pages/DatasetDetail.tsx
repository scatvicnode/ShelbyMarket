import { AccessProofPanel } from '@/components/AccessProofPanel';
import { MCPSkillPanel } from '@/components/MCPSkillPanel';
import { useWallet } from '@/contexts/WalletContext';
import { useDataset, useMarketplace } from '@/hooks/useMarketplace';
import { DATASET_CATEGORY_META, formatFileSize, formatPrice, LICENSE_TYPE_META, shortenAddress, timeAgo } from '@/types';
import { Download, FileJson, Info, Shield, Star, Wallet } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

export function DatasetDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: dataset } = useDataset(id || '');
  const { purchaseAccess, isPurchasing, lastProof } = useMarketplace();
  const { connected, connect } = useWallet();

  const [showProof, setShowProof] = useState(false);

  if (!dataset) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Dataset not found</h2>
      </div>
    );
  }

  const catMeta = DATASET_CATEGORY_META[dataset.category];
  const licMeta = LICENSE_TYPE_META[dataset.licenseType];

  const handlePurchase = async () => {
    if (!connected) {
      connect();
      return;
    }
    await purchaseAccess(dataset.id);
    setShowProof(true);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header */}
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`badge ${catMeta.color}`}>{catMeta.icon} {catMeta.label}</span>
              {dataset.isVerified && (
                <span className="badge badge-green"><Shield className="w-3.5 h-3.5" /> Verified Publisher</span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">{dataset.title}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {dataset.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {dataset.tags.map(t => (
              <span key={t} className="px-2.5 py-1 rounded-md text-xs bg-secondary text-muted-foreground font-medium border border-border/50">
                #{t}
              </span>
            ))}
          </div>

          <hr className="border-border/50" />

          {/* Sample Data */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileJson className="w-5 h-5 text-primary" />
              Data Schema & Sample
            </h2>
            <div className="glass rounded-xl p-5 border-border/50">
              <div className="grid sm:grid-cols-2 gap-4 mb-5 pb-5 border-b border-border/40">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Format</div>
                  <div className="font-mono text-sm uppercase bg-secondary inline-block px-2 py-0.5 rounded text-foreground">
                    {dataset.dataFormat || 'unknown'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Total Rows / Samples</div>
                  <div className="font-mono text-sm">{dataset.sampleRows ? dataset.sampleRows.toLocaleString() : 'N/A'}</div>
                </div>
              </div>
              <p className="text-sm font-mono text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {dataset.sampleDescription || 'No schema description provided.'}
              </p>
            </div>
          </div>

          {/* MCP Panel */}
          {dataset.mcpEnabled && (
            <MCPSkillPanel dataset={dataset} />
          )}

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Purchase Card */}
          <div className="glass-strong rounded-2xl p-6 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-accent" />
            
            <div className="mb-6">
              <div className="text-sm font-medium text-muted-foreground mb-2">License Type</div>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border ${licMeta.color}`}>
                {licMeta.icon} {licMeta.label}
              </div>
              <p className="text-xs text-muted-foreground mt-2">{licMeta.description}</p>
            </div>

            <div className="mb-6 flex items-end gap-2">
              <span className="text-4xl font-black gradient-text tracking-tighter">
                {dataset.licenseType === 'enterprise'
                  ? 'Custom'
                  : dataset.licenseType === 'subscription'
                    ? `$${dataset.subscriptionMonthly}`
                    : formatPrice(dataset.pricePerDownload)}
              </span>
              {dataset.licenseType === 'subscription' && <span className="text-muted-foreground pb-1">/ mo</span>}
            </div>

            <button
              onClick={handlePurchase}
              disabled={isPurchasing}
              className="btn-primary w-full py-3.5 text-base mb-4 shadow-lg shadow-primary/20"
            >
              {!connected ? (
                <><Wallet className="w-4 h-4" /> Connect Wallet to Buy</>
              ) : isPurchasing ? (
                'Processing on Aptos...'
              ) : dataset.licenseType === 'open' ? (
                'Generate Access Proof (Free)'
              ) : (
                'Purchase Access'
              )}
            </button>

            <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-400/10 border border-blue-400/20 text-blue-400">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                Payment settles instantly on Aptos testnet. You will receive a cryptographic <strong>Access Proof</strong> required for downloading the blob or accessing via MCP.
              </div>
            </div>
          </div>

          {/* Proof Modal Overlay */}
          {showProof && lastProof && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
              <div className="w-full max-w-lg">
                <AccessProofPanel proof={lastProof} onClose={() => setShowProof(false)} />
              </div>
            </div>
          )}

          {/* Metadata Sidebar */}
          <div className="glass rounded-xl p-5 border-border/50">
            <h3 className="font-semibold text-sm mb-4">Dataset Info</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between">
                <span className="text-muted-foreground">Owner</span>
                <span className="font-mono">{shortenAddress(dataset.ownerAddress)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Published</span>
                <span>{timeAgo(dataset.publishedAt)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Size</span>
                <span className="font-mono text-cyan-400">{formatFileSize(dataset.sizeBytes)}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-muted-foreground">Downloads</span>
                <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5 text-muted-foreground" /> {dataset.totalDownloads.toLocaleString()}</span>
              </li>
              {dataset.rating > 0 && (
                <li className="flex justify-between items-center">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {dataset.rating.toFixed(1)}
                  </span>
                </li>
              )}
              {dataset.merkleRoot && (
                <li className="pt-4 mt-4 border-t border-border/30">
                  <span className="block text-muted-foreground mb-1 text-xs">Merkle Root</span>
                  <span className="block font-mono text-[10px] break-all bg-secondary/50 p-2 rounded border border-border/50 text-muted-foreground/80">
                    {dataset.merkleRoot}
                  </span>
                </li>
              )}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
