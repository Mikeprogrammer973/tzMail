import { ThemeType } from '../core/enums/theme.enum';
import { ITemplate, ITemplateConfig } from '../core/interfaces/template.interface';
import { ITheme } from '../templates/themes/theme.interface';
export declare class TemplateFactory {
    private static themes;
    static createTemplate(themeType: ThemeType, variant: 'light' | 'dark', config: ITemplateConfig): ITemplate;
    static getTheme(themeType: ThemeType): ITheme | undefined;
    static listThemes(): ThemeType[];
    static getThemeInfo(themeType: ThemeType): {
        name: string;
        description: string;
        features: string[];
    };
}
//# sourceMappingURL=template-factory.d.ts.map