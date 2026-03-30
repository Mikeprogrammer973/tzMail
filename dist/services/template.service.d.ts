import { ITemplate, ITemplateConfig } from '../core/interfaces/template.interface';
import { ThemeType } from '../core/enums/theme.enum';
interface TemplateCache {
    template: ITemplate;
    createdAt: Date;
    expiresAt: Date;
    hits: number;
}
interface TemplateOptions {
    cache?: boolean;
    cacheTTL?: number;
    validateConfig?: boolean;
    minify?: boolean;
    preview?: boolean;
}
/**
 * TemplateService - Gerencia a criação, renderização e gerenciamento de templates de email
 *
 * Métodos:
 * - createTemplate(themeType, variant, config, options): ITemplate
 *   Cria um novo template com as configurações especificadas.
 *
 * - cloneTemplate(template, modifications): ITemplate
 *   Cria um template a partir de um template existente (clone).
 *
 * - renderTemplate(template, data, options): Promise<string>
 *   Renderiza um template com os dados fornecidos.
 *
 * - previewTemplate(themeType, variant, config, data): Promise<string>
 *   Pré-visualiza um template sem enviar email.
 *
 * - getThemeInfo(themeType): object
 *   Obtém informações sobre um tema específico.
 *
 * - listThemes(): ThemeType[]
 *   Lista todos os temas disponíveis.
 *
 * - getTemplateStats(): object
 *   Obtém estatísticas de uso dos templates.
 *
 * - clearCache(themeType?): number
 *   Limpa o cache de templates, opcionalmente por tema.
 *
 * - getTemplateHistory(templateId): ITemplate[]
 *   Obtém histórico de versões de um template.
 *
 * - restoreTemplateVersion(templateId, versionIndex): ITemplate | null
 *   Restaura uma versão anterior do template.
 *
 * Exemplo de uso:
 *
 * const templateService = new TemplateService();
 * const myTemplate = templateService.createTemplate(ThemeType.MODERN, 'light', { header: { show: true } });
 * const html = await templateService.renderTemplate(myTemplate, { username: 'John' });
 * console.log(html);
 */
export declare class TemplateService {
    private options;
    private templateCache;
    private defaultTTL;
    private templateHistory;
    constructor(options?: TemplateOptions);
    /**
     * Cria um novo template com as configurações especificadas
     */
    createTemplate(themeType: ThemeType, variant: 'light' | 'dark', config: ITemplateConfig, options?: TemplateOptions): ITemplate;
    /**
     * Cria um template a partir de um template existente (clone)
     */
    cloneTemplate(template: ITemplate, modifications?: Partial<ITemplateConfig>): ITemplate;
    /**
     * Renderiza um template com os dados fornecidos
     */
    renderTemplate(template: ITemplate, data: any, options?: {
        preview?: boolean;
    }): Promise<string>;
    /**
     * Pré-visualiza um template sem enviar email
     */
    previewTemplate(themeType: ThemeType, variant: 'light' | 'dark', config: ITemplateConfig, data: any): Promise<string>;
    /**
     * Obtém informações sobre um tema específico
     */
    getThemeInfo(themeType: ThemeType): {
        name: string;
        description: string;
        features: string[];
        availableVariants: ('light' | 'dark')[];
        defaultConfig: Partial<ITemplateConfig>;
    };
    /**
     * Lista todos os temas disponíveis
     */
    listThemes(): ThemeType[];
    /**
     * Obtém estatísticas de uso dos templates
     */
    getTemplateStats(): {
        totalTemplates: number;
        cachedTemplates: number;
        totalHits: number;
        templatesByTheme: Record<ThemeType, number>;
        cacheHitRate: number;
    };
    /**
     * Limpa o cache de templates
     */
    clearCache(themeType?: ThemeType): number;
    /**
     * Obtém histórico de versões de um template
     */
    getTemplateHistory(templateId: string): ITemplate[];
    /**
     * Restaura uma versão anterior do template
     */
    restoreTemplateVersion(templateId: string, versionIndex: number): ITemplate | null;
    /**
     * Valida a configuração do template
     */
    private validateTemplateConfig;
    /**
     * Gera um ID único para o template baseado na configuração
     */
    private generateTemplateId;
    /**
     * Adiciona funcionalidades extras ao template
     */
    private enhanceTemplate;
    /**
     * Adiciona template ao histórico
     */
    private addToHistory;
    /**
     * Remove templates expirados do cache
     */
    private cleanExpiredCache;
    /**
     * Minifica o HTML para reduzir tamanho
     */
    private minifyHtml;
    /**
     * Obtém configuração padrão para um tema
     */
    private getDefaultConfigForTheme;
    /**
     * Pré-carrega templates no cache
     */
    preloadTemplates(templates: Array<{
        themeType: ThemeType;
        variant: 'light' | 'dark';
        config: ITemplateConfig;
    }>): Promise<void>;
    /**
     * Exporta template para formato JSON
     */
    exportTemplate(template: ITemplate): string;
    /**
     * Importa template de formato JSON
     */
    importTemplate(jsonData: string): ITemplate;
    /**
     * Gera um template de exemplo para demonstração
     */
    generateExampleTemplate(themeType?: ThemeType, variant?: 'light' | 'dark'): ITemplate;
    /**
     * Valida se um template é válido
     */
    isValidTemplate(template: any): boolean;
    /**
     * Obtém estatísticas detalhadas de um template específico
     */
    getTemplateDetails(templateId: string): {
        template: ITemplate | null;
        history: ITemplate[];
        cacheInfo: TemplateCache | null;
        usageCount: number;
    };
}
export {};
//# sourceMappingURL=template.service.d.ts.map