export interface User {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    role: 'user' | 'admin';
    followingCode?: string;
    savedWallets?: { network: string; address: string }[];
}

export interface AuthResponse {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    role: 'user' | 'admin';
    token: string;
    followingCode?: string;
    savedWallets?: { network: string; address: string }[];
}

export interface Asset {
    _id: string;
    symbol: string;
    name: string;
    decimals: number;
    enabled: boolean;
}

export interface Network {
    _id: string;
    name: string;
    chain: string;
    enabled: boolean;
}

export interface WalletSettings {
    _id: string;
    asset: string;
    network: string;
    centralWallet: string;
    qrCodeUrl?: string; // Add this field
    enabled: boolean;
}

export interface DepositTranche {
    amount: number;
    targetProfit: number;
    cleared: boolean;
}

export interface Balance {
    _id: string;
    userId: string | { _id: string, email: string };
    asset: string;
    amount: number;
    lockedAmount: number;
    clearedBalance: number;
    depositTranches: DepositTranche[];
}

export interface Transaction {
    _id: string;
    userId: string | { _id: string, email: string };
    type: 'deposit' | 'withdrawal';
    asset: string;
    network: string;
    amount: number;
    fee?: number;
    amountReceived?: number;
    binanceId?: string;
    txHash?: string;
    walletAddress?: string;
    status: 'pending' | 'approved' | 'rejected' | 'denied' | 'completed';
    createdAt: string;
}

export interface AppSettings {
    maintenanceMode: boolean;
    maintenanceMessage: string;
}

export interface AppConfig {
    assets: Asset[];
    networks: Network[];
    walletSettings: WalletSettings[];
    appSettings?: AppSettings;
}
