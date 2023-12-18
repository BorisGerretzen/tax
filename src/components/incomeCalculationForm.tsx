import {useForm} from "react-hook-form";
import "../assets/incomeCalculationForm.css"
import {useEffect} from "preact/compat";
import {IncomeTaxCalculationParameters} from "../scripts/incomeTax.ts";
import {useLocalization} from "../localization/localizationContext.tsx";


export type IncomeTaxCalculationProps = {
    parameters?: IncomeTaxCalculationParameters
    onParametersChange?: (calculation: IncomeTaxCalculationParameters) => void
}

const InvalidField = () => {
    const {getString} = useLocalization()

    return (
        <div class="invalid-feedback">
            {getString("thisFieldIsRequired")}
        </div>
    )
}

export const IncomeCalculationForm = (props: IncomeTaxCalculationProps) => {
    const {getString} = useLocalization()

    const {
        register,
        handleSubmit,
        trigger,
        watch,
        formState: {errors},
    } = useForm<IncomeTaxCalculationParameters>({
        mode: "all",
        defaultValues: {
            holidayAllowancePercentage: 8,
            ...props.parameters
        }
    });

    const onSubmit = (data: IncomeTaxCalculationParameters) => {
        props.onParametersChange?.(data)
    }

    useEffect(() => {
        trigger("incomePerMonth");
    }, [])

    useEffect(() => {
        const subscription = watch(handleSubmit(onSubmit));
        return () => subscription.unsubscribe();
    }, [handleSubmit, watch]);


    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div class="row income-tax-row">
                    <div>
                        <label for="incomePerMonth" class="form-label">{getString("grossMonthlyIncome")}</label>
                        <input
                            class={"form-control " + (errors.incomePerMonth ? " is-invalid" : "is-valid")}
                            type={"number"}
                            {...register("incomePerMonth", {required: true, valueAsNumber: true})}
                        />
                        {errors.incomePerMonth && <InvalidField/>}
                    </div>
                    <div>
                        <label for="holidayAllowancePercentage"
                               class="form-label">{getString("holidayAllowance")}</label>
                        <input
                            class={"form-control " + (errors.holidayAllowancePercentage ? " is-invalid" : "is-valid")}
                            type={"number"}
                            {...register("holidayAllowancePercentage", {required: true, valueAsNumber: true})}
                        />
                        {errors.holidayAllowancePercentage && <InvalidField/>}
                    </div>
                    <div>
                        <label for="bonus" class="form-label">{getString("bonus")}</label>
                        <input
                            class={"form-control " + (errors.bonus ? " is-invalid" : "is-valid")}
                            type={"number"}
                            {...register("bonus", {valueAsNumber: true})}
                        />
                        {errors.bonus && <InvalidField/>}
                    </div>
                    <div>
                        <label for="year" class="form-label">{getString("year")}</label>
                        <select
                            class={"form-control " + (errors.year ? " is-invalid" : "is-valid")}
                            {...register("year", {required: true, valueAsNumber: true})}
                        >
                            <option value="2023">2023</option>
                        </select>
                        {errors.year && <InvalidField/>}
                    </div>
                </div>
            </form>
        </>
    )
}