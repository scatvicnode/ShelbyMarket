import type { DatasetListing } from '@/types';
import {
  DATASET_CATEGORY_META,
  formatFileSize,
  formatPrice,
  LICENSE_TYPE_META,
  shortenAddress,
  timeAgo,
} from '@/types';
import { motion } from 'framer-motion';
import { Bot, Download, Shield, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DatasetCardProps {
  dataset: DatasetListing;
  index?: number;
}

export function DatasetCard({ dataset, index = 0 }: DatasetCardProps) {
  const catMeta = DATASET_CATEGORY_META[dataset.category];
  const licMeta = LICENSE_TYPE_META[dataset.licenseType];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group"
    >
      <Link to={`/dataset/${dataset.id}`} className="block h-full">
        <div className="glass rounded-2xl p-5 h-full flex flex-col card-hover border border-border/50">
          {/* Top badges row */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex flex-wrap gap-1.5">
              <span className={`badge text-[11px] ${catMeta.color}`}>
                {catMeta.icon} {catMeta.label}
              </span>
              <span className={`badge text-[11px] ${licMeta.color}`}>
                {licMeta.icon} {licMeta.label}
              </span>
            </div>
            {dataset.mcpEnabled && (
              <span className="badge text-[10px] badge-cyan shrink-0">
                <Bot className="w-3 h-3" />
                MCP
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {dataset.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-3 flex-1">
            {dataset.description}
          </p>

          {/* Tags */}
          {dataset.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {dataset.tags.slice(0, 4).map((t: string) => (
                <span key={t} className="px-1.5 py-0.5 rounded text-[10px] bg-secondary text-muted-foreground">
                  #{t}
                </span>
              ))}
              {dataset.tags.length > 4 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-secondary text-muted-foreground">
                  +{dataset.tags.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Meta row */}
          <div className="border-t border-border/30 pt-3 mt-auto">
            <div className="flex items-center justify-between gap-2">
              {/* Left: size + format */}
              <div className="text-[11px] text-muted-foreground">
                <span className="font-mono">{formatFileSize(dataset.sizeBytes)}</span>
                {dataset.dataFormat && (
                  <span className="ml-1.5 px-1 py-0.5 rounded bg-secondary text-muted-foreground uppercase">
                    {dataset.dataFormat}
                  </span>
                )}
              </div>

              {/* Right: price */}
              <div className="text-right">
                <div className="text-sm font-bold gradient-text">
                  {dataset.licenseType === 'enterprise'
                    ? 'Custom'
                    : dataset.licenseType === 'subscription'
                      ? `$${dataset.subscriptionMonthly}/mo`
                      : formatPrice(dataset.pricePerDownload)}
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                {dataset.totalDownloads.toLocaleString()}
              </span>
              {dataset.rating > 0 && (
                <span className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3 h-3 fill-amber-400" />
                  {dataset.rating.toFixed(1)}
                  <span className="text-muted-foreground">({dataset.reviewCount})</span>
                </span>
              )}
              {dataset.isVerified && (
                <span className="flex items-center gap-1 text-green-400 ml-auto">
                  <Shield className="w-3 h-3" />
                  Verified
                </span>
              )}
              <span className="ml-auto text-[10px] text-muted-foreground/60">{timeAgo(dataset.publishedAt)}</span>
            </div>

            {/* Owner */}
            <div className="flex items-center gap-1 mt-1.5">
              <TrendingUp className="w-3 h-3 text-muted-foreground/50" />
              <span className="text-[10px] text-muted-foreground/60 font-mono">
                {shortenAddress(dataset.ownerAddress)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
