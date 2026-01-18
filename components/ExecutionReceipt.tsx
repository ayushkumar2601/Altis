import React, { useEffect, useState } from 'react';
import { getExecutionReceipt, ExecutionReceipt as ReceiptType } from '../lib/weilChain';

interface ExecutionReceiptProps {
  receiptId: string;
  onBack: () => void;
}

const ExecutionReceipt: React.FC<ExecutionReceiptProps> = ({ receiptId, onBack }) => {
  const [receipt, setReceipt] = useState<ReceiptType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReceipt();
  }, [receiptId]);

  const loadReceipt = async () => {
    setLoading(true);
    const data = await getExecutionReceipt(receiptId);
    setReceipt(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-page)' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'rgba(var(--color-1-rgb), 0.2)', borderTopColor: '#C7F70A' }}></div>
          <p className="font-bold uppercase tracking-widest text-sm" style={{ color: 'var(--text-muted)' }}>Loading Receipt...</p>
        </div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: 'var(--bg-page)' }}>
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(var(--color-12-rgb), 0.1)' }}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--state-error)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-black uppercase mb-4" style={{ color: 'var(--text-primary)' }}>Receipt Not Found</h2>
          <p className="mb-8" style={{ color: 'var(--text-muted)' }}>The execution receipt could not be located.</p>
          <button
            onClick={() => {
              window.location.hash = '';
              onBack();
            }}
            className="px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all"
            style={{ backgroundColor: 'var(--bg-accent-soft)', color: 'var(--text-primary)' }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const truncate = (str: string, len = 16) => 
    `${str.slice(0, len)}...${str.slice(-len)}`;

  const statusColor = receipt.execution_status === 'VERIFIED' 
    ? 'text-green-500 bg-green-500/10 border-green-500/20'
    : 'text-red-500 bg-red-500/10 border-red-500/20';

  return (
    <div className="min-h-screen pt-32 pb-20 px-6" style={{ backgroundColor: 'var(--bg-page)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => {
              window.location.hash = '';
              onBack();
            }}
            className="flex items-center gap-2 transition-colors mb-6 font-bold uppercase tracking-widest text-sm"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C7F70A' }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter" style={{ color: 'var(--text-primary)' }}>Execution Receipt</h1>
              <p className="font-bold uppercase tracking-widest text-sm" style={{ color: 'var(--text-muted)' }}>Weil Chain-Verified Workflow</p>
            </div>
          </div>
        </div>

        {/* Receipt Summary */}
        <div className="border rounded-3xl p-8 mb-8" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)' }}>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Status</div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-black uppercase tracking-widest text-sm ${statusColor}`}>
                {receipt.execution_status === 'VERIFIED' && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {receipt.execution_status}
              </div>
            </div>
            
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Action</div>
              <div className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>Bond Minting</div>
            </div>

            <div>
              <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Bond Name</div>
              <div className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>{receipt.bond_name}</div>
            </div>

            <div>
              <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Wallet</div>
              <div className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>{truncate(receipt.wallet_address, 8)}</div>
            </div>

            <div>
              <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Timestamp</div>
              <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{new Date(receipt.created_at).toLocaleString()}</div>
            </div>

            <div>
              <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Investment</div>
              <div className="text-xl font-black" style={{ color: '#C7F70A' }}>₹{receipt.invested_amount.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>

        {/* Rules Verified */}
        <div className="border rounded-3xl p-8 mb-8" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)' }}>
          <h2 className="text-2xl font-black uppercase mb-6" style={{ color: 'var(--text-primary)' }}>Rules Verified</h2>
          <div className="space-y-4">
            {Object.entries(receipt.rules_verified).map(([rule, passed]) => (
              <div key={rule} className="flex items-center gap-4">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  passed ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                }`}>
                  {passed ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                  {rule.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>

          {receipt.verification_errors && receipt.verification_errors.length > 0 && (
            <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
              <h3 className="text-sm font-black uppercase text-red-500 mb-3">Verification Errors</h3>
              <ul className="space-y-2">
                {receipt.verification_errors.map((error, idx) => (
                  <li key={idx} className="text-sm" style={{ color: 'var(--text-secondary)' }}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Linked Artifacts */}
        <div className="border rounded-3xl p-8 mb-8" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)' }}>
          <h2 className="text-2xl font-black uppercase mb-6" style={{ color: 'var(--text-primary)' }}>Linked Artifacts</h2>
          <div className="space-y-6">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Receipt ID</div>
              <div className="rounded-xl px-4 py-3 font-mono text-sm break-all" style={{ backgroundColor: 'var(--bg-accent-soft)', color: 'var(--text-secondary)' }}>
                {receipt.receipt_id}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Receipt Hash</div>
              <div className="rounded-xl px-4 py-3 font-mono text-sm break-all" style={{ backgroundColor: 'var(--bg-accent-soft)', color: 'var(--text-secondary)' }}>
                {receipt.receipt_hash}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Weil Chain Block</div>
              <div className="rounded-xl px-4 py-3 font-mono text-sm" style={{ backgroundColor: 'var(--bg-accent-soft)', color: 'var(--text-secondary)' }}>
                {receipt.weil_chain_block}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Weil Chain Network</div>
              <div className="rounded-xl px-4 py-3 font-mono text-sm" style={{ backgroundColor: 'var(--bg-accent-soft)', color: 'var(--text-secondary)' }}>
                {receipt.weil_chain_network}
              </div>
            </div>

            {receipt.solana_tx_hash && (
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Solana Transaction</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 rounded-xl px-4 py-3 font-mono text-sm break-all" style={{ backgroundColor: 'var(--bg-accent-soft)', color: 'var(--state-success)' }}>
                    {receipt.solana_tx_hash}
                  </div>
                  <a
                    href={`https://explorer.solana.com/tx/${receipt.solana_tx_hash}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                    style={{ backgroundColor: 'rgba(22, 163, 74, 0.2)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(22, 163, 74, 0.3)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(22, 163, 74, 0.2)'}
                  >
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Integrity Statement */}
        <div className="border rounded-3xl p-8" style={{ background: 'linear-gradient(to bottom right, rgba(199, 247, 10, 0.1), rgba(37, 99, 235, 0.05))', borderColor: 'rgba(199, 247, 10, 0.2)' }}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#C7F70A' }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-black uppercase mb-4" style={{ color: 'var(--text-primary)' }}>Integrity Statement</h3>
              <p className="leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                This receipt proves that the bond minting workflow was executed on <span className="font-bold" style={{ color: '#000000ff' }}>Weil Chain</span> according to predefined rules before the Solana blockchain transaction was finalized.
              </p>
              <p className="leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                The execution was verified by <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{receipt.weil_chain_executor}</span> and recorded immutably on block <span className="font-mono" style={{ color: '#4a5c00ff' }}>{receipt.weil_chain_block}</span>.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                This tamper-proof receipt provides an audit-ready trail for regulatory compliance and enterprise-grade verification of the minting process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionReceipt;
