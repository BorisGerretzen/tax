import {roundDown, roundUp, sum} from "./helpers.ts";
import {TaxBracket, TaxEnvironment, taxEnvironments, TaxExemption} from "./taxEnvironment.ts"

export type IncomeTaxResult = {
    year: number

    grossYearlyIncome: number
    grossHolidayAllowanceAndBonus: number

    netYearlyIncome: number
    netMonthlyIncome: number
    netHolidayAllowanceAndBonus: number

    taxedPerBracket: number[]
    exemptions: ExemptionResult[]
    totalTaxed: number
}

export type IncomeTaxCalculationParameters = {
    year: number,
    incomePerMonth: number
    holidayAllowancePercentage: number
    bonus?: number
}

type ExemptionResult = {
    name: string
    amount: number
}

type IncomeTaxIntermediate = {
    totalGrossIncome: number,
    totalNetIncome: number,
    exemptions: ExemptionResult[],
    taxedPerBracket: number[]
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
): ExemptionResult[] => {
    const exemptionResults: ExemptionResult[] = []
    let totalExempted = 0

    // Sort exemptions by reduceOnOverflow, so we can apply them in the correct order
    const orderedExemptions = taxExemptions.sort((a, b) => (a.reduceOnOverflow ? 1 : 0) - (b.reduceOnOverflow ? 1 : 0))
    for (const exemption of orderedExemptions) {
        const exemptionScale = exemption.scales.find(scale => (scale.to || 1e100) >= grossIncome)

        // If we overflow the scale, we don't get any exemption
        if (!exemptionScale) {
            exemptionResults.push({name: exemption.name, amount: 0})
            continue
        }

        // Calculate the exemption
        const {incomeReduction = 0, percentage, baseAmount} = exemptionScale
        const result = baseAmount + (grossIncome - incomeReduction) * percentage / 100

        // If we get more discount than we have to pay, we don't get any more discount
        if (exemption.reduceOnOverflow && (totalExempted + result) > totalTax) {
            exemptionResults.push({name: exemption.name, amount: totalTax - totalExempted})
            continue
        }

        exemptionResults.push({name: exemption.name, amount: result})
        totalExempted += result
    }

    return exemptionResults
}

/**
 * Calculates the income tax for a given gross income
 * @param gross The gross income
 * @param taxEnvironment The tax environment to calculate the tax in
 */
const calculate = (
    gross: number,
    taxEnvironment: TaxEnvironment
): IncomeTaxIntermediate => {
    const {taxBrackets, taxExemptions} = taxEnvironment

    // Calculate taxes
    const taxPerBracket = calculateTaxPerBracket(gross, taxBrackets)
    const totalTax = taxPerBracket.reduce((total, bracket) => total + bracket, 0)

    // Calculate exemptions
    const exemptionResults = calculateExemptions(gross, taxExemptions, totalTax)
    const totalExemptions = sum(exemptionResults.map(exemption => exemption.amount))

    return {
        totalGrossIncome: gross,
        totalNetIncome: gross - totalTax + totalExemptions,
        taxedPerBracket: taxPerBracket,
        exemptions: exemptionResults
    }
}

/**
 * Calculates the income tax for a given gross income
 * @param params The parameters to calculate the tax for
 * @param taxEnvironment (optional) The tax environment to calculate the tax in, defaults to the tax environment for the given year
 */
export const calculateIncomeTax = (
    params: IncomeTaxCalculationParameters,
    taxEnvironment?: TaxEnvironment
): IncomeTaxResult => {
    taxEnvironment = taxEnvironment || taxEnvironments[params.year]
    const holidayAllowancePercentage = params.holidayAllowancePercentage / 100

    const basicWage = params.incomePerMonth * 12
    const grossHolidayAllowanceAndBonus = basicWage * holidayAllowancePercentage + (params.bonus || 0)
    const grossIncome = basicWage + grossHolidayAllowanceAndBonus

    const withBonus = calculate(grossIncome, taxEnvironment)
    const withoutBonus = calculate(basicWage, taxEnvironment)

    const netHolidayAllowance = withBonus.totalNetIncome - withoutBonus.totalNetIncome
    const netMonthlyIncome = (withBonus.totalNetIncome - netHolidayAllowance) / 12

    return {
        year: params.year,
        grossYearlyIncome: roundUp(withBonus.totalGrossIncome),
        grossHolidayAllowanceAndBonus: roundUp(grossHolidayAllowanceAndBonus),
        taxedPerBracket: withBonus.taxedPerBracket.map(tax => roundDown(tax)),
        totalTaxed: roundDown(sum(withBonus.taxedPerBracket)),
        exemptions: withBonus.exemptions.map(exemption => ({
            name: exemption.name,
            amount: roundDown(exemption.amount)
        })),
        netYearlyIncome: roundUp(withBonus.totalNetIncome),
        netMonthlyIncome: roundUp(netMonthlyIncome),
        netHolidayAllowanceAndBonus: roundUp(netHolidayAllowance)
    }
}