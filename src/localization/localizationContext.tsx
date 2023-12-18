import React, {createContext, ReactNode, useContext, useState} from 'react';
import strings from './strings.json';

export type Locale = 'en' | 'nl';
export type LocalizationKey = keyof typeof strings;

interface LocalizationContextProps {
    locale: Locale;
    setLocale: (newLocale: Locale) => void;
    getString: (key: LocalizationKey) => string;
}

const LocalizationContext = createContext<LocalizationContextProps | undefined>(undefined);

interface LocalizationProviderProps {
    children: ReactNode;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({children}) => {
    const [locale, setLocale] = useState<Locale>('en');

    const getString = (key: LocalizationKey): string => {
        return strings[key][locale];
    };

    const contextValue: LocalizationContextProps = {
        locale,
        setLocale,
        getString,
    };

    return (
        <LocalizationContext.Provider value={contextValue}>
            {children}
        </LocalizationContext.Provider>
    );
};

export const useLocalization = (): LocalizationContextProps => {
    const context = useContext(LocalizationContext);
    if (!context) {
        throw new Error('useLocalization must be used within a LocalizationProvider');
    }
    return context;
};