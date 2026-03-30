
import { ITemplate, ITemplateConfig } from '../core/interfaces/template.interface';
import { TemplateFactory } from '../factories/template-factory';
import { ThemeType } from '../core/enums/theme.enum';
import { ITheme } from '../templates/themes/theme.interface';

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
export class TemplateService {
  private templateCache: Map<string, TemplateCache> = new Map();
  private defaultTTL: number = 3600; 
  private templateHistory: Map<string, ITemplate[]> = new Map();
  
  constructor(private options: TemplateOptions = {}) {
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
  createTemplate(
    themeType: ThemeType,
    variant: 'light' | 'dark',
    config: ITemplateConfig,
    options?: TemplateOptions
  ): ITemplate {
    // Validar configuração se necessário
    if (this.options.validateConfig || options?.validateConfig) {
      this.validateTemplateConfig(config);
    }
    
    // Gerar ID único para o template
    const templateId = this.generateTemplateId(themeType, variant, config);
    
    // ckeck cache
    if ((this.options.cache || options?.cache) && this.templateCache.has(templateId)) {
      const cached = this.templateCache.get(templateId)!;
      cached.hits++;
      return cached.template;
    }
    
    // Criar template
    const template = TemplateFactory.createTemplate(themeType, variant, config);
    
    // add métodos adicionais ao template
    const enhancedTemplate = this.enhanceTemplate(template, templateId);
    
    // store em cache
    if (this.options.cache || options?.cache) {
      const ttl = (options?.cacheTTL || this.options.cacheTTL || this.defaultTTL) * 1000;
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
  cloneTemplate(
    template: ITemplate,
    modifications?: Partial<ITemplateConfig>
  ): ITemplate {
    const newConfig = {
      ...template.config,
      ...modifications
    };
    
    return this.createTemplate(
      template.theme,
      template.variant,
      newConfig
    );
  }
  
  /**
   * Renderiza um template com os dados fornecidos
   */
  async renderTemplate(
    template: ITemplate,
    data: any,
    options?: { preview?: boolean }
  ): Promise<string> {
    try {
      // add metadados para preview se necessário
      const renderData = {
        ...data,
        _meta: {
          isPreview: options?.preview || this.options.preview,
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
      console.log(html)
      
      return html;
    } catch (error) {
      throw new Error(`Failed to render template: ${error}`);
    }
  }
  
  /**
   * Pré-visualiza um template sem enviar email
   */
  async previewTemplate(
    themeType: ThemeType,
    variant: 'light' | 'dark',
    config: ITemplateConfig,
    data: any
  ): Promise<string> {
    const template = this.createTemplate(themeType, variant, config, { cache: false });
    return this.renderTemplate(template, data, { preview: true });
  }
  
  /**
   * Obtém informações sobre um tema específico
   */
  getThemeInfo(themeType: ThemeType): {
    name: string;
    description: string;
    features: string[];
    availableVariants: ('light' | 'dark')[];
    defaultConfig: Partial<ITemplateConfig>;
  } {
    const info = TemplateFactory.getThemeInfo(themeType);
    const theme = TemplateFactory.getTheme(themeType);
    
    return {
      ...info,
      availableVariants: ['light', 'dark'],
      defaultConfig: this.getDefaultConfigForTheme(themeType, theme)
    };
  }
  
  /**
   * Lista todos os temas disponíveis
   */
  listThemes(): ThemeType[] {
    return TemplateFactory.listThemes();
  }
  
  /**
   * Obtém estatísticas de uso dos templates
   */
  getTemplateStats(): {
    totalTemplates: number;
    cachedTemplates: number;
    totalHits: number;
    templatesByTheme: Record<ThemeType, number>;
    cacheHitRate: number;
  } {
    const templatesByTheme: Record<ThemeType, number> = {
      [ThemeType.SYSTEM]: 0,
      [ThemeType.MONOKAI]: 0,
      [ThemeType.MODERN]: 0,
      [ThemeType.CORPORATE]: 0,
      [ThemeType.MINIMAL]: 0
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
  clearCache(themeType?: ThemeType): number {
    let cleared = 0;
    
    if (themeType) {
      for (const [id, cache] of this.templateCache.entries()) {
        if (cache.template.theme === themeType) {
          this.templateCache.delete(id);
          cleared++;
        }
      }
    } else {
      cleared = this.templateCache.size;
      this.templateCache.clear();
    }
    
    return cleared;
  }
  
  /**
   * Obtém histórico de versões de um template
   */
  getTemplateHistory(templateId: string): ITemplate[] {
    return this.templateHistory.get(templateId) || [];
  }
  
  /**
   * Restaura uma versão anterior do template
   */
  restoreTemplateVersion(
    templateId: string,
    versionIndex: number
  ): ITemplate | null {
    const history = this.templateHistory.get(templateId);
    if (!history || versionIndex >= history.length) {
      return null;
    }
    
    const oldTemplate = history[versionIndex];
    return this.createTemplate(
      oldTemplate.theme,
      oldTemplate.variant,
      oldTemplate.config,
      { cache: false }
    );
  }
  
  /**
   * Valida a configuração do template
   */
  private validateTemplateConfig(config: ITemplateConfig): void {
    const errors: string[] = [];
    
    // Validar header
    if (config.header?.show && config.header?.logo) {
      if (config.header.logo.type === 'image' && !config.header.logo.imageUrl) {
        errors.push('Logo image requires imageUrl');
      }
      if (config.header.logo.type === 'text' && !config.header.logo.text) {
        errors.push('Logo text requires text content');
      }
    }
    
    // Validar footer
    if (config.footer?.show) {
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
  private generateTemplateId(
    themeType: ThemeType,
    variant: 'light' | 'dark',
    config: ITemplateConfig
  ): string {
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
  private enhanceTemplate(template: ITemplate, templateId: string): ITemplate {
    const enhanced = { ...template };
    
    // add método para obter versão
    (enhanced as any).getVersion = () => {
      const history = this.templateHistory.get(templateId);
      return history ? history.length : 1;
    };
    
    // add método para obter ID
    (enhanced as any).getId = () => templateId;
    
    // add método para clonar
    (enhanced as any).clone = (modifications?: Partial<ITemplateConfig>) => {
      return this.cloneTemplate(enhanced, modifications);
    };
    
    return enhanced;
  }
  
  /**
   * Adiciona template ao histórico
   */
  private addToHistory(templateId: string, template: ITemplate): void {
    if (!this.templateHistory.has(templateId)) {
      this.templateHistory.set(templateId, []);
    }
    
    const history = this.templateHistory.get(templateId)!;
    history.push(template);
    
    // Manter apenas últimas 10 versões
    if (history.length > 10) {
      history.shift();
    }
  }
  
  /**
   * Remove templates expirados do cache
   */
  private cleanExpiredCache(): void {
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
  private minifyHtml(html: string): string {
    return html
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .replace(/<!--.*?-->/g, '')
      .trim();
  }
  
  /**
   * Obtém configuração padrão para um tema
   */
  private getDefaultConfigForTheme(
    themeType: ThemeType,
    theme?: ITheme
  ): Partial<ITemplateConfig> {
    const baseConfig: Partial<ITemplateConfig> = {
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
      case ThemeType.MONOKAI:
        return {
          ...baseConfig,
          borderRadius: 'small',
          spacing: 'normal'
        };
      case ThemeType.MODERN:
        return {
          ...baseConfig,
          borderRadius: 'large',
          spacing: 'relaxed'
        };
      case ThemeType.CORPORATE:
        return {
          ...baseConfig,
          borderRadius: 'small',
          spacing: 'normal'
        };
      case ThemeType.MINIMAL:
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
  async preloadTemplates(
    templates: Array<{
      themeType: ThemeType;
      variant: 'light' | 'dark';
      config: ITemplateConfig;
    }>
  ): Promise<void> {
    const promises = templates.map(async ({ themeType, variant, config }) => {
      this.createTemplate(themeType, variant, config);
    });
    
    await Promise.all(promises);
  }
  
  /**
   * Exporta template para formato JSON
   */
  exportTemplate(template: ITemplate): string {
    return JSON.stringify({
      name: template.name,
      theme: template.theme,
      variant: template.variant,
      config: template.config,
      exportedAt: new Date().toISOString(),
      version: (template as any).getVersion?.() || 1
    }, null, 2);
  }
  
  /**
   * Importa template de formato JSON
   */
  importTemplate(jsonData: string): ITemplate {
    try {
      const data = JSON.parse(jsonData);
      
      if (!data.theme || !data.variant || !data.config) {
        throw new Error('Invalid template data: missing required fields');
      }
      
      return this.createTemplate(
        data.theme,
        data.variant,
        data.config
      );
    } catch (error) {
      throw new Error(`Failed to import template: ${error}`);
    }
  }
  
  /**
   * Gera um template de exemplo para demonstração
   */
  generateExampleTemplate(
    themeType: ThemeType = ThemeType.MODERN,
    variant: 'light' | 'dark' = 'light'
  ): ITemplate {
    const exampleConfig: ITemplateConfig = {
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
      borderRadius: themeType === ThemeType.MINIMAL ? 'none' : 'medium'
    };
    
    return this.createTemplate(themeType, variant, exampleConfig);
  }
  
  /**
   * Valida se um template é válido
   */
  isValidTemplate(template: any): boolean {
    try {
      // Verificar propriedades obrigatórias
      if (!template || typeof template !== 'object') return false;
      if (!template.name || typeof template.name !== 'string') return false;
      if (!template.theme || !Object.values(ThemeType).includes(template.theme)) return false;
      if (!template.variant || !['light', 'dark'].includes(template.variant)) return false;
      if (!template.config || typeof template.config !== 'object') return false;
      if (typeof template.render !== 'function') return false;
      
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Obtém estatísticas detalhadas de um template específico
   */
  getTemplateDetails(templateId: string): {
    template: ITemplate | null;
    history: ITemplate[];
    cacheInfo: TemplateCache | null;
    usageCount: number;
  } {
    const cacheInfo = this.templateCache.get(templateId) || null;
    const history = this.templateHistory.get(templateId) || [];
    const usageCount = cacheInfo?.hits || 0;
    
    return {
      template: cacheInfo?.template || history[history.length - 1] || null,
      history,
      cacheInfo,
      usageCount
    };
  }
}