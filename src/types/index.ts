// ShelbyMarket - All Types for the AI Dataset & Knowledge Asset Marketplace

// ─── STORAGE TYPES (mirrors Shelby blobs) ─────────────────────────────────────

export interface ShelbyAccount {
  address: string;
  balance: { apt: number; shelbyUsd: number };
  storageUsed: number;
  storageLimit: number;
}

// ─── MARKETPLACE CORE TYPES ───────────────────────────────────────────────────

export type LicenseType = 'open' | 'pay_per_download' | 'subscription' | 'enterprise';

export type DatasetCategory =
  | 'training_data'
  | 'fine_tuning'
  | 'embeddings'
  | 'rag_corpus'
  | 'evaluation'
  | 'synthetic'
  | 'multimodal';

export interface DatasetListing {
  id: string;
  title: string;
  description: string;
  category: DatasetCategory;
  tags: string[];
  // Shelby blob references
  blobName: string;
  ownerAddress: string;
  sizeBytes: number;
  merkleRoot?: string;
  blobHash?: string;   // SHA-256 of full blob
  // Licensing
  licenseType: LicenseType;
  pricePerDownload: number;    // ShelbyUSD (0 if open)
  subscriptionMonthly: number;  // ShelbyUSD (0 if not subscription)
  // Stats
  totalDownloads: number;
  totalRevenue: number;
  rating: number;       // 0-5
  reviewCount: number;
  // Timestamps
  publishedAt: Date;
  updatedAt?: Date;
  // MCP agent access
  mcpEnabled: boolean;
  mcpSchema?: MCPDatasetSchema;
  mcpEndpoint?: string;
  // Preview
  sampleDescription?: string;
  sampleRows?: number;
  dataFormat?: string;  // 'jsonl', 'parquet', 'csv', 'hdf5', etc.
  // Trust
  isVerified: boolean;
}

export interface MCPDatasetSchema {
  name: string;
  description: string;
  version: string;
  endpoint: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, { type: string; description: string }>;
    required: string[];
  };
  outputSchema: {
    type: 'object';
    properties: Record<string, { type: string; description: string }>;
  };
}

export interface AccessProof {
  id: string;
  datasetId: string;
  datasetTitle: string;
  consumerAddress: string;
  licenseType: LicenseType;
  txHash: string;
  timestamp: Date;
  blobHash: string;
  merkleRoot?: string;
  amountPaid: number;
  expiresAt?: Date;    // For subscriptions
  isValid: boolean;
}

export interface PublishDatasetForm {
  // Step 1: File
  file: File | null;
  // Step 2: Metadata
  title: string;
  description: string;
  category: DatasetCategory;
  tags: string[];
  dataFormat: string;
  sampleDescription: string;
  sampleRows: number;
  // Step 3: License
  licenseType: LicenseType;
  pricePerDownload: number;
  subscriptionMonthly: number;
  // Step 4: MCP
  mcpEnabled: boolean;
  mcpEndpointPrefix: string;
}

export interface MarketplaceFilter {
  category?: DatasetCategory | 'all';
  licenseType?: LicenseType | 'all';
  search?: string;
  sortBy?: 'newest' | 'popular' | 'price_asc' | 'price_desc' | 'rating';
  mcpOnly?: boolean;
  verifiedOnly?: boolean;
  minSize?: number;
  maxPrice?: number;
}

export interface MarketplaceStats {
  totalListings: number;
  totalDownloads: number;
  totalRevenuePaid: number;
  mcpEnabledCount: number;
  verifiedCount: number;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

export const DATASET_CATEGORY_META: Record<DatasetCategory, { label: string; icon: string; color: string }> = {
  training_data:  { label: 'Training Data',  icon: '🧠', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  fine_tuning:    { label: 'Fine-Tuning',     icon: '🔧', color: 'text-violet-400 bg-violet-400/10 border-violet-400/20' },
  embeddings:     { label: 'Embeddings',      icon: '🔢', color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' },
  rag_corpus:     { label: 'RAG Corpus',      icon: '📚', color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  evaluation:     { label: 'Evaluation',      icon: '📊', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  synthetic:      { label: 'Synthetic',       icon: '✨', color: 'text-pink-400 bg-pink-400/10 border-pink-400/20' },
  multimodal:     { label: 'Multimodal',      icon: '🎯', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20' },
};

export const LICENSE_TYPE_META: Record<LicenseType, { label: string; icon: string; color: string; description: string }> = {
  open: {
    label: 'Open Access',
    icon: '🔓',
    color: 'text-green-400 bg-green-400/10 border-green-400/20',
    description: 'Free to download, no payment required',
  },
  pay_per_download: {
    label: 'Pay Per Download',
    icon: '💳',
    color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    description: 'One-time payment per download',
  },
  subscription: {
    label: 'Subscription',
    icon: '🔄',
    color: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    description: 'Monthly subscription for unlimited access',
  },
  enterprise: {
    label: 'Enterprise',
    icon: '🏢',
    color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    description: 'Custom enterprise licensing — contact owner',
  },
};

export const DATA_FORMAT_OPTIONS = ['jsonl', 'parquet', 'csv', 'hdf5', 'arrow', 'tfrecord', 'txt', 'zip', 'other'];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatPrice(price: number): string {
  if (price === 0) return 'Free';
  return `$${price.toFixed(2)} SUSD`;
}

export function shortenAddress(address: string, chars = 6): string {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-4)}`;
}

export function timeAgo(date: Date): string {
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
