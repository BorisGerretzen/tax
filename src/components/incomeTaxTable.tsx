import {IncomeTaxCalculationParameters, IncomeTaxResult} from "../scripts/incomeTax.ts";
import {useLocalization} from "../localization/localizationContext.tsx";

export type IncomeTaxTableProps = {
    input: IncomeTaxCalculationParameters
    result: IncomeTaxResult
}

const formatCurrency = (amount: string | number) => {
    return `€${amount}`
}

const Row = ({label, value}: { label: string, value: number }) => {
    const {locale} = useLocalization()

    return (
        <div className="row">
            <div className="col-8">
                <b>{label}</b>
            </div>
            <div className="col-4">
                {formatCurrency(value.toLocaleString(locale))}
            </div>
        </div>
    )
}

export const IncomeTaxTable = ({input, result}: IncomeTaxTableProps) => {
    const {getString} = useLocalization()

    return (
        <div class="row">
            <div class="col-md-6 col-12">
                <h3>{getString("gross")}</h3>
                <Row label={getString("yearlyIncome")} value={result.grossYearlyIncome}/>
                <Row label={getString("monthlyIncome")} value={input.incomePerMonth}/>
                <Row label={getString("holidayAllowanceAndBonus")} value={result.grossHolidayAllowanceAndBonus}/>
            </div>
            <div class="col-md-6 col-12 mt-2 mt-md-0">
                <h3>{getString("net")}</h3>
                <Row label={getString("yearlyIncome")} value={result.netYearlyIncome}/>
                <Row label={getString("monthlyIncome")} value={result.netMonthlyIncome}/>
                <Row label={getString("holidayAllowanceAndBonus")} value={result.netHolidayAllowanceAndBonus}/>
            </div>
        </div>
    )
}