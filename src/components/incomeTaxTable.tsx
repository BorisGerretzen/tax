import {IncomeTaxCalculationParameters, IncomeTaxResult} from "../scripts/incomeTax.ts";
import {useLocalization} from "../localization/localizationContext.tsx";

export type IncomeTaxTableProps = {
    input: IncomeTaxCalculationParameters
    result: IncomeTaxResult
}

const formatCurrency = (amount: number) => {
    const {locale} = useLocalization()

    if (amount < 0) {
        return `-€${Math.abs(amount).toLocaleString(locale)}`
    }

    return `€${amount.toLocaleString(locale)}`
}

const Row = (props: {
    label: string,
    value: number,
    difference?: number,
    formatter?: (amount: number) => string
}) => {
    const formatter = props.formatter || formatCurrency

    return (
        <div className="row">
            <div className="col-7 ">
                <b>{props.label}</b>
            </div>
            <div className="col-5 ">
                <div class="row">
                    <div class={props.difference ? "col-6" : "col-12"}>
                        {formatter(props.value)}
                    </div>
                    {props.difference ?
                        <div class="col-6">
                            <span style={{color: "red"}}> {formatter(props.difference)}</span>
                        </div>
                        : null}
                </div>
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
                <Row label={getString("yearlyIncome")} value={result.netYearlyIncome}
                     difference={result.netYearlyIncome - result.grossYearlyIncome}
                />
                <Row label={getString("monthlyIncome")} value={result.netMonthlyIncome}
                     difference={result.netMonthlyIncome - input.incomePerMonth}
                />
                <Row label={getString("holidayAllowanceAndBonus")} value={result.netHolidayAllowanceAndBonus}
                     difference={result.netHolidayAllowanceAndBonus - result.grossHolidayAllowanceAndBonus}
                />
                <Row label={getString("taxPercentage")}
                     value={100 - result.netYearlyIncome / result.grossYearlyIncome * 100}
                     formatter={amount => amount.toFixed(2) + "%"}
                />
            </div>
        </div>
    )
}