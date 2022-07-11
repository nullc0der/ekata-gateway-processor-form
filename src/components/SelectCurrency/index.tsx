import classnames from 'classnames'
import { useAtom } from 'jotai'

import { FormInfo, projectInfoAtom } from 'store'
import CoinLogo from 'components/CoinLogo'
import s from './SelectCurrency.module.scss'
import { currencyExtraInfo } from './currencyExtraInfo'
import Footer from 'components/Footer'

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
    const [projectInfo] = useAtom(projectInfoAtom)

    return (
        <div className={cx}>
            {formInfo && (
                <h5 className="mt-2 text-center">
                    Amount to send is about equivalent to{' '}
                    {(formInfo.amount_requested / 100).toFixed(2)}
                </h5>
            )}
            <div className="payment-types">
                <div className="text-center mb-3">
                    <span className="text-muted">
                        Select{' '}
                        {projectInfo?.is_non_profit ? 'donation' : 'payment'}{' '}
                        method
                    </span>
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
            <Footer />
        </div>
    )
}

export default SelectCurrency
