import { IEmailConfig, IEmailOptions } from '../core/interfaces/email.interface';
import { TemplateService } from '../services/template.service';
import { AttachmentService } from '../services/attachment.service';
import { ThemeType } from '../core/enums/theme.enum';
import { ITemplateConfig } from '../core/interfaces/template.interface';
export declare class EmailFactory {
    private static instance;
    private emailService;
    private templateService;
    private attachmentService;
    private constructor();
    static initialize(config: IEmailConfig, templateOptions?: any): EmailFactory;
    static getInstance(): EmailFactory;
    sendEmail(options: IEmailOptions): Promise<any>;
    getTemplateService(): TemplateService;
    getAttachmentService(): AttachmentService;
    previewTemplate(themeType: ThemeType, variant: 'light' | 'dark', config: ITemplateConfig, data: any): Promise<string>;
    getThemeInfo(themeType: ThemeType): {
        name: string;
        description: string;
        features: string[];
        availableVariants: ("light" | "dark")[];
        defaultConfig: Partial<ITemplateConfig>;
    };
    listThemes(): ThemeType[];
    getTemplateStats(): {
        totalTemplates: number;
        cachedTemplates: number;
        totalHits: number;
        templatesByTheme: Record<ThemeType, number>;
        cacheHitRate: number;
    };
}
//# sourceMappingURL=email-factory.d.ts.map