import { Card } from 'react-bootstrap'
import { useAtom } from 'jotai'
import CountDown, { CountdownRenderProps } from 'react-countdown'
import { ProgressBar } from 'react-bootstrap'
import find from 'lodash/find'

import { paymentDatasAtom, projectInfoAtom } from 'store'
import { sendMessageToParent } from 'utils/common'
import Footer from 'components/Footer'

const FORM_CLOSE_TIME = 2 * 60 * 1000

interface PaymentSuccessProps {
    selectedCurrency: string
}

const PaymentSuccess = ({ selectedCurrency }: PaymentSuccessProps) => {
    const [paymentDatas] = useAtom(paymentDatasAtom)
    const [projectInfo] = useAtom(projectInfoAtom)

    const paymentData = find(paymentDatas, {
        currency_name: selectedCurrency,
    })

    const closeForm = () => {
        sendMessageToParent(projectInfo, {
            type: 'PAYMENT_SUCCESS',
            payload: paymentData,
        })
    }

    const countDownRenderer = ({
        total,
        minutes,
        seconds,
    }: CountdownRenderProps) => (
        <>
            <ProgressBar now={(total / FORM_CLOSE_TIME) * 100} />
            <div className="text-center mt-2">
                <span>Form will close in</span>
                <h6 className="text-danger">
                    {!!minutes && `${minutes} minute`} {`${seconds} second`}
                </h6>
            </div>
        </>
    )

    return (
        <div className="d-flex flex-column h-100 p-4">
            <div className="text-center mb-4">
                <p style={{ fontWeight: 'bold' }}>
                    {projectInfo?.is_non_profit ? 'Donation' : 'Payment'}{' '}
                    Completed
                </p>
                <p style={{ fontSize: '2rem' }}>🎉</p>
            </div>
            {!!paymentData && (
                <>
                    <Card bg="light">
                        <Card.Header>
                            {projectInfo?.is_non_profit
                                ? 'Donation'
                                : 'Payment'}{' '}
                            ID
                        </Card.Header>
                        <Card.Body>{paymentData.payment_id}</Card.Body>
                    </Card>
                    <Card bg="light" className="mt-2">
                        <Card.Header>
                            Tx ID
                            {paymentData.tx_ids &&
                                paymentData.tx_ids.length > 1 &&
                                's'}
                        </Card.Header>
                        <Card.Body>
                            {paymentData.tx_ids?.map((x, i) => (
                                <Card.Text className="mb-0" key={i}>
                                    {x}
                                </Card.Text>
                            ))}
                        </Card.Body>
                    </Card>
                </>
            )}
            <div className="flex-1" />
            <CountDown
                date={Date.now() + FORM_CLOSE_TIME}
                renderer={countDownRenderer}
                onComplete={closeForm}
            />
            <Footer />
            <p
                style={{
                    fontWeight: 'bold',
                    marginBottom: 0,
                    cursor: 'pointer',
                    textAlign: 'center',
                }}
                onClick={closeForm}>
                Done
            </p>
        </div>
    )
}

export default PaymentSuccess
