import React, { useState, useEffect } from 'react';
import { Search, Bell, FileText, Download, ChevronRight, ChevronDown, Eye, EyeOff } from 'lucide-react';
import api from '../api/api';

interface TokenData {
    symbol: string;
    name: string;
    price: string;
    originalPrice?: string;
    change: number;
    volume: string;
    marketCap: string;
    color: string;
}

const colorMap: Record<string, string> = {
    BTC: 'bg-[#F7931A]',
    ETH: 'bg-[#627EEA]',
    USDT: 'bg-[#26A17B]',
    BNB: 'bg-[#F3BA2F]',
    XRP: 'bg-[#23292F]',
    USDC: 'bg-[#2775CA]',
    SOL: 'bg-[#14F195]',
    TRX: 'bg-[#FF0013]',
    ZEC: 'bg-[#F4B728]',
    HYPE: 'bg-[#43E4B0]',
    DOGE: 'bg-[#C2A633]',
    XLM: 'bg-[#14B6E7]',
    LINK: 'bg-[#2A5ADA]',
    WBETH: 'bg-[#E3E3E3]',
    WBTC: 'bg-[#F2A900]',
    USDS: 'bg-[#000000]',
    ADA: 'bg-[#0033AD]',
    UNI: 'bg-[#FF007A]',
    NEAR: 'bg-[#000000]',
    BCH: 'bg-[#0AC18E]',
    LTC: 'bg-[#345D9D]',
    DOT: 'bg-[#E6007A]',
    AVAX: 'bg-[#E84142]',
    SHIB: 'bg-[#E1B303]'
};

