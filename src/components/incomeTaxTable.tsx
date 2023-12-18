import {IncomeTaxResult} from "../scripts/incomeTax.ts";
import {useLocalization} from "../localization/localizationContext.tsx";

export type IncomeTaxTableProps = {
    result: IncomeTaxResult
}

const formatCurrency = (amount: number) => {
    return `€${amount}`
}

const Row = ({label, value}: { label: string, value: number }) => {
    return (
        <div className="row">
            <div className="col-8">
                <b>{label}</b>
            </div>
            <div className="col-4">
                {formatCurrency(value)}
            </div>
        </div>
    )
}

export const IncomeTaxTable = ({result}: IncomeTaxTableProps) => {
    const {getString} = useLocalization()

    return (
        <div class="row">
            <div className="col-12">
                <Row label={getString("grossYearlyIncome")} value={result.totalGrossIncome}/>
                <Row label={getString("netYearlyIncome")} value={result.totalNetIncome}/>
                <Row label={getString("netMonthlyIncome")} value={result.netMonthlyIncome}/>
                <Row label={getString("holidayAllowance")} value={result.netHolidayAllowance}/>
            </div>
        </div>
    )
}