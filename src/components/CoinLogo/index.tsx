import BitcoinLogo from 'cryptocurrency-icons/svg/color/btc.svg'
import DogecoinLogo from 'cryptocurrency-icons/svg/color/doge.svg'
import MoneroLogo from 'cryptocurrency-icons/svg/color/xmr.svg'

type CoinLogoProps = {
    currencyName: string
}

const CoinLogo = ({ currencyName }: CoinLogoProps) => {
    switch (currencyName) {
        case 'bitcoin':
            return (
                <img
                    className="coin-logo img-fluid"
                    alt="Bitcoin Logo"
                    src={BitcoinLogo}
                    title="Bitcoin"
                />
            )
        case 'dogecoin':
            return (
                <img
                    className="coin-logo img-fluid"
                    alt="Dogecoin Logo"
                    src={DogecoinLogo}
                    title="Dogecoin"
                />
            )
        case 'monero':
            return (
                <img
                    className="coin-logo img-fluid"
                    alt="Monero Logo"
                    src={MoneroLogo}
                    title="Monero"
                />
            )
        default:
            return (
                <img
                    className="coin-logo img-fluid"
                    alt="Bitcoin Logo"
                    src={BitcoinLogo}
                    title="Bitcoin"
                />
            )
    }
}

export default CoinLogo
