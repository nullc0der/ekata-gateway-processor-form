import classnames from 'classnames'

import { FormInfo } from 'store'
import CoinLogo from 'components/CoinLogo'
import s from './SelectCurrency.module.scss'
import { currencyExtraInfo } from './currencyExtraInfo'

interface SelectCurrencyProps {
    currencyList?: string[]
    onClickCurrency: (selectedCurrency: string) => void
    formInfo: FormInfo | null
}

const SelectCurrency = ({
    currencyList,
    onClickCurrency,
    formInfo,
}: SelectCurrencyProps) => {
    const cx = classnames(s.container)
    return (
        <div className={cx}>
            {formInfo && (
                <h5 className="mt-2 text-center">
                    Pay {(formInfo.amount_requested / 100).toFixed(2)}{' '}
                    {formInfo.fiat_currency.toUpperCase()} in crypto
                </h5>
            )}
            <div className="payment-types">
                <div className="text-center mb-3">
                    <span className="text-muted">Select payment type</span>
                </div>
                {currencyList?.map((x, i) => (
                    <div
                        className="payment-type"
                        key={i}
                        onClick={() => onClickCurrency(x)}>
                        <CoinLogo currencyName={x} />
                        <span className="text-capitalize">
                            {x} ({currencyExtraInfo[x].ticker})
                        </span>
                        <div className="flex-1" />
                        <span className="material-icons">chevron_right</span>
                    </div>
                ))}
            </div>
            <span className="text-muted text-center">
                Exchange rates syncs every five minutes
            </span>
        </div>
    )
}

export default SelectCurrency
