import {IncomeTaxResult} from "../scripts/incomeTax.ts";

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
    return (
        <div class="row">
            <div className="col-12">
                <Row label={"Gross yearly income"} value={result.totalGrossIncome}/>
                <Row label={"Net yearly income"} value={result.totalNetIncome}/>
                <Row label={"Net monthly income"} value={result.netMonthlyIncome}/>
                <Row label={"Net holiday allowance"} value={result.netHolidayAllowance}/>
            </div>
        </div>
    )
}