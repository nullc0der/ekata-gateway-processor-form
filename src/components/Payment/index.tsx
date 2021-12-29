import { useEffect, useRef, useState } from 'react'
import { useAtom } from 'jotai'
import { Form, InputGroup, Overlay, Spinner, Tooltip } from 'react-bootstrap'
import CopyToClipboard from 'react-copy-to-clipboard'
import QRCode from 'react-qr-code'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'

import {
    formInfoAtom,
    projectInfoAtom,
    projectErrorAtom,
    paymentDatasAtom,
} from 'store'
import { createPayment, getPaymentStatus } from 'api/paymentForm'
import { currencyExtraInfo } from 'components/SelectCurrency/currencyExtraInfo'
import { useInterval } from 'hooks/useInterval'
import { paymentStatus } from 'constants/paymentStatus'

interface PaymentProps {
    selectedCurrency: string
    onClickBack: () => void
    setCurrentStep: (
        currentStep: 'selectCurrency' | 'payment' | 'paymentSuccess'
    ) => void
}

const Payment = ({
    selectedCurrency,
    onClickBack,
    setCurrentStep,
}: PaymentProps) => {
    const [showAmountCopied, setShowAmountCopied] = useState(false)
    const [showAddressCopied, setShowAddressCopied] = useState(false)
    const [showAmountLeftToSendCopied, setShowAmountLeftToSendCopied] =
        useState(false)
    const [paymentDatas, setPaymentDatas] = useAtom(paymentDatasAtom)
    const [projectInfo] = useAtom(projectInfoAtom)
    const [formInfo] = useAtom(formInfoAtom)
    const [, setProjectError] = useAtom(projectErrorAtom)
    const amountCopiedTooltipTarget = useRef(null)
    const addressCopiedTooltipTarget = useRef(null)
    const amountLeftToSendTooltipTarget = useRef(null)

    const paymentData = find(paymentDatas, {
        currency_name: selectedCurrency,
    })

    useEffect(() => {
        if (projectInfo && formInfo && selectedCurrency.length) {
            if (isEmpty(paymentData)) {
                createPayment({
                    project_id: projectInfo.id,
                    form_id: formInfo.id,
                    currency_name: selectedCurrency,
                }).then((response) => {
                    if (response.ok && response.data) {
                        setPaymentDatas([...paymentDatas, response.data])
                    } else {
                        if (response.status === 500) {
                            setProjectError({
                                errorCode: '-104',
                                reason: 'Failed to create wallet address',
                            })
                        }
                        if (response.status === 404) {
                            setProjectError({
                                errorCode: '-103',
                                reason: 'Form id is invalid',
                            })
                        }
                        if (response.status === 400) {
                            setProjectError({
                                errorCode: '-105',
                                reason: 'Project and form ID mismatch',
                            })
                        }
                        if (response.problem) {
                            setProjectError({
                                errorCode: '-104',
                                reason: 'Failed to create wallet address',
                            })
                        }
                    }
                })
            }
        }
    }, [
        projectInfo,
        formInfo,
        paymentData,
        paymentDatas,
        selectedCurrency,
        setProjectError,
        setPaymentDatas,
    ])

    useInterval(
        () =>
            getPaymentStatus(
                formInfo?.id || '',
                paymentData?.payment_id || ''
            ).then((response) => {
                if (response.ok && response.data) {
                    const datas = paymentDatas.map((x) =>
                        x.payment_id === response.data?.payment_id
                            ? response.data
                            : x
                    )
                    setPaymentDatas(datas)
                    if (
                        response.data.status !== paymentStatus.PENDING &&
                        response.data.signature
                    ) {
                        setCurrentStep('paymentSuccess')
                    }
                }
            }),
        paymentData?.wallet_address ? 5000 : null
    )

    return (
        <div
            className={`d-flex flex-column align-items-center ${
                paymentData
                    ? 'justify-content-between'
                    : 'justify-content-center'
            } h-100 p-4`}>
            {paymentData ? (
                <>
                    <div className="qr-wrapper">
                        <QRCode
                            value={encodeURIComponent(
                                `${paymentData.currency_name}:${
                                    paymentData.wallet_address
                                }?amount=${
                                    Number(
                                        (paymentData.amount_requested || 0) -
                                            (paymentData.amount_received || 0)
                                    ).toFixed(8) || paymentData.amount_requested
                                }`
                            )}
                            size={128}
                        />
                    </div>
                    <div className="payment-info">
                        <div className="text-center mt-4">
                            {!!formInfo && (
                                <h6>
                                    Send{' '}
                                    {projectInfo?.is_non_profit
                                        ? 'donation'
                                        : 'payment'}{' '}
                                    of{' '}
                                    {(formInfo.amount_requested / 100).toFixed(
                                        2
                                    )}{' '}
                                    {formInfo.fiat_currency.toUpperCase()} in
                                    crypto
                                </h6>
                            )}
                            <span>
                                Send{' '}
                                {
                                    currencyExtraInfo[paymentData.currency_name]
                                        .ticker
                                }{' '}
                                to the address below
                            </span>
                        </div>
                        <InputGroup className="mt-2">
                            <InputGroup.Text>Address</InputGroup.Text>
                            <Form.Control
                                type="text"
                                disabled
                                value={`${paymentData.wallet_address}`}
                            />
                            <CopyToClipboard
                                text={`${paymentData.wallet_address}`}
                                onCopy={() =>
                                    setShowAddressCopied(!showAddressCopied)
                                }>
                                <InputGroup.Text
                                    ref={addressCopiedTooltipTarget}
                                    style={{ cursor: 'pointer' }}>
                                    Copy
                                </InputGroup.Text>
                            </CopyToClipboard>
                        </InputGroup>
                        <InputGroup className="mt-2">
                            <InputGroup.Text>Total Amount</InputGroup.Text>
                            <Form.Control
                                type="text"
                                disabled
                                value={`${paymentData.amount_requested} ${
                                    currencyExtraInfo[paymentData.currency_name]
                                        .ticker
                                }`}
                            />
                            {!paymentData.amount_received && (
                                <CopyToClipboard
                                    text={`${paymentData.amount_requested}`}
                                    onCopy={() =>
                                        setShowAmountCopied(!showAmountCopied)
                                    }>
                                    <InputGroup.Text
                                        ref={amountCopiedTooltipTarget}
                                        style={{ cursor: 'pointer' }}>
                                        Copy
                                    </InputGroup.Text>
                                </CopyToClipboard>
                            )}
                        </InputGroup>
                        {!!paymentData.amount_received && (
                            <>
                                <InputGroup className="mt-2">
                                    <InputGroup.Text>
                                        Amount Received
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        disabled
                                        value={`${
                                            paymentData.amount_received?.toFixed(
                                                8
                                            ) || Number(0).toFixed(8)
                                        } ${
                                            currencyExtraInfo[
                                                paymentData.currency_name
                                            ].ticker
                                        }`}
                                    />
                                </InputGroup>
                                <InputGroup className="mt-2">
                                    <InputGroup.Text>
                                        Amount Left to Send
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        disabled
                                        value={`${
                                            Number(
                                                (paymentData.amount_requested ||
                                                    0) -
                                                    (paymentData.amount_received ||
                                                        0)
                                            ).toFixed(8) ||
                                            paymentData.amount_requested
                                        } ${
                                            currencyExtraInfo[
                                                paymentData.currency_name
                                            ].ticker
                                        }`}
                                    />
                                    <CopyToClipboard
                                        text={`${
                                            Number(
                                                (paymentData.amount_requested ||
                                                    0) -
                                                    (paymentData.amount_received ||
                                                        0)
                                            ).toFixed(8) ||
                                            paymentData.amount_requested
                                        }`}
                                        onCopy={() =>
                                            setShowAmountLeftToSendCopied(
                                                !showAmountLeftToSendCopied
                                            )
                                        }>
                                        <InputGroup.Text
                                            ref={amountLeftToSendTooltipTarget}
                                            style={{ cursor: 'pointer' }}>
                                            Copy
                                        </InputGroup.Text>
                                    </CopyToClipboard>
                                </InputGroup>
                            </>
                        )}
                        <Overlay
                            target={amountCopiedTooltipTarget.current}
                            show={showAmountCopied}
                            onHide={() =>
                                setShowAmountCopied(!showAmountCopied)
                            }
                            rootClose={true}
                            placement="bottom">
                            {(props) => (
                                <Tooltip {...props}>Amount Copied</Tooltip>
                            )}
                        </Overlay>
                        <Overlay
                            target={addressCopiedTooltipTarget.current}
                            show={showAddressCopied}
                            onHide={() =>
                                setShowAddressCopied(!showAddressCopied)
                            }
                            rootClose={true}
                            placement="bottom">
                            {(props) => (
                                <Tooltip {...props}>Address Copied</Tooltip>
                            )}
                        </Overlay>
                        <Overlay
                            target={amountLeftToSendTooltipTarget.current}
                            show={showAmountLeftToSendCopied}
                            onHide={() =>
                                setShowAmountLeftToSendCopied(
                                    !showAmountLeftToSendCopied
                                )
                            }
                            rootClose={true}
                            placement="bottom">
                            {(props) => <Tooltip {...props}>Copied</Tooltip>}
                        </Overlay>
                        <div className="text-center mt-4">
                            <span className="me-2">
                                Checking{' '}
                                {projectInfo?.is_non_profit
                                    ? 'donation'
                                    : 'payment'}{' '}
                                status
                            </span>
                            <Spinner
                                animation="grow"
                                size="sm"
                                variant="secondary"
                            />
                        </div>
                    </div>
                    <div className="footer">
                        <div className="text-center">
                            <p className="text-muted mb-2">
                                Exchange rates sync every five minutes
                            </p>
                            {!paymentData.amount_received && (
                                <p
                                    style={{
                                        fontWeight: 'bold',
                                        marginBottom: 0,
                                        cursor: 'pointer',
                                    }}
                                    onClick={onClickBack}>
                                    Back
                                </p>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center mt-4">
                    <span className="me-2">
                        Fetching{' '}
                        {projectInfo?.is_non_profit ? 'donation' : 'payment'}{' '}
                        address
                    </span>
                    <Spinner animation="grow" size="sm" variant="secondary" />
                </div>
            )}
        </div>
    )
}

export default Payment
