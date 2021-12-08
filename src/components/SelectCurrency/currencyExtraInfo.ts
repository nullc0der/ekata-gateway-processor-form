interface CurrencyExtraInfo {
    [key: string]: {
        ticker: string
    }
}

export const currencyExtraInfo: CurrencyExtraInfo = {
    bitcoin: {
        ticker: 'BTC',
    },
    monero: {
        ticker: 'XMR',
    },
    dogecoin: {
        ticker: 'DOGE',
    },
}
