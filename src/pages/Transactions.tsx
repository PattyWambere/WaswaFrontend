import React, { useEffect, useState } from "react";
import api from "../api/api";
import { AppConfig } from "../types";
import QRCode from "react-qr-code";
import {
  Copy,
  Check,
  Info,
  Loader2,
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Lock,
} from "lucide-react";

export const Deposit: React.FC = () => {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [amount, setAmount] = useState("");

  const [step, setStep] = useState(1); // 1: Form, 2: Instructions + Proof
  const [copied, setCopied] = useState(false);
  const [proofTxHash, setProofTxHash] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofSubmitting, setProofSubmitting] = useState(false);
  const [proofSubmitted, setProofSubmitted] = useState(false);

  useEffect(() => {
    console.log("Fetching user config...");
    api
      .get("/user/config")
      .then((res) => {
        console.log("User Config Loaded:", {
          assets: res.data.assets?.length,
          networks: res.data.networks?.length,
          wallets: res.data.walletSettings?.length,
        });
        setConfig(res.data);
      })
      .catch((err) => {
        console.error("Failed to load user config:", err);
      });
  }, []);

  if (!config) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-slate-400">Syncing with blockchain config...</p>
      </div>
    );
  }

  const walletSetting = config.walletSettings.find(
    (s) => s.asset === selectedAsset && s.network === selectedNetwork,
  );

  const copyToClipboard = () => {
    if (walletSetting) {
      navigator.clipboard.writeText(walletSetting.centralWallet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  if (step === 2 && walletSetting) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-gradient-to-br from-success/20 to-success/5 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <BadgeCheck className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
            Deposit Intent Stored
          </h2>
          <p className="text-slate-400 text-lg">
            Please complete the payment to the address below
          </p>
        </div>

        <div className="card space-y-8 p-8 relative overflow-hidden group border-slate-700/50 hover:border-primary/30 transition-all duration-700 shadow-2xl">
          {/* Subtle animated background glow */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 blur-[100px] rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-1000 pointer-events-none"></div>

          <div className="flex flex-col items-center justify-center space-y-6 relative z-10">
            {/* Premium QR Code Frame */}
            <div className="p-1 rounded-2xl bg-gradient-to-br from-primary/40 via-slate-800 to-primary/10 shadow-[0_0_40px_rgba(59,130,246,0.15)] group-hover:shadow-[0_0_50px_rgba(59,130,246,0.25)] transition-all duration-500">
              <div className="bg-white p-5 rounded-xl">
                <QRCode value={walletSetting.centralWallet} size={200} />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-400 font-medium mb-1 uppercase tracking-widest">
                Selected Network
              </p>
              <p className="text-xl font-bold text-primary">
                {walletSetting.network}
              </p>
            </div>
          </div>

          <div className="space-y-6 relative z-10">
            <div>
              <label className="label uppercase tracking-widest text-xs font-bold text-slate-500">Deposit Address</label>
              <div className="p-1 rounded-xl bg-gradient-to-r from-slate-800 to-slate-800/50 hover:from-primary/20 hover:to-slate-800 transition-all duration-300">
                <div className="p-4 bg-dark/90 backdrop-blur-sm rounded-lg flex items-center justify-between gap-3 overflow-hidden">
                  <p className="text-sm md:text-base font-mono text-white truncate drop-shadow-md">
                    {walletSetting.centralWallet}
                  </p>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800 hover:bg-primary/20 text-slate-400 hover:text-primary transition-all shrink-0"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-success animate-in zoom-in" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-warning/10 border border-warning/20 p-6 rounded-2xl space-y-4 shadow-[inset_0_0_20px_rgba(245,158,11,0.05)]">
              <div className="flex items-center gap-3 text-warning">
                <div className="p-2 bg-warning/20 rounded-lg">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-lg tracking-wide">Important Instructions</h4>
              </div>
              <ul className="text-sm text-slate-300 space-y-3 list-none pl-1">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-warning mt-2 shrink-0"></div>
                  <span>Send exactly <span className="text-white font-bold bg-slate-800 px-2 py-0.5 rounded">{amount} {selectedAsset}</span>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-warning mt-2 shrink-0"></div>
                  <span>Ensure you use the <span className="text-white font-bold bg-slate-800 px-2 py-0.5 rounded">{selectedNetwork}</span> network.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-warning mt-2 shrink-0"></div>
                  <span>Funds will be credited automatically after admin verification.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700/50 pt-8 space-y-6 relative z-10">
            {proofSubmitted ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-gradient-to-br from-success/20 to-success/5 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <BadgeCheck className="w-10 h-10 text-success" />
                </div>
                <div>
                  <p className="text-2xl text-success font-extrabold mb-2">Proof Submitted!</p>
                  <p className="text-slate-400">Our team will verify and credit your account shortly.</p>
                </div>
              </div>
            ) : (
              <div className="bg-dark/40 border border-slate-800 p-6 rounded-2xl space-y-6">
                <div>
                  <h4 className="text-white font-bold text-lg mb-2 flex items-center gap-3">
                    <div className="p-1.5 bg-primary/20 rounded-md">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                    Submit Deposit Proof
                  </h4>
                  <p className="text-slate-400 text-sm">After sending, paste your Transaction ID and/or upload a screenshot so admin can verify faster.</p>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="label">Transaction ID / Hash (optional)</label>
                    <input
                      type="text"
                      className="input-field w-full font-mono text-sm bg-dark/80"
                      placeholder="e.g. 0xabc123... or TRC20 hash"
                      value={proofTxHash}
                      onChange={(e) => setProofTxHash(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="label">Screenshot Proof (optional)</label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 hover:border-primary/50 hover:bg-primary/5 rounded-xl cursor-pointer bg-dark/80 transition-all group">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                      />
                      {proofFile ? (
                        <div className="flex items-center gap-3 text-success bg-success/10 px-4 py-2 rounded-lg">
                          <BadgeCheck className="w-6 h-6" />
                          <span className="text-sm font-bold truncate max-w-[200px]">{proofFile.name}</span>
                        </div>
                      ) : (
                        <div className="text-center group-hover:scale-105 transition-transform duration-300">
                          <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 group-hover:text-primary transition-colors text-slate-400">
                            <Lock className="w-5 h-5" />
                          </div>
                          <p className="text-slate-300 font-medium text-sm">Click to upload screenshot</p>
                          <p className="text-slate-500 text-xs mt-1">PNG, JPG up to 10MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
                <button
                  disabled={proofSubmitting || (!proofTxHash && !proofFile)}
                  onClick={async () => {
                    setProofSubmitting(true);
                    try {
                      const formData = new FormData();
                      formData.append('asset', selectedAsset);
                      formData.append('network', selectedNetwork);
                      formData.append('amount', amount);
                      if (proofTxHash) formData.append('txHash', proofTxHash);
                      if (proofFile) formData.append('proofImage', proofFile);
                      await api.post(`/user/deposit`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                      });
                      setProofSubmitted(true);
                    } catch (err: any) {
                      alert(`Failed: ${err.response?.data?.error || err.message}`);
                    } finally {
                      setProofSubmitting(false);
                    }
                  }}
                  className="w-full py-4 rounded-xl bg-primary hover:bg-primary-light text-white font-bold text-lg shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {proofSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <BadgeCheck className="w-6 h-6" />}
                  Submit Proof
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setStep(1);
              setAmount("");
              setSelectedAsset("");
              setSelectedNetwork("");
              setProofTxHash('');
              setProofFile(null);
              setProofSubmitted(false);
            }}
            className="w-full py-3 rounded-xl bg-dark border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white font-medium transition-all relative z-10"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="text-center md:text-left">
        <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">Deposit Funds</h2>
        <p className="text-slate-400 mt-3 text-lg">
          Fill in the details to generate payment instructions securely
        </p>
      </div>

      <div className="card relative overflow-hidden group border-slate-700/50 hover:border-primary/30 transition-all duration-700 p-8 shadow-2xl">
        <div className="absolute -inset-x-40 -top-40 h-80 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
        
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="label">Select Asset</label>
              <select
                className="input-field w-full"
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                required
              >
                <option value="">Select Asset</option>
                {config?.assets.map((a) => (
                  <option key={a._id} value={a.symbol}>
                    {a.name} ({a.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Select Network</label>
              <select
                className="input-field w-full"
                value={selectedNetwork}
                onChange={(e) => setSelectedNetwork(e.target.value)}
                required
              >
                <option value="">Select Network</option>
                {config?.networks.map((n) => (
                  <option key={n._id} value={n.name}>
                    {n.name} - {n.chain}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Amount</label>
            <input
              type="number"
              step="any"
              className="input-field w-full"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="bg-primary/5 border border-primary/20 p-5 rounded-xl flex gap-4 text-sm text-slate-300 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]">
            <div className="p-2 bg-primary/20 rounded-lg shrink-0 h-fit">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <p className="leading-relaxed mt-1">
              After submission, you'll receive the wallet address and QR code to
              complete your transfer. Send the exact amount to avoid delays.
            </p>
          </div>

          <button
            disabled={!walletSetting}
            type="submit"
            className="w-full py-4 rounded-xl bg-primary hover:bg-primary-light text-white font-bold text-lg shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            Generate Deposit Address
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {!walletSetting && selectedAsset && selectedNetwork && (
            <p className="text-center text-error text-sm font-medium">
              Warning: This asset/network combination is currently unavailable
              for deposits.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export const Withdraw: React.FC = () => {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [balances, setBalances] = useState<any[]>([]);
  const [savedWallets, setSavedWallets] = useState<
    { network: string; address: string }[]
  >([]);

  useEffect(() => {
    api.get("/user/config").then((res) => setConfig(res.data));
    api.get("/user/balances").then((res) => setBalances(res.data));
    api
      .get("/auth/profile")
      .then((res) => setSavedWallets(res.data.savedWallets || []));
  }, []);

  useEffect(() => {
    const savedWallet = savedWallets.find((w) => w.network === selectedNetwork);
    if (savedWallet) {
      setAddress(savedWallet.address);
    } else {
      setAddress("");
    }
  }, [selectedNetwork, savedWallets]);

  const isLocked = !!savedWallets.find((w) => w.network === selectedNetwork);

  const currentBalance = balances.find((b: any) => b.asset === selectedAsset);
  const clearedBalance: number = currentBalance?.clearedBalance || 0;

  const amountNum = Number(amount) || 0;
  let fee = 0;
  let unclearedPortion = 0;
  if (amountNum > clearedBalance) {
    unclearedPortion = amountNum - clearedBalance;
    fee = unclearedPortion * 0.2;
  }
  const amountReceived = amountNum - fee;
  const hasFee = fee > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/user/withdraw", {
        asset: selectedAsset,
        network: selectedNetwork,
        amount: Number(amount),
        walletAddress: address,
      });
      setSuccess(true);
      setAmount("");
      setAddress("");
    } catch (err: any) {
      alert(err.response?.data?.error || "Withdrawal failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Withdraw</h2>
        <p className="text-slate-400 mt-1">Send funds to an external wallet</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="label">Asset</label>
              <select
                className="input-field w-full"
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                required
              >
                <option value="">Select</option>
                {config?.assets.map((a) => (
                  <option key={a._id} value={a.symbol}>
                    {a.symbol}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Network</label>
              <select
                className="input-field w-full"
                value={selectedNetwork}
                onChange={(e) => setSelectedNetwork(e.target.value)}
                required
              >
                <option value="">Select</option>
                {config?.networks.map((n) => (
                  <option key={n._id} value={n.name}>
                    {n.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label flex items-center justify-between">
              Wallet Address
              {isLocked && (
                <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              )}
            </label>
            <input
              type="text"
              className={`input-field w-full ${isLocked ? "opacity-70 cursor-not-allowed bg-slate-800" : ""}`}
              placeholder="Enter withdrawal address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              readOnly={isLocked}
              required
            />
            {isLocked && (
              <p className="text-xs text-slate-500 mt-1">
                This address is permanently locked for your security.
              </p>
            )}
          </div>

          <div>
            <label className="label">Amount to Withdraw</label>
            <input
              type="number"
              step="any"
              className="input-field w-full"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="bg-primary/5 p-4 rounded-lg flex gap-3 text-sm text-slate-400 border border-primary/20">
            <Info className="w-5 h-5 text-primary shrink-0" />
            <p>
              Withdrawals are reviewed and processed by our team. This usually
              takes 5-30 minutes during business hours.
            </p>
          </div>

          {amountNum > 0 && (
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 space-y-4">
              <h4 className="font-bold text-white mb-2">Withdrawal Summary</h4>

              {/* Cleared balance info */}
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">
                  Your Cleared Balance (0% Fee)
                </span>
                <span className="font-medium text-success">
                  {clearedBalance.toFixed(2)} {selectedAsset}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Requested Amount</span>
                <span className="font-medium text-white">
                  {amountNum.toFixed(2)} {selectedAsset}
                </span>
              </div>

              {hasFee && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">
                      Cleared Portion (no fee)
                    </span>
                    <span className="font-medium text-success">
                      {clearedBalance.toFixed(2)} {selectedAsset}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">
                      Uncleared Portion (20% fee)
                    </span>
                    <span className="font-medium text-error">
                      {unclearedPortion.toFixed(2)} {selectedAsset}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">
                      Early Withdrawal Fee (20%)
                    </span>
                    <span className="font-bold text-error">
                      -{fee.toFixed(2)} {selectedAsset}
                    </span>
                  </div>
                  <p className="text-xs text-warning bg-warning/5 border border-warning/20 rounded-lg px-3 py-2">
                    A 20% fee applies to the{" "}
                    <strong>
                      {unclearedPortion.toFixed(2)} {selectedAsset}
                    </strong>{" "}
                    portion because it has not yet generated equal profit. Keep
                    trading to clear this amount.
                  </p>
                </>
              )}

              {!hasFee && (
                <p className="text-xs text-success bg-success/5 border border-success/20 rounded-lg px-3 py-2">
                  ✓ Your entire withdrawal is from your cleared balance. No fee
                  applies!
                </p>
              )}

              <div className="pt-3 border-t border-slate-700 flex justify-between">
                <span className="font-bold text-slate-300">
                  Amount You Will Receive
                </span>
                <span className="font-bold text-primary text-lg">
                  {amountReceived.toFixed(2)} {selectedAsset}
                </span>
              </div>
            </div>
          )}

          <button
            disabled={loading}
            type="submit"
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            Request Withdrawal
          </button>

          {success && (
            <div className="bg-success/10 border border-success/20 text-success p-4 rounded-lg text-sm text-center">
              Withdrawal request submitted!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
