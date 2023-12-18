type IconProps = {
    width?: number;
    height?: number;
}

export const UkFlag = ({width = 24, height = 24}: IconProps) =>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30" width={width} height={height}>
        <clipPath id="t">
            <path d="M25,15h25v15zv15h-25zh-25v-15zv-15h25z"/>
        </clipPath>
        <path d="M0,0v30h50v-30z" fill="#012169"/>
        <path d="M0,0 50,30M50,0 0,30" stroke="#fff" stroke-width="6"/>
        <path d="M0,0 50,30M50,0 0,30" clip-path="url(#t)" stroke="#C8102E" stroke-width="4"/>
        <path d="M-1 11h22v-12h8v12h22v8h-22v12h-8v-12h-22z" fill="#C8102E" stroke="#FFF" stroke-width="2"/>
    </svg>

export const NlFlag = ({width = 24, height = 24}: IconProps) =>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6" width={width} height={height}>
        <rect fill="#21468B" width="9" height="6"/>
        <rect fill="#FFF" width="9" height="4"/>
        <rect fill="#AE1C28" width="9" height="2"/>
    </svg>