import {useState} from "react";
import {calculateIncomeTax, IncomeTaxResult} from "./scripts/incomeTax.ts";
import {IncomeCalculationForm} from "./components/incomeCalculationForm.tsx";
import {IncomeTaxTable} from "./components/incomeTaxTable.tsx";
import {Footer} from "./components/Footer.tsx";
import {useLocalization} from "./localization/localizationContext.tsx";

export const Content = () => {
    const {getString} = useLocalization()
    const [incomeTaxResult, setIncomeTaxResult] = useState<IncomeTaxResult | null>(null)

    return (
        <div class="d-flex flex-column h-100">
            <main class="flex-shrink-0">
                <div class="container mb-5">
                    <h2>{getString("calculateIncomeTax")}</h2>
                    <IncomeCalculationForm
                        onParametersChange={calculation => {
                            const incomeTaxResult = calculateIncomeTax(calculation)
                            console.log(incomeTaxResult)
                            setIncomeTaxResult(incomeTaxResult)
                        }}/>

                    {incomeTaxResult ? <IncomeTaxTable result={incomeTaxResult}/> : <></>}
                </div>
            </main>
            <footer class="footer mt-auto py-3 bg-light">
                <Footer/>
            </footer>
        </div>
    )
}