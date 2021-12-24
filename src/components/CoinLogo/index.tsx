import BitcoinLogo from 'cryptocurrency-icons/svg/color/btc.svg'
import DogecoinLogo from 'cryptocurrency-icons/svg/color/doge.svg'
import MoneroLogo from 'cryptocurrency-icons/svg/color/xmr.svg'
import BazaLogo from 'assets/svg/baza_logo.svg'

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
        case 'baza':
            return (
                <img
                    className="coin-logo img-fluid"
                    alt="Baza Logo"
                    src={BazaLogo}
                    title="Baza"
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
