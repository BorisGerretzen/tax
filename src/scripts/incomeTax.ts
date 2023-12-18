export type IncomeTaxCalculationParameters = {
    year: number,
    incomePerMonth: number
    holidayAllowancePercentage: number
    bonus?: number
}

export type IncomeTaxResult = {
    year: number
    totalGrossIncome: number
    taxedPerBracket: number[]
    exemptions: { [name: string]: number }
    totalTaxed: number
    totalNetIncome: number
    netMonthlyIncome: number
    netHolidayAllowance: number
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

export type TaxEnvironment = {
    taxBrackets: TaxBracket[]
    taxExemptions: TaxExemption[]
}

const taxEnvironments: { [year: number]: TaxEnvironment } = {
    2023: {
        taxBrackets: [
            {
                to: 37149,
                percentage: 36.93
            },
            {
                percentage: 49.5
            }
        ],
        taxExemptions: [
            {
                name: "Arbeidskorting",
                scales: [
                    {
                        to: 10741,
                        baseAmount: 0,
                        percentage: 8.231
                    },
                    {
                        to: 23201,
                        baseAmount: 884,
                        percentage: 29.861,
                        incomeReduction: 10741,
                    },
                    {
                        to: 37691,
                        baseAmount: 4605,
                        percentage: 3.085,
                        incomeReduction: 23201,
                    },
                    {
                        to: 115295,
                        baseAmount: 5052,
                        percentage: -6.51,
                        incomeReduction: 37691,
                    }
                ]
            },
            {
                name: "Algemene heffingskorting",
                reduceOnOverflow: true,
                scales: [
                    {
                        to: 22661,
                        percentage: 0,
                        baseAmount: 3070
                    },
                    {
                        to: 73031,
                        baseAmount: 3070,
                        percentage: -6.095,
                        incomeReduction: 22661
                    }
                ]
            }
        ]
    }
}

/**
 * Calculates the tax per bracket for a given gross income
 * @param grossIncome The gross income
 * @param taxBrackets The tax brackets to calculate
 */
const calculateTaxPerBracket = (grossIncome: number, taxBrackets: TaxBracket[]): number[] => {
    const taxPerBracket: number[] = [];
    let remainingIncome = grossIncome;

    for (const bracket of taxBrackets) {
        const taxableAmount = bracket.to ? Math.min(bracket.to, remainingIncome) : remainingIncome;
        const tax = (taxableAmount * bracket.percentage) / 100;
        taxPerBracket.push(tax);
        remainingIncome -= taxableAmount;

        if (remainingIncome <= 0) {
            break;
        }
    }

    return taxPerBracket;
};

/**
 * Calculates the exemptions for a given gross income
 * @param grossIncome The gross income
 * @param taxExemptions The exemptions to calculate
 * @param totalTax The total tax burden for the given income
 */
const calculateExemptions = (
    grossIncome: number,
    taxExemptions: TaxExemption[], totalTax: number
): { [name: string]: number } => {
    const exemptionResults: { [name: string]: number } = {}
    let totalExempted = 0

    // Sort exemptions by reduceOnOverflow, so we can apply them in the correct order
    const orderedExemptions = taxExemptions.sort((a, b) => (a.reduceOnOverflow ? 1 : 0) - (b.reduceOnOverflow ? 1 : 0))
    for (const exemption of orderedExemptions) {
        const exemptionScale = exemption.scales.find(scale => (scale.to || 1e100) >= grossIncome)

        // If we overflow the scale, we don't get any exemption
        if (!exemptionScale) {
            exemptionResults[exemption.name] = 0
            continue
        }

        // Calculate the exemption
        const {incomeReduction = 0, percentage, baseAmount} = exemptionScale
        const result = baseAmount + (grossIncome - incomeReduction) * percentage / 100

        // If we get more discount than we have to pay, we don't get any more discount
        if (exemption.reduceOnOverflow && (totalExempted + result) > totalTax) {
            exemptionResults[exemption.name] = totalTax - totalExempted
            continue
        }

        exemptionResults[exemption.name] = result
        totalExempted += result
    }

    return exemptionResults
}

export const calculateIncomeTax = (
    params: IncomeTaxCalculationParameters,
    taxEnvironment?: TaxEnvironment
): IncomeTaxResult => {
    const holidayAllowanceFraction = params.holidayAllowancePercentage / 100

    const basicWage = params.incomePerMonth * 12
    const grossIncome = basicWage * (1 + holidayAllowanceFraction) + (params.bonus || 0)

    const {taxBrackets, taxExemptions} = taxEnvironment || taxEnvironments[params.year]

    // Calculate taxes
    const taxPerBracket = calculateTaxPerBracket(grossIncome, taxBrackets)
    const totalTax = taxPerBracket.reduce((total, bracket) => total + bracket, 0)

    // Calculate exemptions
    const exemptionResults = calculateExemptions(grossIncome, taxExemptions, totalTax)
    const totalExemptions = Object.values(exemptionResults).reduce((total, exemption) => total + exemption, 0)

    // Calculate derived values
    const netYearlyIncome = grossIncome - totalTax + totalExemptions
    const netHolidayAllowance = netYearlyIncome / (1 + holidayAllowanceFraction) * holidayAllowanceFraction
    const netMonthlyIncome = (netYearlyIncome - netHolidayAllowance) / 12

    return {
        year: params.year,
        totalGrossIncome: Math.ceil(grossIncome),
        taxedPerBracket: taxPerBracket.map(tax => Math.floor(tax)),
        totalTaxed: Math.floor(totalTax),
        exemptions: exemptionResults,
        totalNetIncome: Math.ceil(netYearlyIncome),
        netMonthlyIncome: Math.ceil(netMonthlyIncome),
        netHolidayAllowance: Math.ceil(netHolidayAllowance)
    }
}