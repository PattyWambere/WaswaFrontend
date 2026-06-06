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
  const [binanceId, setBinanceId] = useState("");
  const [step, setStep] = useState(1); // 1: Form, 2: Instructions
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      await api.post("/user/deposit", {
        asset: selectedAsset,
        network: selectedNetwork,
        amount: Number(amount),
        binanceId,
      });
      setStep(2);
    } catch (err: any) {
      console.error(err);
      alert(`Failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (step === 2 && walletSetting) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <BadgeCheck className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-3xl font-bold text-white">
            Deposit Intent Stored
          </h2>
          <p className="text-slate-400">
            Please complete the payment to the address below
          </p>
        </div>

        <div className="card space-y-8 p-8">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-2xl">
              <QRCode value={walletSetting.centralWallet} size={200} />
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

          <div className="space-y-4">
            <div>
              <label className="label">Deposit Address</label>
              <div className="p-4 bg-dark rounded-lg border border-slate-700 flex items-center justify-between gap-3 overflow-hidden">
                <p className="text-sm font-mono text-white truncate">
                  {walletSetting.centralWallet}
                </p>
                <button
                  onClick={copyToClipboard}
                  className="text-slate-400 hover:text-white shrink-0"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-success" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="bg-warning/5 border border-warning/20 p-6 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-warning">
                <AlertTriangle className="w-5 h-5" />
                <h4 className="font-bold">Important Instructions</h4>
              </div>
              <ul className="text-sm text-slate-400 space-y-2 list-disc pl-5">
                <li>
                  Send exactly{" "}
                  <span className="text-white font-bold">
                    {amount} {selectedAsset}
                  </span>
                  .
                </li>
                <li>
                  Ensure you use the{" "}
                  <span className="text-white font-bold">
                    {selectedNetwork}
                  </span>{" "}
                  network.
                </li>
                <li>
                  Funds will be credited automatically after admin verification.
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => {
              setStep(1);
              setAmount("");
              setBinanceId("");
              setSelectedAsset("");
              setSelectedNetwork("");
            }}
            className="btn-secondary w-full py-3"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Deposit Funds</h2>
        <p className="text-slate-400 mt-1">
          Fill in the details to generate payment instructions
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div>
              <label className="label">Binance User ID</label>
              <input
                type="text"
                className="input-field w-full font-mono"
                placeholder="Enter your Binance ID"
                value={binanceId}
                onChange={(e) => setBinanceId(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg flex gap-3 text-sm text-slate-400">
            <Info className="w-5 h-5 text-primary shrink-0" />
            <p>
              After submission, you'll receive the wallet address and QR code to
              complete the transfer via your Binance account.
            </p>
          </div>

          <button
            disabled={loading || !walletSetting}
            type="submit"
            className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-lg font-bold group"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Next Step
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
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