const formatNumber = (num: number, isPrice = false) => {
    if (num >= 1e9) {
        return (num / 1e9).toFixed(2) + 'B';
    }
    if (num >= 1e6) {
        return (num / 1e6).toFixed(2) + 'M';
    }
    if (num >= 1e3 && !isPrice) {
        return (num / 1e3).toFixed(2) + 'K';
    }
    if (isPrice && num < 1) {
        return num.toFixed(4);
    }
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const Dashboard: React.FC = () => {
    const [tokens, setTokens] = useState<TokenData[]>([]);
    const [widgets, setWidgets] = useState([
        { title: 'Hot', items: [] as any[] },
        { title: 'New', items: [] as any[] },
        { title: 'Top Gainer', items: [] as any[] },
        { title: 'Top Volume', items: [] as any[] }
    ]);
    const [totalBalance, setTotalBalance] = useState<number>(0);
    const [showBalance, setShowBalance] = useState<boolean>(true);

    useEffect(() => {
        const fetchUserBalance = async () => {
            try {
                const balRes = await api.get('/user/balances');
                const total = balRes.data.reduce((acc: number, curr: any) => acc + curr.amount, 0);
                setTotalBalance(total);
            } catch (err) {
                console.error('Failed to fetch balances', err);
            }
        };
        fetchUserBalance();
    }, []);

    useEffect(() => {
        const targetSymbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'ADAUSDT', 'DOGEUSDT', 'TRXUSDT', 'LINKUSDT', 'DOTUSDT', 'LTCUSDT', 'BCHUSDT', 'XLMUSDT', 'NEARUSDT', 'AVAXUSDT', 'SHIBUSDT'];
        const nameMap: Record<string, string> = {
            'BTC': 'Bitcoin', 'ETH': 'Ethereum', 'BNB': 'BNB Chain', 'SOL': 'Solana', 'XRP': 'XRP',
            'ADA': 'Cardano', 'DOGE': 'Dogecoin', 'TRX': 'TRON', 'LINK': 'Chainlink', 'DOT': 'Polkadot',
            'LTC': 'Litecoin', 'BCH': 'Bitcoin Cash', 'XLM': 'Stellar', 'NEAR': 'NEAR Protocol',
            'AVAX': 'Avalanche', 'SHIB': 'Shiba Inu'
        };

        const fetchMarketData = async () => {
            try {
                // Fetch 24hr ticker for target symbols
                const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(targetSymbols)}`);
                const data = await response.json();

                const parsedTokens: TokenData[] = data.map((item: any) => {
                    const baseSymbol = item.symbol.replace('USDT', '');
                    const price = parseFloat(item.lastPrice);
                    const change = parseFloat(item.priceChangePercent);
                    const volume = parseFloat(item.quoteVolume);
                    
                    // Estimate Market Cap (just using volume * random multiplier for demo visually, as real supply isn't in 24h ticker)
                    // But to make it real-ish we just show quote volume or a mock market cap based on rank.
                    const mockMarketCap = volume * (Math.random() * 50 + 10);

                    return {
                        symbol: baseSymbol,
                        name: nameMap[baseSymbol] || baseSymbol,
                        price: price < 1 ? price.toFixed(4) : price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                        originalPrice: '$' + (price < 1 ? price.toFixed(4) : price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })),
                        change: change,
                        volume: '$' + formatNumber(volume),
                        marketCap: '$' + formatNumber(mockMarketCap),
                        color: colorMap[baseSymbol] || 'bg-slate-500'
                    };
                });
                
                // Sort by volume descending for main list
                parsedTokens.sort((a, b) => parseFloat(b.volume.replace(/[^0-9.-]+/g, "")) - parseFloat(a.volume.replace(/[^0-9.-]+/g, "")));
                setTokens(parsedTokens);

                // Build widgets
                const hot = [...parsedTokens].sort((a, b) => b.change - a.change).slice(0, 3);
                const newTokens = [...parsedTokens].reverse().slice(0, 3);
                const gainers = [...parsedTokens].sort((a, b) => b.change - a.change).slice(0, 3);
                const topVolume = [...parsedTokens].slice(0, 3);

                setWidgets([
                    { title: 'Hot', items: hot.map(t => ({ symbol: t.symbol, price: '$' + t.price, change: t.change, color: t.color })) },
                    { title: 'New', items: newTokens.map(t => ({ symbol: t.symbol, price: '$' + t.price, change: t.change, color: t.color })) },
                    { title: 'Top Gainer', items: gainers.map(t => ({ symbol: t.symbol, price: '$' + t.price, change: t.change, color: t.color })) },
                    { title: 'Top Volume', items: topVolume.map(t => ({ symbol: t.symbol, price: '$' + t.price, change: t.change, color: t.color })) }
                ]);

            } catch (error) {
                console.error("Failed to fetch market data:", error);
            }
        };

        fetchMarketData();
        const interval = setInterval(fetchMarketData, 10000); // Update every 10 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-dark min-h-screen text-slate-100 font-sans overflow-x-hidden p-6 -mx-6 -mt-6">
            {/* Top Navigation */}
            <div className="flex items-center gap-6 mb-6 text-slate-400 text-sm font-medium">
                <div className="text-white border-b-2 border-white pb-1 cursor-pointer">Overview</div>
                <div className="hover:text-white cursor-pointer pb-1 transition-colors">Trading Data</div>
                <div className="hover:text-white cursor-pointer pb-1 transition-colors">Token Unlock</div>
            </div>

            {/* Balance Overview */}
            <div className="mb-8 card flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h2 className="text-slate-400 text-sm font-medium mb-1 flex items-center gap-2">
                        Estimated Balance
                        <button 
                            onClick={() => setShowBalance(!showBalance)}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                    </h2>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-bold text-white">
                            {showBalance ? `$${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '********'}
                        </span>
                    </div>
                </div>
                <div className="flex gap-3 mt-5 md:mt-0">
                    <button className="btn-primary rounded-xl px-6">Deposit</button>
                    <button className="btn-secondary rounded-xl px-6 bg-slate-800 hover:bg-slate-700">Withdraw</button>
                </div>
            </div>

            {/* Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {widgets.map((widget, i) => (
                    <div key={i} className="card p-4">
                        <div className="flex justify-between items-center mb-4 text-sm">
                            <span className="text-slate-400 font-semibold">{widget.title}</span>
                            <span className="text-slate-400 flex items-center gap-1 cursor-pointer hover:text-white transition-colors">More <ChevronRight size={14} /></span>
                        </div>
                        <div className="space-y-3">
                            {widget.items.map((item, j) => (
                                <div key={j} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2 w-1/3">
                                        <div className={`w-4 h-4 rounded-full ${item.color} flex items-center justify-center text-[8px] font-bold text-white`}>
                                            {item.symbol[0]}
                                        </div>
                                        <span className="font-medium text-slate-200">{item.symbol}</span>
                                    </div>
                                    <span className="text-slate-300 w-1/3 text-right">{item.price}</span>
                                    <span className={`w-1/3 text-right ${item.change >= 0 ? 'text-success' : 'text-error'}`}>
                                        {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Tabs */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-6 text-slate-400 text-sm font-medium overflow-x-auto whitespace-nowrap hide-scrollbar">
                    <span className="hover:text-white cursor-pointer transition-colors">Favorites</span>
                    <span className="text-white font-bold cursor-pointer">Cryptos</span>
                    <span className="hover:text-white cursor-pointer transition-colors">Spot</span>
                    <span className="hover:text-white cursor-pointer transition-colors">Futures</span>
                    <span className="hover:text-white cursor-pointer transition-colors">TradFi</span>
                    <span className="hover:text-white cursor-pointer flex items-center gap-1 transition-colors">
                        Alpha <span className="bg-[#F3BA2F] text-black text-[10px] px-1 rounded-sm font-bold">New</span>
                    </span>
                    <span className="hover:text-white cursor-pointer transition-colors">New</span>
                    <span className="hover:text-white cursor-pointer transition-colors">Zones</span>
                </div>
                <div className="flex gap-4 text-slate-400">
                    <Search size={18} className="cursor-pointer hover:text-white transition-colors" />
                    <Bell size={18} className="cursor-pointer hover:text-white transition-colors" />
                </div>
            </div>

            {/* Sub Tabs */}
            <div className="flex gap-3 text-xs mb-8 overflow-x-auto whitespace-nowrap hide-scrollbar pb-2">
                <span className="bg-slate-700/50 text-white px-3 py-1.5 rounded hover:bg-slate-700 transition-colors cursor-pointer border border-slate-600/50">All</span>
                <span className="text-slate-400 px-3 py-1.5 rounded hover:bg-slate-800/50 transition-colors cursor-pointer flex items-center gap-1">
                    bStocks <span className="text-[#F3BA2F]">New</span>
                </span>
                <span className="text-slate-400 px-3 py-1.5 rounded hover:bg-slate-800/50 transition-colors cursor-pointer">tCommodities</span>
                <span className="text-slate-400 px-3 py-1.5 rounded hover:bg-slate-800/50 transition-colors cursor-pointer">BSC</span>
                <span className="text-slate-400 px-3 py-1.5 rounded hover:bg-slate-800/50 transition-colors cursor-pointer">Solana</span>
                <span className="text-slate-400 px-3 py-1.5 rounded hover:bg-slate-800/50 transition-colors cursor-pointer">RWA</span>
                <span className="text-slate-400 px-3 py-1.5 rounded hover:bg-slate-800/50 transition-colors cursor-pointer">MEME</span>
                <span className="text-slate-400 px-3 py-1.5 rounded hover:bg-slate-800/50 transition-colors cursor-pointer">Payments</span>
                <span className="text-slate-400 px-3 py-1.5 rounded hover:bg-slate-800/50 transition-colors cursor-pointer">AI</span>
                <span className="text-slate-400 px-3 py-1.5 rounded hover:bg-slate-800/50 transition-colors cursor-pointer">Layer 1 / Layer 2</span>
                <span className="text-slate-400 px-3 py-1.5 rounded hover:bg-slate-800/50 transition-colors cursor-pointer">Seed</span>
                <span className="text-slate-400 px-3 py-1.5 rounded hover:bg-slate-800/50 transition-colors cursor-pointer">Launchpool</span>
            </div>

            {/* Table Header Area */}
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h1 className="text-xl font-bold mb-1 text-slate-100">Top Tokens by Market Capitalization</h1>
                    <p className="text-xs text-slate-400">
                        Get a comprehensive snapshot of all cryptocurrencies available on Binance. This page displays the latest prices, 24-hour trading volume, price changes, and market capitalizations for all cryptocurrencies on Binance... <span className="text-white cursor-pointer hover:underline">More </span><ChevronDown size={12} className="inline" />
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="text-slate-400 border-b border-slate-700/50">
                            <th className="py-3 font-normal cursor-pointer hover:text-slate-200 w-1/4 transition-colors">Name <span className="text-[10px]">↕</span></th>
                            <th className="py-3 font-normal text-right cursor-pointer hover:text-slate-200 transition-colors">Price <span className="text-[10px]">↕</span></th>
                            <th className="py-3 font-normal text-right cursor-pointer hover:text-slate-200 transition-colors">
                                <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700/50">24h <ChevronDown size={12} className="inline" /></span> Change <span className="text-[10px]">↕</span>
                            </th>
                            <th className="py-3 font-normal text-right cursor-pointer hover:text-slate-200 transition-colors">24h Volume <span className="text-[10px]">↕</span></th>
                            <th className="py-3 font-normal text-right cursor-pointer hover:text-slate-200 transition-colors">Market Cap <span className="text-[10px]">↕</span></th>
                            <th className="py-3 font-normal text-right w-20">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                        {tokens.length > 0 ? tokens.map((token, index) => (
                            <tr key={index} className="hover:bg-slate-800/30 group cursor-pointer transition-colors">
                                <td className="py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full ${token.color} flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-sm`}>
                                            {token.symbol[0]}
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-bold text-base text-slate-100 group-hover:text-white transition-colors">{token.symbol}</span>
                                            <span className="text-slate-400 text-xs">{token.name}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 text-right">
                                    <div className="font-medium text-base text-slate-100">{token.price}</div>
                                    {token.originalPrice && <div className="text-slate-500 text-xs">{token.originalPrice}</div>}
                                </td>
                                <td className={`py-4 text-right font-medium ${token.change >= 0 ? 'text-success' : 'text-error'}`}>
                                    {token.change >= 0 ? '+' : ''}{token.change.toFixed(2)}%
                                </td>
                                <td className="py-4 text-right font-medium text-slate-200">
                                    {token.volume}
                                </td>
                                <td className="py-4 text-right font-medium text-slate-200">
                                    {token.marketCap}
                                </td>
                                <td className="py-4 text-right">
                                    <div className="flex justify-end gap-3 text-slate-400">
                                        <FileText size={16} className="hover:text-slate-200 transition-colors" />
                                        <Download size={16} className="hover:text-slate-200 transition-colors" />
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-slate-500">
                                    Loading live market data...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination / Footer */}
            <div className="flex justify-end items-center gap-2 mt-6 text-sm text-slate-400">
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700">&lt;</button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-slate-700 text-white border border-slate-600">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700">3</button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700">4</button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700">5</button>
                <span>...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700">17</button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700">&gt;</button>
            </div>
        </div>
    );
};
