import { jsonAPI, apiBase } from './base'

import { FormInfo } from 'store'

export interface CreatePaymentData {
    currency_name: string
    project_id: string
    form_id: string
}

export interface PaymentData {
    currency_name: string
    payment_id: string
    wallet_address: string
    amount_requested?: number
    amount_received?: number
    tx_ids?: string[]
    created_on?: Date
    status?: string
    form_id?: string
    signature?: string
}

export const getFormInfo = (formID: string) => {
    return jsonAPI(apiBase).get<FormInfo>(
        `/payment-form/get-form-info?form-id=${formID}`
    )
}

export const createPayment = (data: CreatePaymentData) => {
    return jsonAPI(apiBase).post<PaymentData>(
        '/payment-form/payment/create',
        data
    )
}

export const getPaymentStatus = (formID: string, paymentID: string) => {
    return jsonAPI(apiBase).get<PaymentData>(
        `/payment-form/payment/get-payment-status?form-id=${formID}&payment-id=${paymentID}`
    )
}
