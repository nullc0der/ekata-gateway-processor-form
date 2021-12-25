import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'

import { ProjectInfo, formInfoAtom, projectErrorAtom } from 'store'
import { getFormInfo } from 'api/paymentForm'
import SelectCurrency from 'components/SelectCurrency'
import Payment from 'components/Payment'
import PaymentSuccess from 'components/PaymentSuccess'

interface MainProps {
    projectInfo: ProjectInfo | null
    formID: string
}

const Main = ({ projectInfo, formID }: MainProps) => {
    const [currentStep, setCurrentStep] = useState<
        'selectCurrency' | 'payment' | 'paymentSuccess'
    >('selectCurrency')
    const [selectedCurrency, setSelectedCurrency] = useState('')
    const [formInfo, setFormInfo] = useAtom(formInfoAtom)
    const [, setProjectError] = useAtom(projectErrorAtom)

    useEffect(() => {
        if (formID.length) {
            getFormInfo(formID).then((response) => {
                if (response.ok && response.data) {
                    setFormInfo(response.data)
                } else {
                    if (response.status === 404) {
                        setProjectError({
                            errorCode: '-103',
                            reason: 'Form id is invalid',
                        })
                    }
                }
            })
        }
    }, [formID, setFormInfo, setProjectError])

    const onClickCurrency = (selectedCurrency: string) => {
        setSelectedCurrency(selectedCurrency)
        setCurrentStep('payment')
    }

    switch (currentStep) {
        case 'selectCurrency':
            return (
                <SelectCurrency
                    currencyList={projectInfo?.enabled_currency}
                    onClickCurrency={onClickCurrency}
                    formInfo={formInfo}
                />
            )
        case 'payment':
            return (
                <Payment
                    selectedCurrency={selectedCurrency}
                    onClickBack={() => setCurrentStep('selectCurrency')}
                    setCurrentStep={setCurrentStep}
                />
            )
        case 'paymentSuccess':
            return <PaymentSuccess selectedCurrency={selectedCurrency} />
    }
}

export default Main
