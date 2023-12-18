import {IncomeCalculationForm} from "./components/incomeCalculationForm.tsx";
import {calculateIncomeTax, IncomeTaxResult} from "./scripts/incomeTax.ts";
import {useState} from "react";
import {IncomeTaxTable} from "./components/incomeTaxTable.tsx";

export function App() {
    const [incomeTaxResult, setIncomeTaxResult] = useState<IncomeTaxResult | null>(null)

    return (
        <>
            <div class="container mb-5">
                <h2>Calculate income tax</h2>
                <IncomeCalculationForm
                    onParametersChange={calculation => {
                        const incomeTaxResult = calculateIncomeTax(calculation)
                        console.log(incomeTaxResult)
                        setIncomeTaxResult(incomeTaxResult)
                    }}/>

                {incomeTaxResult ? <IncomeTaxTable result={incomeTaxResult}/> : <></>}
            </div>

            <div class="container">
                <h2>Calculate rent subsidy</h2>
            </div>
        </>
    )
}
