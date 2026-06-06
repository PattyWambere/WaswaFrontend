import api from '../api/api';

export const executeTrade = async (tradeData: { pair: string; type: 'buy' | 'sell'; amount: number; price: number }) => {
    const response = await api.post('/trades', tradeData);
    return response.data;
};

export const getMyTrades = async () => {
    const response = await api.get('/trades/my-trades');
    return response.data;
};

export const getPendingSettlements = async () => {
    const response = await api.get('/trades/pending-settlements');
    return response.data;
};

export const settleTrade = async (settlementData: { tradeId: string; resultStatus: 'win' | 'loss'; pnlAmount: number }) => {
    const response = await api.post('/trades/settle', settlementData);
    return response.data;
};
