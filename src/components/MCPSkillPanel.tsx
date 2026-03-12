import type { DatasetListing } from '@/types';
import { motion } from 'framer-motion';
import { Bot, CheckCircle2, Copy } from 'lucide-react';
import { useState } from 'react';

interface MCPSkillPanelProps {
  dataset: DatasetListing;
}

export function MCPSkillPanel({ dataset }: MCPSkillPanelProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = async (key: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Build MCP config for agents (Claude Desktop, Cursor, etc.)
  const mcpConfig = {
    mcpServers: {
      [`shelby-${dataset.id}`]: {
        command: 'npx',
        args: ['@shelby-protocol/mcp-server'],
        env: {
          SHELBY_DATASET_ID: dataset.id,
          SHELBY_ENDPOINT: dataset.mcpEndpoint || `https://api.testnet.shelby.xyz/shelby/mcp/${dataset.id}`,
          SHELBY_NETWORK: 'testnet',
        },
      },
    },
  };

  const mcpConfigStr = JSON.stringify(mcpConfig, null, 2);

  // Build skill schema
  const skillSchema = {
    name: `fetch_${dataset.id.replace('-', '_')}`,
    description: `Fetch rows from: ${dataset.title}`,
    parameters: {
      type: 'object',
      properties: {
        offset: { type: 'number', description: 'Starting row index (default: 0)' },
        limit:  { type: 'number', description: 'Rows to return, max 1000 (default: 100)' },
        columns: { type: 'array', items: { type: 'string' }, description: 'Columns to include (default: all)' },
      },
      required: [],
    },
  };

  const skillSchemaStr = JSON.stringify(skillSchema, null, 2);

  const curlExample = `curl -X POST ${dataset.mcpEndpoint || `https://api.testnet.shelby.xyz/shelby/mcp/${dataset.id}`} \\
  -H "Content-Type: application/json" \\
  -H "X-Shelby-Proof: <your_access_proof_id>" \\
  -d '{"offset": 0, "limit": 100}'`;

  const sections = [
    { key: 'mcp-config', label: 'MCP Server Config (claude_desktop_config.json)', value: mcpConfigStr, lang: 'json' },
    { key: 'skill', label: 'Skill Schema', value: skillSchemaStr, lang: 'json' },
    { key: 'curl', label: 'cURL Example', value: curlExample, lang: 'bash' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5 border border-cyan-400/20"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-cyan-400/10 flex items-center justify-center">
          <Bot className="w-4.5 h-4.5 text-cyan-400" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">MCP Agent Access</h3>
          <p className="text-xs text-muted-foreground">Let AI agents discover & fetch this dataset autonomously</p>
        </div>
        <span className="ml-auto badge badge-cyan text-[10px]">Early Access</span>
      </div>

      {/* Endpoint */}
      <div className="mb-4 p-3 rounded-xl bg-secondary/30 border border-border/40">
        <div className="text-[11px] text-muted-foreground mb-1">Endpoint</div>
        <div className="font-mono text-xs text-cyan-400 break-all">
          {dataset.mcpEndpoint || `https://api.testnet.shelby.xyz/shelby/mcp/${dataset.id}`}
        </div>
      </div>

      {/* Code sections */}
      <div className="space-y-3">
        {sections.map(({ key, label, value, lang }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-muted-foreground font-medium">{label}</span>
              <button
                onClick={() => copy(key, value)}
                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                {copiedKey === key
                  ? <><CheckCircle2 className="w-3 h-3 text-green-400" /> Copied</>
                  : <><Copy className="w-3 h-3" /> Copy</>}
              </button>
            </div>
            <pre className="code-block text-[11px] overflow-x-auto max-h-48 overflow-y-auto leading-relaxed">
              <code>{value}</code>
            </pre>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-muted-foreground/60 mt-4 leading-relaxed">
        Requires a valid <strong>Access Proof</strong> in the <code className="font-mono">X-Shelby-Proof</code> header.
        Proofs are issued on every purchase and cryptographically tied to your wallet address and the dataset's Merkle root.
      </p>
    </motion.div>
  );
}
