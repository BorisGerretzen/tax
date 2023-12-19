import {useMemo, useState} from "react";
import {calculateIncomeTax, IncomeTaxCalculationParameters} from "./scripts/incomeTax.ts";
import {IncomeCalculationForm} from "./components/incomeCalculationForm.tsx";
import {IncomeTaxTable} from "./components/incomeTaxTable.tsx";
import {Footer} from "./components/Footer.tsx";
import {useLocalization} from "./localization/localizationContext.tsx";

export const Content = () => {
    const {getString} = useLocalization()
    const [input, setInput] = useState<IncomeTaxCalculationParameters | null>(null)

    const result = useMemo(() => {
        if (input) {
            return calculateIncomeTax(input)
        }
        return null
    }, [input])

    return (
        <div class="d-flex flex-column h-100">
            <main class="flex-shrink-0">
                <div class="container mb-5">
                    <h2>{getString("calculateIncomeTax")}</h2>
                    <IncomeCalculationForm onParametersChange={input => setInput(input)}/>
                    <div class="mt-2">
                        {(result && input) ? <IncomeTaxTable result={result} input={input}/> : <></>}
                    </div>
                </div>
            </main>
            <footer class="footer mt-auto py-3 bg-light">
                <Footer/>
            </footer>
        </div>
    )
}