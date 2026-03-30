
import { ThemeType } from '../core/enums/theme.enum';
import { ITemplate, ITemplateConfig } from '../core/interfaces/template.interface';
import { ITheme } from '../templates/themes/theme.interface';
import { SystemTheme } from '../templates/themes/system.theme';
import { MonokaiTheme } from '../templates/themes/monokai.theme';
import { ModernTheme } from '../templates/themes/modern.theme';
import { CorporateTheme } from '../templates/themes/corporate.theme';
import { MinimalTheme } from '../templates/themes/minimal.theme';
import { TemplateBuilder } from '../templates/base/template-builder';

export class TemplateFactory {
  private static themes: Map<ThemeType, ITheme> = new Map([
    [ThemeType.SYSTEM, new SystemTheme()],
    [ThemeType.MONOKAI, new MonokaiTheme()],
    [ThemeType.MODERN, new ModernTheme()],
    [ThemeType.CORPORATE, new CorporateTheme()],
    [ThemeType.MINIMAL, new MinimalTheme()]
  ]);

  static createTemplate(
    themeType: ThemeType,
    variant: 'light' | 'dark',
    config: ITemplateConfig
  ): ITemplate {
    const theme = this.themes.get(themeType);
    if (!theme) {
      throw new Error(`Theme ${themeType} not found`);
    }

    return {
      name: `${themeType}_${variant}`,
      theme: themeType,
      variant,
      config,
      render: async (data: any) => {
        const builder = new TemplateBuilder(theme, config, variant);

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
  
  static getTheme(themeType: ThemeType): ITheme | undefined {
    return this.themes.get(themeType);
  }
  
  static listThemes(): ThemeType[] {
    return Array.from(this.themes.keys());
  }
  
  static getThemeInfo(themeType: ThemeType): {
    name: string;
    description: string;
    features: string[];
  } {
    const themeInfo = {
      [ThemeType.SYSTEM]: {
        name: 'System',
        description: 'Tema limpo e profissional com cores adaptativas',
        features: ['Design minimalista', 'Alta acessibilidade', 'Compatibilidade total']
      },
      [ThemeType.MONOKAI]: {
        name: 'Monokai',
        description: 'Inspirado no famoso tema de código, ideal para conteúdo técnico',
        features: ['Cores vibrantes', 'Destaque de sintaxe', 'Efeitos glow']
      },
      [ThemeType.MODERN]: {
        name: 'Modern',
        description: 'Design contemporâneo com gradientes e efeitos modernos',
        features: ['Gradientes elegantes', 'Glassmorphism', 'Animações suaves']
      },
      [ThemeType.CORPORATE]: {
        name: 'Corporate',
        description: 'Design profissional e elegante para empresas',
        features: ['Tipografia serifada', 'Detalhes em dourado', 'Layout estruturado']
      },
      [ThemeType.MINIMAL]: {
        name: 'Minimal',
        description: 'Design clean e focado no conteúdo',
        features: ['Sem distrações', 'Espaçamento generoso', 'Tipografia limpa']
      }
    };
    
    return themeInfo[themeType];
  }
}