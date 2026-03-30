"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateService = void 0;
const template_factory_1 = require("../factories/template-factory");
const theme_enum_1 = require("../core/enums/theme.enum");
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
class TemplateService {
    constructor(options = {}) {
        this.options = options;
        this.templateCache = new Map();
        this.defaultTTL = 3600;
        this.templateHistory = new Map();
        this.options = {
            cache: true,
            cacheTTL: 3600,
            validateConfig: true,
            minify: true,
            preview: false,
            ...options
        };
        setInterval(() => this.cleanExpiredCache(), 3600000);
    }
    /**
     * Cria um novo template com as configurações especificadas
     */
    createTemplate(themeType, variant, config, options) {
        // Validar configuração se necessário
        if (this.options.validateConfig || (options === null || options === void 0 ? void 0 : options.validateConfig)) {
            this.validateTemplateConfig(config);
        }
        // Gerar ID único para o template
        const templateId = this.generateTemplateId(themeType, variant, config);
        // ckeck cache
        if ((this.options.cache || (options === null || options === void 0 ? void 0 : options.cache)) && this.templateCache.has(templateId)) {
            const cached = this.templateCache.get(templateId);
            cached.hits++;
            return cached.template;
        }
        // Criar template
        const template = template_factory_1.TemplateFactory.createTemplate(themeType, variant, config);
        // add métodos adicionais ao template
        const enhancedTemplate = this.enhanceTemplate(template, templateId);
        // store em cache
        if (this.options.cache || (options === null || options === void 0 ? void 0 : options.cache)) {
            const ttl = ((options === null || options === void 0 ? void 0 : options.cacheTTL) || this.options.cacheTTL || this.defaultTTL) * 1000;
            this.templateCache.set(templateId, {
                template: enhancedTemplate,
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + ttl),
                hits: 1
            });
        }
        // reg no histórico
        this.addToHistory(templateId, enhancedTemplate);
        return enhancedTemplate;
    }
    /**
     * Cria um template a partir de um template existente (clone)
     */
    cloneTemplate(template, modifications) {
        const newConfig = {
            ...template.config,
            ...modifications
        };
        return this.createTemplate(template.theme, template.variant, newConfig);
    }
    /**
     * Renderiza um template com os dados fornecidos
     */
    async renderTemplate(template, data, options) {
        try {
            // add metadados para preview se necessário
            const renderData = {
                ...data,
                _meta: {
                    isPreview: (options === null || options === void 0 ? void 0 : options.preview) || this.options.preview,
                    renderDate: new Date().toISOString(),
                    templateName: template.name,
                    theme: template.theme,
                    variant: template.variant
                }
            };
            // render template
            let html = await template.render(renderData);
            // Minificar HTML se necessário
            if (this.options.minify) {
                html = this.minifyHtml(html);
            }
            console.log(`Template ${template.name} rendered successfully.`);
            console.log(`Render metadata:`, renderData._meta);
            console.log(html);
            return html;
        }
        catch (error) {
            throw new Error(`Failed to render template: ${error}`);
        }
    }
    /**
     * Pré-visualiza um template sem enviar email
     */
    async previewTemplate(themeType, variant, config, data) {
        const template = this.createTemplate(themeType, variant, config, { cache: false });
        return this.renderTemplate(template, data, { preview: true });
    }
    /**
     * Obtém informações sobre um tema específico
     */
    getThemeInfo(themeType) {
        const info = template_factory_1.TemplateFactory.getThemeInfo(themeType);
        const theme = template_factory_1.TemplateFactory.getTheme(themeType);
        return {
            ...info,
            availableVariants: ['light', 'dark'],
            defaultConfig: this.getDefaultConfigForTheme(themeType, theme)
        };
    }
    /**
     * Lista todos os temas disponíveis
     */
    listThemes() {
        return template_factory_1.TemplateFactory.listThemes();
    }
    /**
     * Obtém estatísticas de uso dos templates
     */
    getTemplateStats() {
        const templatesByTheme = {
            [theme_enum_1.ThemeType.SYSTEM]: 0,
            [theme_enum_1.ThemeType.MONOKAI]: 0,
            [theme_enum_1.ThemeType.MODERN]: 0,
            [theme_enum_1.ThemeType.CORPORATE]: 0,
            [theme_enum_1.ThemeType.MINIMAL]: 0
        };
        let totalHits = 0;
        for (const cache of this.templateCache.values()) {
            const theme = cache.template.theme;
            templatesByTheme[theme]++;
            totalHits += cache.hits;
        }
        const totalCached = this.templateCache.size;
        const totalInHistory = this.templateHistory.size;
        return {
            totalTemplates: totalInHistory,
            cachedTemplates: totalCached,
            totalHits,
            templatesByTheme,
            cacheHitRate: totalCached > 0 ? (totalHits / totalCached) * 100 : 0
        };
    }
    /**
     * Limpa o cache de templates
     */
    clearCache(themeType) {
        let cleared = 0;
        if (themeType) {
            for (const [id, cache] of this.templateCache.entries()) {
                if (cache.template.theme === themeType) {
                    this.templateCache.delete(id);
                    cleared++;
                }
            }
        }
        else {
            cleared = this.templateCache.size;
            this.templateCache.clear();
        }
        return cleared;
    }
    /**
     * Obtém histórico de versões de um template
     */
    getTemplateHistory(templateId) {
        return this.templateHistory.get(templateId) || [];
    }
    /**
     * Restaura uma versão anterior do template
     */
    restoreTemplateVersion(templateId, versionIndex) {
        const history = this.templateHistory.get(templateId);
        if (!history || versionIndex >= history.length) {
            return null;
        }
        const oldTemplate = history[versionIndex];
        return this.createTemplate(oldTemplate.theme, oldTemplate.variant, oldTemplate.config, { cache: false });
    }
    /**
     * Valida a configuração do template
     */
    validateTemplateConfig(config) {
        var _a, _b, _c;
        const errors = [];
        // Validar header
        if (((_a = config.header) === null || _a === void 0 ? void 0 : _a.show) && ((_b = config.header) === null || _b === void 0 ? void 0 : _b.logo)) {
            if (config.header.logo.type === 'image' && !config.header.logo.imageUrl) {
                errors.push('Logo image requires imageUrl');
            }
            if (config.header.logo.type === 'text' && !config.header.logo.text) {
                errors.push('Logo text requires text content');
            }
        }
        // Validar footer
        if ((_c = config.footer) === null || _c === void 0 ? void 0 : _c.show) {
            if (config.footer.links) {
                for (const link of config.footer.links) {
                    if (!link.text || !link.url) {
                        errors.push('Footer links require both text and url');
                    }
                }
            }
        }
        // Validar layout
        const validLayouts = ['full', 'minimal'];
        if (config.layout && !validLayouts.includes(config.layout)) {
            errors.push(`Invalid layout: ${config.layout}. Must be one of: ${validLayouts.join(', ')}`);
        }
        // Validar spacing
        const validSpacing = ['compact', 'normal', 'relaxed'];
        if (config.spacing && !validSpacing.includes(config.spacing)) {
            errors.push(`Invalid spacing: ${config.spacing}. Must be one of: ${validSpacing.join(', ')}`);
        }
        // Validar borderRadius
        const validBorderRadius = ['none', 'small', 'medium', 'large'];
        if (config.borderRadius && !validBorderRadius.includes(config.borderRadius)) {
            errors.push(`Invalid borderRadius: ${config.borderRadius}. Must be one of: ${validBorderRadius.join(', ')}`);
        }
        if (errors.length > 0) {
            throw new Error(`Template configuration validation failed:\n${errors.join('\n')}`);
        }
    }
    /**
     * Gera um ID único para o template baseado na configuração
     */
    generateTemplateId(themeType, variant, config) {
        const configString = JSON.stringify({
            theme: themeType,
            variant,
            config
        });
        // Hash simples para ID
        let hash = 0;
        for (let i = 0; i < configString.length; i++) {
            const char = configString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return `${themeType}_${variant}_${Math.abs(hash)}`;
    }
    /**
     * Adiciona funcionalidades extras ao template
     */
    enhanceTemplate(template, templateId) {
        const enhanced = { ...template };
        // add método para obter versão
        enhanced.getVersion = () => {
            const history = this.templateHistory.get(templateId);
            return history ? history.length : 1;
        };
        // add método para obter ID
        enhanced.getId = () => templateId;
        // add método para clonar
        enhanced.clone = (modifications) => {
            return this.cloneTemplate(enhanced, modifications);
        };
        return enhanced;
    }
    /**
     * Adiciona template ao histórico
     */
    addToHistory(templateId, template) {
        if (!this.templateHistory.has(templateId)) {
            this.templateHistory.set(templateId, []);
        }
        const history = this.templateHistory.get(templateId);
        history.push(template);
        // Manter apenas últimas 10 versões
        if (history.length > 10) {
            history.shift();
        }
    }
    /**
     * Remove templates expirados do cache
     */
    cleanExpiredCache() {
        const now = Date.now();
        for (const [id, cache] of this.templateCache.entries()) {
            if (cache.expiresAt.getTime() < now) {
                this.templateCache.delete(id);
            }
        }
    }
    /**
     * Minifica o HTML para reduzir tamanho
     */
    minifyHtml(html) {
        return html
            .replace(/\s+/g, ' ')
            .replace(/>\s+</g, '><')
            .replace(/<!--.*?-->/g, '')
            .trim();
    }
    /**
     * Obtém configuração padrão para um tema
     */
    getDefaultConfigForTheme(themeType, theme) {
        const baseConfig = {
            header: {
                show: true,
                logo: {
                    type: 'text',
                    text: 'MyApp',
                    size: 'medium'
                }
            },
            footer: {
                show: true,
                copyrightText: `© ${new Date().getFullYear()} MyApp. All rights reserved.`
            },
            layout: 'full',
            spacing: 'normal',
            borderRadius: 'medium'
        };
        // Ajustes específicos por tema
        switch (themeType) {
            case theme_enum_1.ThemeType.MONOKAI:
                return {
                    ...baseConfig,
                    borderRadius: 'small',
                    spacing: 'normal'
                };
            case theme_enum_1.ThemeType.MODERN:
                return {
                    ...baseConfig,
                    borderRadius: 'large',
                    spacing: 'relaxed'
                };
            case theme_enum_1.ThemeType.CORPORATE:
                return {
                    ...baseConfig,
                    borderRadius: 'small',
                    spacing: 'normal'
                };
            case theme_enum_1.ThemeType.MINIMAL:
                return {
                    ...baseConfig,
                    borderRadius: 'none',
                    spacing: 'relaxed'
                };
            default:
                return baseConfig;
        }
    }
    /**
     * Pré-carrega templates no cache
     */
    async preloadTemplates(templates) {
        const promises = templates.map(async ({ themeType, variant, config }) => {
            this.createTemplate(themeType, variant, config);
        });
        await Promise.all(promises);
    }
    /**
     * Exporta template para formato JSON
     */
    exportTemplate(template) {
        var _a, _b;
        return JSON.stringify({
            name: template.name,
            theme: template.theme,
            variant: template.variant,
            config: template.config,
            exportedAt: new Date().toISOString(),
            version: ((_b = (_a = template).getVersion) === null || _b === void 0 ? void 0 : _b.call(_a)) || 1
        }, null, 2);
    }
    /**
     * Importa template de formato JSON
     */
    importTemplate(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (!data.theme || !data.variant || !data.config) {
                throw new Error('Invalid template data: missing required fields');
            }
            return this.createTemplate(data.theme, data.variant, data.config);
        }
        catch (error) {
            throw new Error(`Failed to import template: ${error}`);
        }
    }
    /**
     * Gera um template de exemplo para demonstração
     */
    generateExampleTemplate(themeType = theme_enum_1.ThemeType.MODERN, variant = 'light') {
        const exampleConfig = {
            header: {
                show: true,
                logo: {
                    type: 'text',
                    text: 'ExampleApp',
                    size: 'medium'
                },
                backgroundColor: variant === 'light' ? '#ffffff' : '#1a1a1a',
                textColor: variant === 'light' ? '#111827' : '#f9fafb'
            },
            footer: {
                show: true,
                links: [
                    { text: 'Privacy Policy', url: 'https://example.com/privacy' },
                    { text: 'Terms of Service', url: 'https://example.com/terms' },
                    { text: 'Contact', url: 'https://example.com/contact' }
                ],
                socialLinks: [
                    { platform: 'twitter', url: 'https://twitter.com/example' },
                    { platform: 'github', url: 'https://github.com/example' },
                    { platform: 'linkedin', url: 'https://linkedin.com/company/example' }
                ],
                copyrightText: `© ${new Date().getFullYear()} ExampleApp. All rights reserved.`,
                unsubscribeText: 'Unsubscribe',
                backgroundColor: variant === 'light' ? '#f9fafb' : '#111827',
                textColor: variant === 'light' ? '#6b7280' : '#9ca3af'
            },
            layout: 'full',
            spacing: 'normal',
            borderRadius: themeType === theme_enum_1.ThemeType.MINIMAL ? 'none' : 'medium'
        };
        return this.createTemplate(themeType, variant, exampleConfig);
    }
    /**
     * Valida se um template é válido
     */
    isValidTemplate(template) {
        try {
            // Verificar propriedades obrigatórias
            if (!template || typeof template !== 'object')
                return false;
            if (!template.name || typeof template.name !== 'string')
                return false;
            if (!template.theme || !Object.values(theme_enum_1.ThemeType).includes(template.theme))
                return false;
            if (!template.variant || !['light', 'dark'].includes(template.variant))
                return false;
            if (!template.config || typeof template.config !== 'object')
                return false;
            if (typeof template.render !== 'function')
                return false;
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Obtém estatísticas detalhadas de um template específico
     */
    getTemplateDetails(templateId) {
        const cacheInfo = this.templateCache.get(templateId) || null;
        const history = this.templateHistory.get(templateId) || [];
        const usageCount = (cacheInfo === null || cacheInfo === void 0 ? void 0 : cacheInfo.hits) || 0;
        return {
            template: (cacheInfo === null || cacheInfo === void 0 ? void 0 : cacheInfo.template) || history[history.length - 1] || null,
            history,
            cacheInfo,
            usageCount
        };
    }
}
exports.TemplateService = TemplateService;
