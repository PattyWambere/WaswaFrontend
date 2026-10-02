import React from 'react';
import { Search, Bell, FileText, Download, ChevronRight, ChevronDown } from 'lucide-react';

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

const widgets = [
    {
        title: 'Hot',
        items: [
            { symbol: 'BNB', price: '$780.50', change: 1.46, color: 'bg-[#F3BA2F]' },
            { symbol: 'BTC', price: '$86.59K', change: 3.35, color: 'bg-[#F7931A]' },
            { symbol: 'ETH', price: '$2.74K', change: 1.93, color: 'bg-[#627EEA]' },
        ]
    },
    {
        title: 'New',
        items: [
            { symbol: 'ADBEB', price: '$240.06', change: -1.78, color: 'bg-red-500' },
            { symbol: 'FWDIB', price: '$8.31', change: 5.73, color: 'bg-orange-500' },
            { symbol: 'HPEB', price: '$68.37', change: 10.13, color: 'bg-green-500' },
        ]
    },
    {
        title: 'Top Gainer',
        items: [
            { symbol: 'SAND', price: '$0.06776', change: 58.90, color: 'bg-blue-400' },
            { symbol: 'GTC', price: '$0.12485', change: 27.75, color: 'bg-green-400' },
            { symbol: 'NIGHT', price: '$0.0481', change: 25.88, color: 'bg-purple-500' },
        ]
    },
    {
        title: 'Top Volume',
        items: [
            { symbol: 'BTC', price: '$86.59K', change: 3.35, color: 'bg-[#F7931A]' },
            { symbol: 'ETH', price: '$2.74K', change: 1.93, color: 'bg-[#627EEA]' },
            { symbol: 'SOL', price: '$121.93', change: 3.69, color: 'bg-[#14F195]' },
        ]
    }
];

