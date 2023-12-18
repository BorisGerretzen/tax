import {LocalizationProvider} from "./localization/localizationContext.tsx";
import {Content} from "./content.tsx";

export function App() {
    return (
        <LocalizationProvider>
            <Content/>
        </LocalizationProvider>
    )
}
