import { useMarketplace } from '@/hooks/useMarketplace';
import type { PublishDatasetForm } from '@/types';
import { DATA_FORMAT_OPTIONS, DATASET_CATEGORY_META, LICENSE_TYPE_META } from '@/types';
import { Bot, CheckCircle2, ChevronRight, FileUp, Key, Lock, Tag, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function PublishDataset() {
  const navigate = useNavigate();
  const { publishDataset, isPublishing, publishProgress } = useMarketplace();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<PublishDatasetForm>({
    file: null,
    title: '',
    description: '',
    category: 'training_data',
    tags: [],
    dataFormat: 'jsonl',
    sampleDescription: '',
    sampleRows: 1000,
    licenseType: 'pay_per_download',
    pricePerDownload: 5.0,
    subscriptionMonthly: 0,
    mcpEnabled: true,
    mcpEndpointPrefix: '',
  });

  const [tagInput, setTagInput] = useState('');

  const next = () => setStep(s => Math.min(4, s + 1));
  const prev = () => setStep(s => Math.max(1, s - 1));

  const addTag = () => {
    if (tagInput && !form.tags.includes(tagInput.toLowerCase())) {
      setForm(f => ({ ...f, tags: [...f.tags, tagInput.toLowerCase()] }));
      setTagInput('');
    }
  };

  const submit = async () => {
    try {
      const listing = await publishDataset(form);
      navigate(`/dataset/${listing.id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to publish dataset. Ensure wallet is connected.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-3">Publish Dataset to ShelbyMarket</h1>
        <p className="text-muted-foreground">
          Upload data, construct Merkle commitments, and set on-chain access rules.
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-secondary -z-10 -translate-y-1/2" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-primary -z-10 -translate-y-1/2 transition-all duration-300" 
          style={{ width: `${((step - 1) / 3) * 100}%` }} 
        />
        {[
          { icon: FileUp, label: 'Upload' },
          { icon: Tag, label: 'Metadata' },
          { icon: Key, label: 'License' },
          { icon: Bot, label: 'MCP' }
        ].map((s, i) => {
          const num = i + 1;
          const active = step >= num;
          return (
            <div key={num} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                active ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-card border-border text-muted-foreground'
              }`}>
                {step > num ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
              </div>
              <span className={`text-[11px] font-medium ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Form Card */}
      <div className="glass-strong rounded-2xl p-6 sm:p-8 border-border/50 shadow-2xl">
        
        {/* Step 1: File */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-semibold mb-4 text-center">Select Dataset Blob</h2>
            <div className="border-2 border-dashed border-border/50 rounded-2xl p-8 hover:border-primary/50 transition-colors bg-secondary/20">
              <label className="flex flex-col items-center justify-center cursor-pointer h-full min-h-[200px]">
                <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
                <span className="text-sm font-medium mb-1">Click to browse or drag and drop</span>
                <span className="text-xs text-muted-foreground">Supported: CSV, JSONL, Parquet, HDF5, Arrow, TFRecord (Max 5GB on testnet)</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e: any) => setForm((f: any) => ({ ...f, file: e.target.files?.[0] || null }))}
                />
              </label>
            </div>
            {form.file && (
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between text-sm">
                <span className="font-medium text-primary break-all pr-4">{form.file.name}</span>
                <span className="text-primary/70 shrink-0 font-mono">{(form.file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            )}
            <button
              onClick={next}
              disabled={!form.file}
              className="btn-primary w-full py-3"
            >
              Continue <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}

        {/* Step 2: Metadata */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Dataset Title</label>
              <input type="text" className="input" value={form.title} onChange={(e: any) => setForm((f: any) => ({ ...f, title: e.target.value }))} placeholder="e.g. Finance News Sentiment 100K" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Category</label>
                <select className="input" value={form.category} onChange={(e: any) => setForm((f: any) => ({ ...f, category: e.target.value as any }))}>
                  {Object.entries(DATASET_CATEGORY_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Data Format</label>
                <select className="input" value={form.dataFormat} onChange={(e: any) => setForm((f: any) => ({ ...f, dataFormat: e.target.value }))}>
                  {DATA_FORMAT_OPTIONS.map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Description</label>
              <textarea className="textarea h-24" value={form.description} onChange={(e: any) => setForm((f: any) => ({ ...f, description: e.target.value }))} placeholder="Describe the dataset structure, origin, and intended use cases..." />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Schema / Sample Description</label>
              <textarea className="textarea h-20 font-mono text-xs" value={form.sampleDescription} onChange={(e: any) => setForm((f: any) => ({ ...f, sampleDescription: e.target.value }))} placeholder="e.g. {'text': '...', 'label': 1}" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Tags (Press Enter)</label>
              <div className="flex items-center gap-2">
                <input type="text" className="input" value={tagInput} onChange={(e: any) => setTagInput(e.target.value)} onKeyDown={(e: any) => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Add tag..." />
                <button type="button" onClick={addTag} className="btn-secondary h-11 px-4 text-xs font-semibold">Add</button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {form.tags.map(t => (
                  <span key={t} className="px-2 py-1 rounded bg-secondary text-xs flex items-center gap-1">
                    #{t} <XIcon className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => setForm((f: any) => ({ ...f, tags: f.tags.filter((x: any) => x !== t) }))} />
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border/30">
              <button onClick={prev} className="btn-outline flex-1">Back</button>
              <button onClick={next} disabled={!form.title || !form.description} className="btn-primary flex-1">Continue</button>
            </div>
          </div>
        )}

        {/* Step 3: License */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <label className="block text-sm font-medium mb-3">Select License Model</label>
              <div className="grid gap-3">
                {Object.entries(LICENSE_TYPE_META).map(([k, v]) => (
                  <button
                    key={k}
                    onClick={() => setForm((f: any) => ({ ...f, licenseType: k as any }))}
                    className={`flex items-start text-left gap-3 p-4 rounded-xl border transition-all ${
                      form.licenseType === k ? 'border-primary bg-primary/5 ring-1 ring-primary/50' : 'border-border/50 hover:border-border hover:bg-secondary/20'
                    }`}
                  >
                    <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${v.color}`}>
                      <span className="text-sm">{v.icon}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm mb-0.5">{v.label}</div>
                      <div className="text-[11px] text-muted-foreground leading-relaxed">{v.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {form.licenseType === 'pay_per_download' && (
              <div>
                <label className="block text-sm font-medium mb-1.5">Price Per Download (ShelbyUSD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <input type="number" min="0" step="0.1" className="input pl-8" value={form.pricePerDownload} onChange={(e: any) => setForm((f: any) => ({ ...f, pricePerDownload: parseFloat(e.target.value) || 0 }))} />
                </div>
              </div>
            )}

            {form.licenseType === 'subscription' && (
              <div>
                <label className="block text-sm font-medium mb-1.5">Monthly Subscription Price (ShelbyUSD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <input type="number" min="0" step="1" className="input pl-8" value={form.subscriptionMonthly} onChange={(e: any) => setForm((f: any) => ({ ...f, subscriptionMonthly: parseFloat(e.target.value) || 0 }))} />
                </div>
              </div>
            )}

            <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-400/10 border border-orange-400/20 text-orange-400/90 text-[11px] leading-relaxed">
              <Lock className="w-4 h-4 shrink-0 mt-0.5" />
              Payments are settled instantly via Aptos smart contracts. Royalties (if configured) are routed securely without intermediary custody.
            </div>

            <div className="flex gap-3 pt-4 border-t border-border/30">
              <button onClick={prev} className="btn-outline flex-1">Back</button>
              <button onClick={next} className="btn-primary flex-1">Continue</button>
            </div>
          </div>
        )}

        {/* Step 4: Review & MCP */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            
            <div className="p-4 rounded-xl border border-cyan-400/30 bg-cyan-400/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                  <Bot className="w-5 h-5" /> Enable Agent Access (MCP)
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={form.mcpEnabled} onChange={(e: any) => setForm((f: any) => ({ ...f, mcpEnabled: e.target.checked }))} />
                  <div className="w-9 h-5 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>
              <p className="text-xs text-muted-foreground/80 leading-relaxed mb-4">
                If enabled, a Model Context Protocol (MCP) skill schema will be automatically generated, allowing AI agents like Claude to autonomously purchase, verify, and stream data from this dataset into their context window.
              </p>
              {form.mcpEnabled && (
                <div>
                  <label className="block text-[11px] font-medium text-cyan-400/80 mb-1">Custom Endpoint Path (optional)</label>
                  <input type="text" className="input h-9 text-xs border-cyan-400/20 bg-card" placeholder={`e.g. ${form.file?.name.split('.')[0] || 'dataset-slug'}`} value={form.mcpEndpointPrefix} onChange={(e: any) => setForm((f: any) => ({ ...f, mcpEndpointPrefix: e.target.value }))} />
                </div>
              )}
            </div>

            <div className="glass rounded-xl p-4 border-border/50 text-sm">
              <h3 className="font-semibold mb-3 border-b border-border/50 pb-2">Listing Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-muted-foreground">Title</span> <span className="font-medium truncate ml-4">{form.title}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Blob Size</span> <span className="font-mono">{form.file ? (form.file.size/1024/1024).toFixed(2) + ' MB' : ''}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">License</span> <span className="font-medium text-primary">{LICENSE_TYPE_META[form.licenseType].label}</span></div>
                {form.licenseType === 'pay_per_download' && <div className="flex justify-between"><span className="text-muted-foreground">Price</span> <span className="font-mono font-medium">${form.pricePerDownload}</span></div>}
              </div>
            </div>

            {isPublishing && publishProgress ? (
              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-xs font-semibold text-primary">
                  <span>{publishProgress.step}</span>
                  <span>{publishProgress.pct}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-300" style={{ width: `${publishProgress.pct}%` }} />
                </div>
              </div>
            ) : (
              <div className="flex gap-3 pt-4 border-t border-border/30">
                <button onClick={prev} className="btn-outline flex-1" disabled={isPublishing}>Back</button>
                <button onClick={submit} disabled={isPublishing} className="btn-primary flex-[2] text-sm">
                  <UploadCloud className="w-4 h-4 mr-2" />
                  Sign Transaction & Publish
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Inline X icon
function XIcon(props: React.SVGProps<SVGSVGElement>) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>; }
