import { Card } from 'react-bootstrap'
import { useAtom } from 'jotai'

import { paymentDataAtom, projectInfoAtom } from 'store'
import { sendMessageToParent } from 'utils/common'

const PaymentSuccess = () => {
    const [paymentData] = useAtom(paymentDataAtom)
    const [projectInfo] = useAtom(projectInfoAtom)

    const onClickDone = () => {
        sendMessageToParent(projectInfo, { type: 'USER_CLICK_DONE' })
    }

    return (
        <div className="d-flex flex-column h-100 p-4">
            <div className="text-center mb-4">
                <p style={{ fontWeight: 'bold' }}>Payment Completed</p>
                <p style={{ fontSize: '2rem' }}>🎉</p>
            </div>
            {!!paymentData && (
                <Card bg="light">
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
            )}
            <div className="flex-1" />
            <p
                style={{
                    fontWeight: 'bold',
                    marginBottom: 0,
                    cursor: 'pointer',
                    textAlign: 'center',
                }}
                onClick={onClickDone}>
                Done
            </p>
        </div>
    )
}

export default PaymentSuccess