const tokens: TokenData[] = [
    { symbol: 'BTC', name: 'Bitcoin', price: '86,594.22', originalPrice: '$86,594.22', change: 3.35, volume: '$41.50B', marketCap: '$1.74T', color: 'bg-[#F7931A]' },
    { symbol: 'ETH', name: 'Ethereum', price: '2,740.30', originalPrice: '$2,740.30', change: 1.93, volume: '$16.40B', marketCap: '$337.04B', color: 'bg-[#627EEA]' },
    { symbol: 'USDT', name: 'USDT', price: '1.00', originalPrice: '$1.00', change: 0.01, volume: '$88.95B', marketCap: '$184.00B', color: 'bg-[#26A17B]' },
    { symbol: 'BNB', name: 'BNB Chain', price: '780.50', originalPrice: '$780.50', change: 1.46, volume: '$1.60B', marketCap: '$104.20B', color: 'bg-[#F3BA2F]' },
    { symbol: 'XRP', name: 'XRP', price: '1.53', originalPrice: '$1.53', change: 3.20, volume: '$3.70B', marketCap: '$97.12B', color: 'bg-[#23292F]' },
    { symbol: 'USDC', name: 'USDC', price: '1.00', originalPrice: '$1.00', change: -0.01, volume: '$21.01B', marketCap: '$73.95B', color: 'bg-[#2775CA]' },
    { symbol: 'SOL', name: 'Solana', price: '121.93', originalPrice: '$121.93', change: 3.69, volume: '$4.44B', marketCap: '$72.29B', color: 'bg-[#14F195]' },
    { symbol: 'TRX', name: 'TRON', price: '0.3349', originalPrice: '$0.3349', change: 0.63, volume: '$423.15M', marketCap: '$31.80B', color: 'bg-[#FF0013]' },
    { symbol: 'ZEC', name: 'Zcash', price: '1,380.91', originalPrice: '$1,380.91', change: -0.78, volume: '$1.35B', marketCap: '$23.54B', color: 'bg-[#F4B728]' },
    { symbol: 'HYPE', name: 'Hyperliquid', price: '90.34', originalPrice: '$90.34', change: 1.37, volume: '$870.31M', marketCap: '$22.88B', color: 'bg-[#43E4B0]' },
    { symbol: 'DOGE', name: 'Dogecoin', price: '0.09656', originalPrice: '$0.09656', change: 2.68, volume: '$1.11B', marketCap: '$16.72B', color: 'bg-[#C2A633]' },
    { symbol: 'XLM', name: 'Stellar Lumens', price: '0.221', originalPrice: '$0.221', change: 2.19, volume: '$233.44M', marketCap: '$11.27B', color: 'bg-[#14B6E7]' },
    { symbol: 'LINK', name: 'Chainlink', price: '14.35', originalPrice: '$14.35', change: 0.44, volume: '$517.72M', marketCap: '$10.78B', color: 'bg-[#2A5ADA]' },
    { symbol: 'WBETH', name: 'Wrapped Beacon ETH', price: '3,035.92', originalPrice: '$3,035.92', change: 1.54, volume: '$3.08M', marketCap: '$10.28B', color: 'bg-[#E3E3E3]' },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', price: '86,603.52', originalPrice: '$86,603.52', change: 3.18, volume: '$230.22M', marketCap: '$10.12B', color: 'bg-[#F2A900]' },
    { symbol: 'USDS', name: 'USDS', price: '0.9998', originalPrice: '$0.9998', change: -0.02, volume: '$291.76M', marketCap: '$9.95B', color: 'bg-[#000000]' },
    { symbol: 'ADA', name: 'Cardano', price: '0.2548', originalPrice: '$0.2548', change: 3.75, volume: '$652.93M', marketCap: '$9.46B', color: 'bg-[#0033AD]' },
    { symbol: 'UNI', name: 'Uniswap', price: '9.04', originalPrice: '$9.04', change: -0.33, volume: '$651.77M', marketCap: '$8.08B', color: 'bg-[#FF007A]' },
    { symbol: 'NEAR', name: 'NEAR Protocol', price: '4.88', originalPrice: '$4.88', change: -1.51, volume: '$1.31B', marketCap: '$6.46B', color: 'bg-[#000000]' },
    { symbol: 'BCH', name: 'Bitcoin Cash', price: '315.10', originalPrice: '$315.10', change: 2.84, volume: '$274.59M', marketCap: '$6.35B', color: 'bg-[#0AC18E]' },
];

export const Dashboard: React.FC = () => {
    return (
        <div className="bg-[#181a20] min-h-screen text-white font-sans overflow-x-hidden p-6 -mx-6 -mt-6">
            {/* Top Navigation */}
            <div className="flex items-center gap-6 mb-8 text-[#848E9C] text-sm font-medium">
                <div className="text-white border-b-2 border-white pb-1 cursor-pointer">Overview</div>
                <div className="hover:text-white cursor-pointer pb-1">Trading Data</div>
                <div className="hover:text-white cursor-pointer pb-1">Token Unlock</div>
            </div>

            {/* Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {widgets.map((widget, i) => (
                    <div key={i} className="bg-[#1e2026] rounded-xl p-4 border border-[#2b3139]">
                        <div className="flex justify-between items-center mb-4 text-sm">
                            <span className="text-[#848E9C] font-semibold">{widget.title}</span>
                            <span className="text-[#848E9C] flex items-center gap-1 cursor-pointer hover:text-white">More <ChevronRight size={14} /></span>
                        </div>
                        <div className="space-y-3">
                            {widget.items.map((item, j) => (
                                <div key={j} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded-full ${item.color} flex items-center justify-center text-[8px] font-bold text-white`}>
                                            {item.symbol[0]}
                                        </div>
                                        <span className="font-medium">{item.symbol}</span>
                                    </div>
                                    <span className="text-gray-300">{item.price}</span>
                                    <span className={item.change >= 0 ? 'text-[#0ECB81]' : 'text-[#F6465D]'}>
                                        {item.change >= 0 ? '+' : ''}{item.change}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Tabs */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-6 text-[#848E9C] text-sm font-medium overflow-x-auto whitespace-nowrap hide-scrollbar">
                    <span className="hover:text-white cursor-pointer">Favorites</span>
                    <span className="text-white font-bold cursor-pointer">Cryptos</span>
                    <span className="hover:text-white cursor-pointer">Spot</span>
                    <span className="hover:text-white cursor-pointer">Futures</span>
                    <span className="hover:text-white cursor-pointer">TradFi</span>
                    <span className="hover:text-white cursor-pointer flex items-center gap-1">
                        Alpha <span className="bg-[#F3BA2F] text-black text-[10px] px-1 rounded-sm font-bold">New</span>
                    </span>
                    <span className="hover:text-white cursor-pointer">New</span>
                    <span className="hover:text-white cursor-pointer">Zones</span>
                </div>
                <div className="flex gap-4 text-[#848E9C]">
                    <Search size={18} className="cursor-pointer hover:text-white" />
                    <Bell size={18} className="cursor-pointer hover:text-white" />
                </div>
            </div>

            {/* Sub Tabs */}
            <div className="flex gap-3 text-xs mb-8 overflow-x-auto whitespace-nowrap hide-scrollbar pb-2">
                <span className="bg-[#2b3139] text-white px-3 py-1.5 rounded hover:bg-[#353c45] cursor-pointer">All</span>
                <span className="text-[#848E9C] px-3 py-1.5 rounded hover:bg-[#2b3139] cursor-pointer flex items-center gap-1">
                    bStocks <span className="text-[#F3BA2F]">New</span>
                </span>
                <span className="text-[#848E9C] px-3 py-1.5 rounded hover:bg-[#2b3139] cursor-pointer">tCommodities</span>
                <span className="text-[#848E9C] px-3 py-1.5 rounded hover:bg-[#2b3139] cursor-pointer">BSC</span>
                <span className="text-[#848E9C] px-3 py-1.5 rounded hover:bg-[#2b3139] cursor-pointer">Solana</span>
                <span className="text-[#848E9C] px-3 py-1.5 rounded hover:bg-[#2b3139] cursor-pointer">RWA</span>
                <span className="text-[#848E9C] px-3 py-1.5 rounded hover:bg-[#2b3139] cursor-pointer">MEME</span>
                <span className="text-[#848E9C] px-3 py-1.5 rounded hover:bg-[#2b3139] cursor-pointer">Payments</span>
                <span className="text-[#848E9C] px-3 py-1.5 rounded hover:bg-[#2b3139] cursor-pointer">AI</span>
                <span className="text-[#848E9C] px-3 py-1.5 rounded hover:bg-[#2b3139] cursor-pointer">Layer 1 / Layer 2</span>
                <span className="text-[#848E9C] px-3 py-1.5 rounded hover:bg-[#2b3139] cursor-pointer">Seed</span>
                <span className="text-[#848E9C] px-3 py-1.5 rounded hover:bg-[#2b3139] cursor-pointer">Launchpool</span>
            </div>

            {/* Table Header Area */}
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h1 className="text-xl font-bold mb-1">Top Tokens by Market Capitalization</h1>
                    <p className="text-xs text-[#848E9C]">
                        Get a comprehensive snapshot of all cryptocurrencies available on Binance. This page displays the latest prices, 24-hour trading volume, price changes, and market capitalizations for all cryptocurrencies on Binance... <span className="text-white cursor-pointer">More </span><ChevronDown size={12} className="inline" />
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="text-[#848E9C] border-b border-[#2b3139] hover:bg-transparent">
                            <th className="py-3 font-normal cursor-pointer hover:text-white w-1/4">Name <span className="text-[10px]">↕</span></th>
                            <th className="py-3 font-normal text-right cursor-pointer hover:text-white">Price <span className="text-[10px]">↕</span></th>
                            <th className="py-3 font-normal text-right cursor-pointer hover:text-white">
                                <span className="bg-[#2b3139] px-2 py-1 rounded">24h <ChevronDown size={12} className="inline" /></span> Change <span className="text-[10px]">↕</span>
                            </th>
                            <th className="py-3 font-normal text-right cursor-pointer hover:text-white">24h Volume <span className="text-[10px]">↕</span></th>
                            <th className="py-3 font-normal text-right cursor-pointer hover:text-white">Market Cap <span className="text-[10px]">↕</span></th>
                            <th className="py-3 font-normal text-right w-20">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tokens.map((token, index) => (
                            <tr key={index} className="border-b border-[#2b3139]/50 hover:bg-[#1e2026] group cursor-pointer transition-colors">
                                <td className="py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full ${token.color} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
                                            {token.symbol[0]}
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-bold text-base">{token.symbol}</span>
                                            <span className="text-[#848E9C] text-xs">{token.name}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 text-right">
                                    <div className="font-medium text-base">{token.price}</div>
                                    {token.originalPrice && <div className="text-[#848E9C] text-xs">{token.originalPrice}</div>}
                                </td>
                                <td className={`py-4 text-right font-medium ${token.change >= 0 ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
                                    {token.change >= 0 ? '+' : ''}{token.change.toFixed(2)}%
                                </td>
                                <td className="py-4 text-right font-medium">
                                    {token.volume}
                                </td>
                                <td className="py-4 text-right font-medium">
                                    {token.marketCap}
                                </td>
                                <td className="py-4 text-right">
                                    <div className="flex justify-end gap-3 text-[#848E9C]">
                                        <FileText size={16} className="hover:text-white" />
                                        <Download size={16} className="hover:text-white" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination / Footer */}
            <div className="flex justify-end items-center gap-2 mt-6 text-sm text-[#848E9C]">
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#2b3139]">&lt;</button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-[#2b3139] text-white">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#2b3139]">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#2b3139]">3</button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#2b3139]">4</button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#2b3139]">5</button>
                <span>...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#2b3139]">17</button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#2b3139]">&gt;</button>
            </div>
        </div>
    );
};
