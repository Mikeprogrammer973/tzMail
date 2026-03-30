import { ThemeType } from "../../core/enums/theme.enum";
export interface ITheme {
    id: ThemeType;
    name: string;
    light: IThemeColors;
    dark: IThemeColors;
    typography: ITypography;
    spacing: ISpacing;
}
export interface IThemeColors {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    textMuted: string;
    border: string;
    success: string;
    error: string;
    warning: string;
}
export interface ITypography {
    fontFamily: string;
    fontSizes: {
        small: string;
        medium: string;
        large: string;
        xlarge: string;
    };
    fontWeights: {
        normal: number;
        medium: number;
        bold: number;
    };
}
export interface ISpacing {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
}
//# sourceMappingURL=theme.interface.d.ts.map