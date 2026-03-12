import type { AccessProof } from '@/types';
import { LICENSE_TYPE_META } from '@/types';
import { motion } from 'framer-motion';
import { CheckCircle2, Copy, ExternalLink, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

interface AccessProofPanelProps {
  proof: AccessProof;
  onClose?: () => void;
}

function CopyField({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="space-y-1">
      <div className="text-xs text-muted-foreground font-medium">{label}</div>
      <div className="flex items-center gap-2">
        <div className={`flex-1 px-3 py-2 rounded-lg bg-secondary/40 border border-border/50 text-xs truncate ${mono ? 'font-mono' : ''}`}>
          {value}
        </div>
        <button
          onClick={copy}
          className="p-2 rounded-lg hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-all shrink-0"
          title="Copy"
        >
          {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}

export function AccessProofPanel({ proof, onClose }: AccessProofPanelProps) {
  const licMeta = LICENSE_TYPE_META[proof.licenseType];
  const explorerUrl = `https://explorer.shelby.xyz/testnet/txn/${proof.txHash}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-strong rounded-2xl p-6 border border-green-400/20 glow-accent"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-400/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Access Proof Issued</h3>
            <p className="text-xs text-muted-foreground">Cryptographically verifiable on Shelby testnet</p>
          </div>
        </div>
        <span className="badge badge-green text-[10px]">✓ Valid</span>
      </div>

      {/* Dataset + license */}
      <div className="p-3 rounded-xl bg-secondary/30 border border-border/40 mb-4">
        <div className="text-xs font-semibold mb-0.5 truncate">{proof.datasetTitle}</div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className={`badge text-[10px] ${licMeta.color}`}>{licMeta.icon} {licMeta.label}</span>
          <span>·</span>
          <span>Paid: ${proof.amountPaid.toFixed(2)} SUSD</span>
        </div>
      </div>

      {/* Proof fields */}
      <div className="space-y-3">
        <CopyField label="Proof ID" value={proof.id} />
        <CopyField label="Transaction Hash (Aptos)" value={proof.txHash} />
        <CopyField label="Blob Hash (SHA-256)" value={proof.blobHash} />
        {proof.merkleRoot && (
          <CopyField label="Merkle Root" value={proof.merkleRoot} />
        )}
        <CopyField label="Consumer Address" value={proof.consumerAddress} />
        <CopyField label="Issued At" value={new Date(proof.timestamp).toISOString()} mono={false} />
        {proof.expiresAt && (
          <CopyField label="Expires At" value={new Date(proof.expiresAt).toISOString()} mono={false} />
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-5">
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline text-xs flex-1 justify-center"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View on Shelby Explorer
        </a>
        {onClose && (
          <button onClick={onClose} className="btn-ghost text-xs px-3">
            Close
          </button>
        )}
      </div>
    </motion.div>
  );
}
