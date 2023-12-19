import taxEnvironmentsJson from "../assets/taxEnvironments.json";

export const taxEnvironments: { [year: number]: TaxEnvironment } = taxEnvironmentsJson

export type TaxEnvironment = {
    taxBrackets: TaxBracket[]
    taxExemptions: TaxExemption[],
}

export type TaxBracket = {
    to?: number
    percentage: number
}

export type TaxExemption = {
    name: string
    scales: TaxExemptionScale[]
    reduceOnOverflow?: boolean
}

export type TaxExemptionScale = {
    to?: number,
    baseAmount: number,
    percentage: number,
    incomeReduction?: number
}