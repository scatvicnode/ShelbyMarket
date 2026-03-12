// ShelbyMarket — Core SDK Client
// Connects to Shelby Protocol Testnet for blob storage + marketplace coordination

import type {
  AccessProof,
  DatasetListing,
  LicenseType,
  MarketplaceFilter,
  MarketplaceStats,
  MCPDatasetSchema,
  PublishDatasetForm,
  ShelbyAccount,
} from '@/types';

import { AccountAddress, Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { Buffer } from 'buffer';

if (typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = Buffer;
}

// ─── SHELBY TESTNET CONFIG ─────────────────────────────────────────────────
export const SHELBY_CONFIG = {
  network: 'testnet',
  rpcEndpoint: 'https://api.testnet.shelby.xyz/shelby',
  blobApiBase: 'https://api.testnet.shelby.xyz/shelby/v1/blobs',
  aptosFullnode: 'https://api.testnet.aptoslabs.com/v1',
  aptosIndexer:  'https://api.testnet.aptoslabs.com/nocode/v1/public/alias/shelby/testnet/v1/graphql',
  explorerUrl:   'https://explorer.shelby.xyz',
  faucetUrl:     'https://faucet.testnet.aptoslabs.com',
} as const;

// ─── STORAGE KEYS ──────────────────────────────────────────────────────────
const STORE = {
  listings:     'shelbymarket_listings',
  proofs:       'shelbymarket_proofs',
  myPurchases:  'shelbymarket_purchases',
} as const;

// ─── LAZY SDK LOADERS ──────────────────────────────────────────────────────
let _sdk: any = null;
let _shelbyClient: any = null;
let _aptosClient: Aptos | null = null;

async function getSDK() {
  if (!_sdk) _sdk = await import('@shelby-protocol/sdk/browser');
  return _sdk;
}

async function getShelbyClient(apiKey?: string) {
  if (!_shelbyClient) {
    const sdk = await getSDK();
    _shelbyClient = new sdk.ShelbyClient({
      network: 'local', // We bypass the built-in string check by using 'local'
      aptos: new AptosConfig({
        network: Network.TESTNET,
        fullnode: SHELBY_CONFIG.aptosFullnode,
        indexer: 'https://api.testnet.aptoslabs.com/nocode/v1/public/alias/shelby/testnet/v1/graphql',
        ...(apiKey && { clientConfig: { API_KEY: apiKey } }),
      }),
      indexer: { baseUrl: SHELBY_CONFIG.aptosIndexer },
      rpc: { baseUrl: SHELBY_CONFIG.rpcEndpoint },
      deployer: AccountAddress.fromString('0x85fdb9a176ab8ef1d9d9c1b60d60b3924f0800ac1de1cc2085fb0b8bb4988e6a'),
      ...(apiKey && { apiKey }),
    });
  }
  return _shelbyClient;
}

function getAptosClient(apiKey?: string): Aptos {
  if (!_aptosClient) {
    _aptosClient = new Aptos(
      new AptosConfig({
        network: Network.CUSTOM,
        fullnode: SHELBY_CONFIG.aptosFullnode,
        indexer: 'https://api.testnet.aptoslabs.com/nocode/v1/public/alias/shelby/testnet/v1/graphql',
        ...(apiKey && { clientConfig: { API_KEY: apiKey } }),
      })
    );
  }
  return _aptosClient;
}

// ─── SEED DATA ────────────────────────────────────────────────────────────
const SEED_LISTINGS: DatasetListing[] = [
  {
    id: 'ds-001',
    title: 'OpenChat 3.5 Fine-Tuning Dataset',
    description: 'Curated high-quality instruction-following dialogues for LLM fine-tuning. 100K samples across 20 domains with human-verified quality scores. Ideal for chat model training.',
    category: 'fine_tuning',
    tags: ['chat', 'instruction', 'llm', 'openai-format', 'multilingual'],
    blobName: 'openchat-ft-v3.5.jsonl',
    ownerAddress: '0xdemo1a2b3c4d5e6f',
    sizeBytes: 2_400_000_000,
    merkleRoot: '0xabc123def456',
    blobHash: 'sha256:e3b0c44298fc1c149afb',
    licenseType: 'pay_per_download',
    pricePerDownload: 12.50,
    subscriptionMonthly: 0,
    totalDownloads: 1_240,
    totalRevenue: 15_500,
    rating: 4.8,
    reviewCount: 87,
    publishedAt: new Date('2025-11-15'),
    mcpEnabled: true,
    mcpEndpoint: 'https://api.testnet.shelby.xyz/shelby/mcp/ds-001',
    sampleDescription: 'Multi-turn chat completions in OpenAI format with system, user, and assistant turns.',
    sampleRows: 100_000,
    dataFormat: 'jsonl',
    isVerified: true,
  },
  {
    id: 'ds-002',
    title: 'Aptos DeFi On-Chain Event Embeddings',
    description: 'Pre-computed 1536-dim OpenAI text-embedding-3-large vectors for 500K Aptos DeFi events. Ready for RAG pipelines and semantic search over on-chain activity.',
    category: 'embeddings',
    tags: ['aptos', 'defi', 'embeddings', 'openai', 'semantic-search'],
    blobName: 'aptos-defi-emb-v1.parquet',
    ownerAddress: '0xdemo2a2b3c4d5e6f',
    sizeBytes: 8_500_000_000,
    licenseType: 'subscription',
    pricePerDownload: 0,
    subscriptionMonthly: 49.00,
    totalDownloads: 380,
    totalRevenue: 18_620,
    rating: 4.6,
    reviewCount: 42,
    publishedAt: new Date('2025-12-01'),
    mcpEnabled: true,
    sampleDescription: 'Parquet columns: event_id, tx_hash, vector (float32[1536]), metadata_json',
    sampleRows: 500_000,
    dataFormat: 'parquet',
    isVerified: true,
  },
  {
    id: 'ds-003',
    title: 'Billion-Scale Web Crawl Training Corpus',
    description: 'Cleaned, deduplicated 1.2B token multilingual web text corpus. Processed with fastText language ID, perplexity filtering, and PII redaction. Perfect for pre-training.',
    category: 'training_data',
    tags: ['pretraining', 'multilingual', 'web-crawl', 'text', 'cleaned'],
    blobName: 'webcrawl-1B-v2.arrow',
    ownerAddress: '0xdemo3a2b3c4d5e6f',
    sizeBytes: 45_000_000_000,
    licenseType: 'enterprise',
    pricePerDownload: 0,
    subscriptionMonthly: 0,
    totalDownloads: 120,
    totalRevenue: 60_000,
    rating: 4.9,
    reviewCount: 22,
    publishedAt: new Date('2025-10-10'),
    mcpEnabled: false,
    sampleDescription: 'Apache Arrow format. Fields: text, lang, url, quality_score, timestamp',
    sampleRows: 1_200_000_000,
    dataFormat: 'arrow',
    isVerified: true,
  },
  {
    id: 'ds-004',
    title: 'RAG Eval Benchmark — Legal Domain',
    description: 'Evaluation suite for RAG systems in the legal domain. 10K questions with gold citations from 50K legal documents. Includes relevance and faithfulness metrics.',
    category: 'rag_corpus',
    tags: ['rag', 'evaluation', 'legal', 'qa', 'benchmark'],
    blobName: 'rag-legal-eval-v1.zip',
    ownerAddress: '0xdemo4a2b3c4d5e6f',
    sizeBytes: 560_000_000,
    licenseType: 'open',
    pricePerDownload: 0,
    subscriptionMonthly: 0,
    totalDownloads: 4_200,
    totalRevenue: 0,
    rating: 4.7,
    reviewCount: 156,
    publishedAt: new Date('2025-09-20'),
    mcpEnabled: true,
    sampleDescription: 'ZIP of JSONL QA pairs + document store in Parquet format.',
    sampleRows: 10_000,
    dataFormat: 'zip',
    isVerified: true,
  },
  {
    id: 'ds-005',
    title: 'Synthetic Code Reasoning Dataset (Python)',
    description: '500K synthetic Python code problems generated via LLM self-play with chain-of-thought reasoning. RLHF-ready with preference pairs for code improvement tasks.',
    category: 'synthetic',
    tags: ['code', 'python', 'synthetic', 'reasoning', 'rlhf', 'chain-of-thought'],
    blobName: 'synth-code-python-500k.jsonl',
    ownerAddress: '0xdemo5a2b3c4d5e6f',
    sizeBytes: 1_900_000_000,
    licenseType: 'pay_per_download',
    pricePerDownload: 8.00,
    subscriptionMonthly: 0,
    totalDownloads: 890,
    totalRevenue: 7_120,
    rating: 4.5,
    reviewCount: 64,
    publishedAt: new Date('2025-12-15'),
    mcpEnabled: true,
    sampleDescription: 'JSONL with: problem, chain_of_thought, solution, chosen (preferred), rejected',
    sampleRows: 500_000,
    dataFormat: 'jsonl',
    isVerified: false,
  },
  {
    id: 'ds-006',
    title: 'Vision-Language Instruction Dataset (Multimodal)',
    description: '200K image-text instruction pairs across diverse real-world tasks. Images sourced from CC-BY licensed datasets. Compatible with LLaVA and Idefics fine-tuning scripts.',
    category: 'multimodal',
    tags: ['vision', 'multimodal', 'instruction', 'llava', 'image-text'],
    blobName: 'vl-instruct-200k.hdf5',
    ownerAddress: '0xdemo6a2b3c4d5e6f',
    sizeBytes: 12_000_000_000,
    licenseType: 'subscription',
    pricePerDownload: 0,
    subscriptionMonthly: 79.00,
    totalDownloads: 560,
    totalRevenue: 44_240,
    rating: 4.7,
    reviewCount: 48,
    publishedAt: new Date('2025-11-28'),
    mcpEnabled: true,
    sampleDescription: 'HDF5 with image tensors + instruction/response text pairs',
    sampleRows: 200_000,
    dataFormat: 'hdf5',
    isVerified: true,
  },
];

// ─── MAIN MARKETPLACE CLIENT ────────────────────────────────────────────────
class MarketplaceClient {
  private walletAddress: string | null = null;
  private _signTx: ((payload: any) => Promise<{ hash: string }>) | null = null;
  private account: ShelbyAccount | null = null;
  private listings: DatasetListing[] = [];
  private proofs: AccessProof[] = [];
  private apiKey?: string;

  constructor() {
    this.loadFromStorage();
    if (this.listings.length === 0) {
      this.listings = SEED_LISTINGS;
      this.saveListings();
    }
  }

  // ── Config ───
  setSignAndSubmitTransaction(fn: (payload: any) => Promise<{ hash: string }>) {
    this._signTx = fn;
  }

  // ── Storage ──
  private loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORE.listings);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.listings = parsed.map((l: any) => ({
          ...l,
          publishedAt: new Date(l.publishedAt),
          updatedAt: l.updatedAt ? new Date(l.updatedAt) : undefined,
        }));
      }
      const rawProofs = localStorage.getItem(STORE.proofs);
      if (rawProofs) {
        this.proofs = JSON.parse(rawProofs).map((p: any) => ({
          ...p,
          timestamp: new Date(p.timestamp),
          expiresAt: p.expiresAt ? new Date(p.expiresAt) : undefined,
        }));
      }
    } catch {
      this.listings = SEED_LISTINGS;
    }
  }

  private saveListings() {
    localStorage.setItem(STORE.listings, JSON.stringify(this.listings));
  }

  private saveProofs() {
    localStorage.setItem(STORE.proofs, JSON.stringify(this.proofs));
  }

  // ── Wallet ───
  async setWallet(address: string, apiKey?: string) {
    this.walletAddress = address;
    this.apiKey = apiKey;
    try {
      let apt = 0;
      const resp = await fetch(`${SHELBY_CONFIG.aptosFullnode}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          function: '0x1::coin::balance',
          type_arguments: ['0x1::aptos_coin::AptosCoin'],
          arguments: [address],
        }),
      });
      if (resp.ok) {
        const [val] = await resp.json();
        apt = Number(val) / 1e8;
      }
      this.account = { address, balance: { apt, shelbyUsd: 500 }, storageUsed: 0, storageLimit: 10 * 1024 ** 3 };
    } catch {
      this.account = { address, balance: { apt: 0, shelbyUsd: 500 }, storageUsed: 0, storageLimit: 10 * 1024 ** 3 };
    }
  }

  getAccount() { return this.account; }

  // ── Marketplace ───

  listDatasets(filter?: MarketplaceFilter): DatasetListing[] {
    let result = [...this.listings];

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (filter?.category && filter.category !== 'all') {
      result = result.filter(d => d.category === filter.category);
    }
    if (filter?.licenseType && filter.licenseType !== 'all') {
      result = result.filter(d => d.licenseType === filter.licenseType);
    }
    if (filter?.mcpOnly) {
      result = result.filter(d => d.mcpEnabled);
    }
    if (filter?.verifiedOnly) {
      result = result.filter(d => d.isVerified);
    }
    if (filter?.maxPrice !== undefined) {
      result = result.filter(d => d.pricePerDownload <= (filter.maxPrice ?? Infinity));
    }

    switch (filter?.sortBy) {
      case 'popular':     result.sort((a, b) => b.totalDownloads - a.totalDownloads); break;
      case 'price_asc':   result.sort((a, b) => a.pricePerDownload - b.pricePerDownload); break;
      case 'price_desc':  result.sort((a, b) => b.pricePerDownload - a.pricePerDownload); break;
      case 'rating':      result.sort((a, b) => b.rating - a.rating); break;
      default:            result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }

    return result;
  }

  getDatasetById(id: string): DatasetListing | undefined {
    return this.listings.find(d => d.id === id);
  }

  getMyListings(): DatasetListing[] {
    if (!this.walletAddress) return [];
    return this.listings.filter(d => d.ownerAddress === this.walletAddress);
  }

  getMyProofs(): AccessProof[] {
    return this.proofs;
  }

  getStats(): MarketplaceStats {
    return {
      totalListings: this.listings.length,
      totalDownloads: this.listings.reduce((s, d) => s + d.totalDownloads, 0),
      totalRevenuePaid: this.listings.reduce((s, d) => s + d.totalRevenue, 0),
      mcpEnabledCount: this.listings.filter(d => d.mcpEnabled).length,
      verifiedCount: this.listings.filter(d => d.isVerified).length,
    };
  }

  // ── Publish ───────────────────────────────────────────────────────────────
  async publishDataset(
    form: PublishDatasetForm,
    onProgress?: (pct: number, step: string) => void
  ): Promise<DatasetListing> {
    if (!this.walletAddress || !this._signTx || !form.file) {
      throw new Error('Wallet not connected or no file selected');
    }

    onProgress?.(5, 'Encoding blob for Shelby network...');

    const sdk = await getSDK();
    const client = await getShelbyClient(this.apiKey);
    const aptos = getAptosClient(this.apiKey);

    const data = Buffer.from(await form.file.arrayBuffer());
    const provider = await sdk.createDefaultErasureCodingProvider();
    const commitments = await sdk.generateCommitments(provider, data);
    onProgress?.(20, 'Computing Merkle commitments...');

    // Sanitize blob name
    const ts = Date.now();
    const ext = form.file.name.lastIndexOf('.') > 0 ? form.file.name.slice(form.file.name.lastIndexOf('.')) : '';
    const base = form.file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40);
    const blobName = `${base}_${ts}${ext}`;

    // On-chain registration
    const expirationMicros = (Date.now() + 365 * 24 * 3600 * 1000) * 1000;

    // Parse hex merkle root into byte array to bypass MoveVector.U8() JSON null bug in Petra
    let hexStr = commitments.blob_merkle_root as string;
    if (hexStr.startsWith('0x')) hexStr = hexStr.slice(2);
    
    const merkleBytes = new Uint8Array(hexStr.length / 2);
    for (let i = 0; i < hexStr.length; i += 2) {
      merkleBytes[i / 2] = parseInt(hexStr.substring(i, i + 2), 16);
    }
    const parsedMerkleArray = Array.from(merkleBytes);

    // Manual payload construction to fix Type mismatch error in Petra
    const payload = {
      function: `0x85fdb9a176ab8ef1d9d9c1b60d60b3924f0800ac1de1cc2085fb0b8bb4988e6a::blob_metadata::register_blob` as `${string}::${string}::${string}`,
      functionArguments: [
        blobName,                                      // arg 0: blob_name (string)
        expirationMicros,                              // arg 1: expiration_micros (u64)
        parsedMerkleArray,                             // arg 2: blob_merkle_root (vector<u8>)
        sdk.expectedTotalChunksets(form.file.size),    // arg 3: num_chunksets (u64)
        form.file.size,                                // arg 4: blob_size (u64)
        0,                                             // arg 5: payment_tier
        0,                                             // arg 6: encoding
      ],
    };
    onProgress?.(35, 'Signing & submitting Aptos transaction...');

    const tx = await this._signTx({
      data: payload,
      options: { maxGasAmount: 500000 }
    });
    await aptos.waitForTransaction({ transactionHash: tx.hash });
    onProgress?.(60, 'Transaction confirmed. Uploading to Shelby nodes...');

    await client.rpc.putBlob({
      account: AccountAddress.fromString(this.walletAddress),
      blobName,
      blobData: new Uint8Array(await form.file.arrayBuffer()),
    });
    onProgress?.(85, 'Building marketplace listing...');

    // Build MCP schema
    const mcpSchema: MCPDatasetSchema | undefined = form.mcpEnabled ? {
      name: form.title.replace(/\s+/g, '-').toLowerCase(),
      description: form.description,
      version: '1.0.0',
      endpoint: `${SHELBY_CONFIG.rpcEndpoint}/mcp/${form.mcpEndpointPrefix || blobName}`,
      inputSchema: {
        type: 'object',
        properties: {
          offset: { type: 'number', description: 'Row offset to start reading from' },
          limit: { type: 'number', description: 'Number of rows to return (max 1000)' },
          format: { type: 'string', description: `Response format: ${form.dataFormat}` },
        },
        required: [],
      },
      outputSchema: {
        type: 'object',
        properties: {
          rows: { type: 'array', description: 'Dataset rows' },
          total: { type: 'number', description: 'Total row count' },
          proof: { type: 'string', description: 'Cryptographic access proof hash' },
        },
      },
    } : undefined;

    const listing: DatasetListing = {
      id: `ds-${crypto.randomUUID().slice(0, 8)}`,
      title: form.title,
      description: form.description,
      category: form.category,
      tags: form.tags,
      blobName,
      ownerAddress: this.walletAddress,
      sizeBytes: form.file.size,
      merkleRoot: Array.from<number>(commitments.blob_merkle_root).map((b: number) => b.toString(16).padStart(2, '0')).join(''),
      licenseType: form.licenseType,
      pricePerDownload: form.pricePerDownload,
      subscriptionMonthly: form.subscriptionMonthly,
      totalDownloads: 0,
      totalRevenue: 0,
      rating: 0,
      reviewCount: 0,
      publishedAt: new Date(),
      mcpEnabled: form.mcpEnabled,
      mcpSchema,
      mcpEndpoint: form.mcpEnabled ? `${SHELBY_CONFIG.rpcEndpoint}/mcp/${form.mcpEndpointPrefix || blobName}` : undefined,
      sampleDescription: form.sampleDescription,
      sampleRows: form.sampleRows,
      dataFormat: form.dataFormat,
      isVerified: false,
    };

    this.listings.unshift(listing);
    this.saveListings();
    onProgress?.(100, 'Published successfully!');

    return listing;
  }

  // ── Purchase ───────────────────────────────────────────────────────────────
  async purchaseAccess(datasetId: string): Promise<AccessProof> {
    if (!this.walletAddress) throw new Error('Wallet not connected');
    const dataset = this.getDatasetById(datasetId);
    if (!dataset) throw new Error('Dataset not found');

    // Simulate Aptos payment transaction (in production: real Move module call)
    const fakeTxHash = `0x${Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join('')}`;

    // Generate cryptographic proof
    const blobHash = await this.hashBlob(dataset.blobName + dataset.ownerAddress);

    const proof: AccessProof = {
      id: crypto.randomUUID(),
      datasetId,
      datasetTitle: dataset.title,
      consumerAddress: this.walletAddress,
      licenseType: dataset.licenseType as LicenseType,
      txHash: fakeTxHash,
      timestamp: new Date(),
      blobHash,
      merkleRoot: dataset.merkleRoot,
      amountPaid: dataset.pricePerDownload || dataset.subscriptionMonthly,
      expiresAt: dataset.licenseType === 'subscription' ? new Date(Date.now() + 30 * 24 * 3600 * 1000) : undefined,
      isValid: true,
    };

    // Update listing stats
    dataset.totalDownloads += 1;
    dataset.totalRevenue += proof.amountPaid;
    this.saveListings();

    this.proofs.push(proof);
    this.saveProofs();

    return proof;
  }

  private async hashBlob(input: string): Promise<string> {
    const enc = new TextEncoder().encode(input + Date.now());
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return 'sha256:' + Array.from<number>(new Uint8Array(buf)).map((b: number) => b.toString(16).padStart(2, '0')).join('');
  }

  getBlobUrl(dataset: DatasetListing): string {
    return `${SHELBY_CONFIG.blobApiBase}/${dataset.ownerAddress}/${dataset.blobName}`;
  }
}

export const marketplaceClient = new MarketplaceClient();
