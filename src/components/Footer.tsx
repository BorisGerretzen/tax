import {Locale, useLocalization} from "../localization/localizationContext.tsx";
import {GithubIcon, NlFlag, UkFlag} from "./Svg/Icons.tsx";
import {JSX} from "preact";

const LocaleFlag = (props: { locale: Locale }) => {
    const {setLocale} = useLocalization()

    const localeFlagMapping: { [K in Locale]: JSX.Element } = {
        "nl": <NlFlag/>,
        "en": <UkFlag/>,
    }

    const flag = localeFlagMapping[props.locale]
    return <a
        style={{cursor: "pointer"}}
        title={`Switch language to ${props.locale}`}
        onClick={() => setLocale(props.locale)}
    >{flag}</a>
}

export const Footer = () => {
    const {getString, locale} = useLocalization()

    return (
        <div class="container text-center">
            <a
                href="https://github.com/BorisGerretzen/tax"
                class="text-decoration-none text-dark"
                target="_blank">
                <GithubIcon/>
                <b>TaxTool</b>
            </a>
            &nbsp;by Boris Gerretzen <br/>
            <span class="small text-muted" style={{whiteSpace: 'pre-line'}}>
                {getString("disclaimer")}
            </span>
            <br/>
            {locale === "nl" ? <LocaleFlag locale={"en"}/> : <></>}
            {locale === "en" ? <LocaleFlag locale={"nl"}/> : <></>}
        </div>
    )
}