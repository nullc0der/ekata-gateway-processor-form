import { useEffect, useState, lazy, Suspense } from 'react'
import { useAtom } from 'jotai'

import { ProjectInfo, formInfoAtom, projectErrorAtom } from 'store'
import { getFormInfo } from 'api/paymentForm'
import LoadingAnimation from 'components/LoadingAnimation'

const SelectCurrency = lazy(() => import('components/SelectCurrency'))
const Payment = lazy(() => import('components/Payment'))
const PaymentSuccess = lazy(() => import('components/PaymentSuccess'))

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
                <Suspense fallback={<LoadingAnimation />}>
                    <SelectCurrency
                        currencyList={projectInfo?.enabled_currency}
                        onClickCurrency={onClickCurrency}
                        formInfo={formInfo}
                    />
                </Suspense>
            )
        case 'payment':
            return (
                <Suspense fallback={<LoadingAnimation />}>
                    <Payment
                        selectedCurrency={selectedCurrency}
                        onClickBack={() => setCurrentStep('selectCurrency')}
                        setCurrentStep={setCurrentStep}
                    />
                </Suspense>
            )
        case 'paymentSuccess':
            return (
                <Suspense fallback={<LoadingAnimation />}>
                    <PaymentSuccess selectedCurrency={selectedCurrency} />
                </Suspense>
            )
    }
}

export default Main
