import { DatasetCard } from '@/components/DatasetCard';
import { useWallet } from '@/contexts/WalletContext';
import { useMarketplace } from '@/hooks/useMarketplace';
import { ShieldAlert, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

export function MyDatasets() {
  const { connected, connect } = useWallet();
  const { myListings } = useMarketplace();

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-32 text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-6">
          <Wallet className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Connect your wallet</h2>
        <p className="text-muted-foreground mb-8">
          You need to connect an Aptos wallet (e.g., Petra) to view your published datasets and track revenue.
        </p>
        <button onClick={connect} className="btn-primary w-full py-3 text-base">
          Connect Wallet
        </button>
      </div>
    );
  }

  const totalRevenue = myListings.reduce((sum: number, ds: any) => sum + ds.totalRevenue, 0);
  const totalDownloads = myListings.reduce((sum: number, ds: any) => sum + ds.totalDownloads, 0);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Datasets</h1>
          <p className="text-muted-foreground">Manage your published AI assets and track revenue on ShelbyMarket.</p>
        </div>
        <Link to="/publish" className="btn-primary shrink-0">Publish New Dataset</Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="glass rounded-2xl p-6 border-border/50">
          <div className="text-sm font-medium text-muted-foreground mb-1">Total Datasets Listed</div>
          <div className="text-3xl font-bold">{myListings.length}</div>
        </div>
        <div className="glass rounded-2xl p-6 border-border/50">
          <div className="text-sm font-medium text-muted-foreground mb-1">Total Downloads</div>
          <div className="text-3xl font-bold">{totalDownloads.toLocaleString()}</div>
        </div>
        <div className="glass rounded-2xl p-6 border-green-400/20 bg-green-400/5">
          <div className="text-sm font-medium text-green-400/80 mb-1">Total Revenue</div>
          <div className="text-3xl font-bold text-green-400">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })} SUSD</div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6">Published Assets</h2>

      {myListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myListings.map((ds: any, i: number) => (
            <DatasetCard key={ds.id} dataset={ds} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed rounded-2xl border-border/50 bg-secondary/10">
          <div className="w-12 h-12 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
            <ShieldAlert className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No datasets published yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
            Upload your first dataset to start monetizing your AI training data, embeddings, or RAG corpora.
          </p>
          <Link to="/publish" className="btn-secondary">Go to Publish Wizard</Link>
        </div>
      )}
    </div>
  );
}
