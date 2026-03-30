"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateFactory = void 0;
const theme_enum_1 = require("../core/enums/theme.enum");
const system_theme_1 = require("../templates/themes/system.theme");
const monokai_theme_1 = require("../templates/themes/monokai.theme");
const modern_theme_1 = require("../templates/themes/modern.theme");
const corporate_theme_1 = require("../templates/themes/corporate.theme");
const minimal_theme_1 = require("../templates/themes/minimal.theme");
const template_builder_1 = require("../templates/base/template-builder");
class TemplateFactory {
    static createTemplate(themeType, variant, config) {
        const theme = this.themes.get(themeType);
        if (!theme) {
            throw new Error(`Theme ${themeType} not found`);
        }
        return {
            name: `${themeType}_${variant}`,
            theme: themeType,
            variant,
            config,
            render: async (data) => {
                const builder = new template_builder_1.TemplateBuilder(theme, config, variant);
                const body = data.template.config.body || {};
                let bodyContent = body.content || `
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td style="padding: 20px; text-align: ${body.alignment || 'left'}; background-color: ${body.backgroundColor || 'transparent'}; color: ${body.textColor || 'inherit'}; font-size: ${body.fontSize || 14}px;">
                
                <h2 style="margin: 0 0 16px 0; font-size: ${(body.fontSize + 7) || 21}px; line-height: 1.3;">
                  ${body.title || 'Hello!'}
                </h2>

                <p style="margin: 0; line-height: 1.6;">
                  ${body.message || 'This is an email generated with tzMail.'}
                </p>

              </td>
            </tr>
          </table>
        `;
                builder.buildHeader(data.headerContent).buildBody(bodyContent);
                if (body.buttonText && body.buttonUrl) {
                    builder.buildButton(body.buttonText, body.buttonUrl, body.buttonVariant);
                }
                return builder
                    .buildFooter()
                    .build();
            }
        };
    }
    static getTheme(themeType) {
        return this.themes.get(themeType);
    }
    static listThemes() {
        return Array.from(this.themes.keys());
    }
    static getThemeInfo(themeType) {
        const themeInfo = {
            [theme_enum_1.ThemeType.SYSTEM]: {
                name: 'System',
                description: 'Tema limpo e profissional com cores adaptativas',
                features: ['Design minimalista', 'Alta acessibilidade', 'Compatibilidade total']
            },
            [theme_enum_1.ThemeType.MONOKAI]: {
                name: 'Monokai',
                description: 'Inspirado no famoso tema de código, ideal para conteúdo técnico',
                features: ['Cores vibrantes', 'Destaque de sintaxe', 'Efeitos glow']
            },
            [theme_enum_1.ThemeType.MODERN]: {
                name: 'Modern',
                description: 'Design contemporâneo com gradientes e efeitos modernos',
                features: ['Gradientes elegantes', 'Glassmorphism', 'Animações suaves']
            },
            [theme_enum_1.ThemeType.CORPORATE]: {
                name: 'Corporate',
                description: 'Design profissional e elegante para empresas',
                features: ['Tipografia serifada', 'Detalhes em dourado', 'Layout estruturado']
            },
            [theme_enum_1.ThemeType.MINIMAL]: {
                name: 'Minimal',
                description: 'Design clean e focado no conteúdo',
                features: ['Sem distrações', 'Espaçamento generoso', 'Tipografia limpa']
            }
        };
        return themeInfo[themeType];
    }
}
exports.TemplateFactory = TemplateFactory;
TemplateFactory.themes = new Map([
    [theme_enum_1.ThemeType.SYSTEM, new system_theme_1.SystemTheme()],
    [theme_enum_1.ThemeType.MONOKAI, new monokai_theme_1.MonokaiTheme()],
    [theme_enum_1.ThemeType.MODERN, new modern_theme_1.ModernTheme()],
    [theme_enum_1.ThemeType.CORPORATE, new corporate_theme_1.CorporateTheme()],
    [theme_enum_1.ThemeType.MINIMAL, new minimal_theme_1.MinimalTheme()]
]);
