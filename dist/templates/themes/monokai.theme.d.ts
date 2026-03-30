import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing } from './theme.interface';
export declare class MonokaiTheme implements ITheme {
    id: ThemeType;
    name: string;
    light: IThemeColors;
    dark: IThemeColors;
    typography: ITypography;
    spacing: ISpacing;
    codeHighlight: {
        comment: string;
        keyword: string;
        string: string;
        number: string;
        function: string;
        variable: string;
    };
    borderStyle: {
        radius: string;
        width: string;
        style: string;
    };
    effects: {
        glow: string;
        shadow: string;
        transition: string;
    };
}
//# sourceMappingURL=monokai.theme.d.ts.map