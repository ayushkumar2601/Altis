import React from 'react';

interface MintSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  bondName: string;
  publicKey: string;
  txSignature: string;
  investedAmount: number;
  units: number;
  certificateId: string;
  receiptId?: string | null;
}

const MintSuccessModal: React.FC<MintSuccessModalProps> = ({
  isOpen,
  onClose,
  bondName,
  publicKey,
  txSignature,
  investedAmount,
  units,
  certificateId,
  receiptId
}) => {
  if (!isOpen) return null;

  const truncateAddress = (addr: string, len = 8) => `${addr.slice(0, len)}...${addr.slice(-len)}`;
  const explorerUrl = `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center backdrop-blur-xl p-4" style={{ backgroundColor: 'rgba(238, 249, 243, 0.95)' }}>
      <div className="border rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border-default)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(22, 163, 74, 0.1)' }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--state-success)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>Bond Minted Successfully</h2>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center transition-all" style={{ backgroundColor: 'var(--bg-accent-soft)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(199, 247, 10, 0.3)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-accent-soft)'}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-primary)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 flex flex-col lg:flex-row gap-8">
          {/* Certificate Image with Overlay Data */}
          <div className="flex-1 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border" style={{ borderColor: 'var(--border-default)' }}>
              <img 
                src="/cert.png" 
                alt="Bond Certificate" 
                className="w-full h-auto"
              />
              {/* Overlay text on certificate */}
              <div className="absolute bottom-[18%] left-[5%] text-[10px] sm:text-xs md:text-sm font-bold text-zinc-800 space-y-1 sm:space-y-2">
                <p><span className="font-black">{truncateAddress(publicKey, 6)}</span></p>
                <p><span className="font-black">{truncateAddress(txSignature, 6)}</span></p>
                <p><span className="font-black">{units.toFixed(2)}</span></p>
              </div>
            </div>
            <div className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg" style={{ backgroundColor: 'var(--state-success)', color: 'white' }}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              ON-CHAIN
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 space-y-6">
            {/* Wallet Connection */}
            <div className="rounded-2xl p-6 border" style={{ backgroundColor: 'var(--bg-accent-soft)', borderColor: 'var(--border-default)' }}>
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--state-success)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="text-xs font-black uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Wallet Connected</span>
              </div>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Your bond NFT has been minted to your wallet.</p>
              <div className="rounded-xl px-4 py-3 border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)' }}>
                <span className="font-mono text-xs break-all" style={{ color: 'var(--state-success)' }}>{publicKey}</span>
              </div>
            </div>

            {/* Blockchain Verification */}
            <div className="rounded-2xl p-6 border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)' }}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: 'var(--state-success)' }}></div>
                <span className="text-xs font-black uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Blockchain Verification</span>
              </div>
              
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Network</p>
                  <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Solana Devnet</p>
                </div>
                
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Transaction Signature</p>
                  <div className="rounded-xl px-4 py-3 flex items-center justify-between gap-2 border" style={{ backgroundColor: 'var(--bg-accent-soft)', borderColor: 'var(--border-default)' }}>
                    <p className="text-xs font-mono truncate" style={{ color: 'var(--text-secondary)' }}>{txSignature}</p>
                    <button 
                      onClick={() => navigator.clipboard.writeText(txSignature)}
                      className="transition-colors flex-shrink-0"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                      title="Copy"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Certificate ID</p>
                  <div className="rounded-xl px-4 py-3 border" style={{ backgroundColor: 'var(--bg-accent-soft)', borderColor: 'var(--border-default)' }}>
                    <p className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{certificateId}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bond Details */}
            <div className="rounded-2xl p-6 border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)' }}>
              <h4 className="text-xs font-black uppercase tracking-wider mb-5" style={{ color: 'var(--text-primary)' }}>Investment Details</h4>
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Bond</p>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{bondName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Units</p>
                  <p className="text-lg font-black" style={{ color: '#C7F70A' }}>{units.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Amount</p>
                  <p className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>₹{investedAmount.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <a 
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-4 rounded-full font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
                style={{ backgroundColor: 'var(--state-success)', color: 'white' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--state-success)'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View on Explorer
              </a>
              <button 
                onClick={onClose}
                className="px-8 py-4 rounded-full font-black uppercase tracking-widest text-sm transition-all border"
                style={{ backgroundColor: 'var(--bg-accent-soft)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(199, 247, 10, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-accent-soft)';
                }}
              >
                Close
              </button>
            </div>

            {/* Weil Chain Execution Receipt Notice */}
            {receiptId && (
              <div className="border rounded-2xl p-6" style={{ background: 'linear-gradient(to right, rgba(199, 247, 10, 0.1), rgba(37, 99, 235, 0.05))', borderColor: 'rgba(199, 247, 10, 0.2)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#C7F70A' }}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-primary)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-black uppercase mb-3" style={{ color: '#000000ff' }}>🔒 Execution Receipt Generated on Weil Chain</h4>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                      This transaction was verified through Weil Chain's tamper-proof execution receipt system before minting. All rules were validated and recorded immutably.
                    </p>
                    <button
                      onClick={() => {
                        // Navigate to receipt view
                        window.location.hash = `receipt/${receiptId}`;
                        onClose();
                      }}
                      className="inline-flex items-center gap-2 text-sm font-bold transition-colors"
                      style={{ color: '#000000ff' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#000000ff'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#000000ff'}
                    >
                      <span>View Execution Receipt</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintSuccessModal;
