import { atom } from 'jotai'

import { PaymentData } from 'api/paymentForm'

export interface ProjectInfo {
    id: string
    enabled_currency?: string[]
    domain_name?: string
    is_non_profit?: boolean
}

export interface ProjectError {
    errorCode: string
    reason: string
}

export interface FormInfo {
    id: string
    amount_requested: number
    fiat_currency: string
}

export const projectInfoAtom = atom<ProjectInfo | null>(null)
export const projectErrorAtom = atom<ProjectError | null>(null)
export const formInfoAtom = atom<FormInfo | null>(null)
export const paymentDatasAtom = atom<PaymentData[]>([])
