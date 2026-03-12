import { DatasetCard } from '@/components/DatasetCard';
import { useMarketplace } from '@/hooks/useMarketplace';
import type { DatasetCategory, LicenseType, MarketplaceFilter } from '@/types';
import { DATASET_CATEGORY_META } from '@/types';
import { motion } from 'framer-motion';
import { Filter, Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Home() {
  const [filter, setFilter] = useState<MarketplaceFilter>({
    sortBy: 'popular',
  });

  const { datasets, stats } = useMarketplace(filter);

  const categories = ['all', ...Object.keys(DATASET_CATEGORY_META)] as Array<DatasetCategory | 'all'>;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <div className="max-w-4xl mx-auto text-center mb-20 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-sm font-medium mb-6 border border-border"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          The Data Layer for Decentralized AI
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight"
        >
          Discover & License <br className="hidden md:block" />
          <span className="gradient-text">High-Value AI Datasets</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Publish, monetize, and fetch training data, RAG corpora, and embeddings with cryptographic access proofs. Settled on Aptos, delivered by DoubleZero.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#browse" className="btn-primary px-8 py-3.5 text-base w-full sm:w-auto">
            Browse Marketplace
          </a>
          <Link to="/publish" className="btn-secondary px-8 py-3.5 text-base w-full sm:w-auto">
            Publish Dataset
          </Link>
        </motion.div>

        {/* Stats */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto"
          >
            {[
              { label: 'Available Datasets', value: stats.totalListings },
              { label: 'Total Downloads', value: stats.totalDownloads.toLocaleString() },
              { label: 'Revenue Paid (SUSD)', value: '$' + stats.totalRevenuePaid.toLocaleString() },
              { label: 'MCP Agents Enabled', value: stats.mcpEnabledCount },
            ].map(s => (
              <div key={s.label} className="p-4 rounded-xl bg-card border border-border/50 text-center">
                <div className="text-2xl font-bold gradient-text mb-1">{s.value}</div>
                <div className="text-xs text-muted-foreground font-medium">{s.label}</div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      <div id="browse" className="scroll-mt-24">
        {/* Marketplace Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search datasets, categories, tags..."
              className="input pl-10 h-11 bg-card border-border/50 focus:bg-card focus:border-primary/50"
              onChange={(e) => setFilter(f => ({ ...f, search: e.target.value }))}
            />
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide shrink-0">
            <div className="flex items-center gap-2 bg-card border border-border/50 rounded-lg p-1 shrink-0">
              <button
                onClick={() => setFilter(f => ({ ...f, mcpOnly: !f.mcpOnly }))}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  filter.mcpOnly ? 'bg-cyan-400/10 text-cyan-400' : 'text-muted-foreground hover:bg-secondary'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                MCP Ready
              </button>
            </div>

            <select
              className="input h-11 w-40 bg-card border-border/50"
              value={filter.sortBy}
              onChange={(e) => setFilter(f => ({ ...f, sortBy: e.target.value as MarketplaceFilter['sortBy'] }))}
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="rating">Highest Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(c => {
            const isSelected = filter.category === c || (!filter.category && c === 'all');
            return (
              <button
                key={c}
                onClick={() => setFilter(f => ({ ...f, category: c === 'all' ? undefined : c }))}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  isSelected
                    ? 'bg-primary/10 text-primary border-primary/20'
                    : 'bg-card border-border/50 text-muted-foreground hover:bg-secondary/50'
                }`}
              >
                {c === 'all' ? 'All Categories' : DATASET_CATEGORY_META[c].label}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {datasets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {datasets.map((ds, i) => (
              <DatasetCard key={ds.id} dataset={ds} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed rounded-2xl border-border/50 bg-secondary/20">
            <div className="w-16 h-16 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No datasets found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
