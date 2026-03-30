"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemTheme = exports.MonokaiTheme = exports.ModernTheme = exports.MinimalTheme = exports.CorporateTheme = exports.TemplateBuilder = exports.AttachmentService = exports.EmailService = exports.TemplateService = exports.ThemeType = exports.TemplateFactory = exports.EmailFactory = void 0;
const express_1 = __importDefault(require("express"));
const theme_enum_1 = require("./core/enums/theme.enum");
const email_factory_1 = require("./factories/email-factory");
const dotenv_1 = __importDefault(require("dotenv"));
const attachment_service_1 = require("./services/attachment.service");
dotenv_1.default.config();
var email_factory_2 = require("./factories/email-factory");
Object.defineProperty(exports, "EmailFactory", { enumerable: true, get: function () { return email_factory_2.EmailFactory; } });
var template_factory_1 = require("./factories/template-factory");
Object.defineProperty(exports, "TemplateFactory", { enumerable: true, get: function () { return template_factory_1.TemplateFactory; } });
var theme_enum_2 = require("./core/enums/theme.enum");
Object.defineProperty(exports, "ThemeType", { enumerable: true, get: function () { return theme_enum_2.ThemeType; } });
var template_service_1 = require("./services/template.service");
Object.defineProperty(exports, "TemplateService", { enumerable: true, get: function () { return template_service_1.TemplateService; } });
var email_service_1 = require("./services/email.service");
Object.defineProperty(exports, "EmailService", { enumerable: true, get: function () { return email_service_1.EmailService; } });
var attachment_service_2 = require("./services/attachment.service");
Object.defineProperty(exports, "AttachmentService", { enumerable: true, get: function () { return attachment_service_2.AttachmentService; } });
var template_builder_1 = require("./templates/base/template-builder");
Object.defineProperty(exports, "TemplateBuilder", { enumerable: true, get: function () { return template_builder_1.TemplateBuilder; } });
var corporate_theme_1 = require("./templates/themes/corporate.theme");
Object.defineProperty(exports, "CorporateTheme", { enumerable: true, get: function () { return corporate_theme_1.CorporateTheme; } });
var minimal_theme_1 = require("./templates/themes/minimal.theme");
Object.defineProperty(exports, "MinimalTheme", { enumerable: true, get: function () { return minimal_theme_1.MinimalTheme; } });
var modern_theme_1 = require("./templates/themes/modern.theme");
Object.defineProperty(exports, "ModernTheme", { enumerable: true, get: function () { return modern_theme_1.ModernTheme; } });
var monokai_theme_1 = require("./templates/themes/monokai.theme");
Object.defineProperty(exports, "MonokaiTheme", { enumerable: true, get: function () { return monokai_theme_1.MonokaiTheme; } });
var system_theme_1 = require("./templates/themes/system.theme");
Object.defineProperty(exports, "SystemTheme", { enumerable: true, get: function () { return system_theme_1.SystemTheme; } });
/*
*
*
* *
* *
* *   tzMail - Servidor de Teste
*/
const app = (0, express_1.default)();
const PORT = 3001;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const SMTP_CONFIG = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    defaultFrom: 'LyraX Corp <lyrax.com@gmail.com>'
};
// init EmailFactory
const emailFactory = email_factory_1.EmailFactory.initialize(SMTP_CONFIG);
const templateService = emailFactory.getTemplateService();
// modern
const modernTemplate = templateService.createTemplate(theme_enum_1.ThemeType.MODERN, 'light', {
    header: {
        show: true,
        logo: {
            type: 'image',
            imageUrl: 'https://talkspace-ten.vercel.app/_next/image?url=%2Flogo%2Ftalkspace-banner.png&w=640&q=75',
            size: 'large'
        }
    },
    body: {
        title: 'Bem-vindo ao LyraX!',
        message: 'Estamos felizes em tê-lo conosco. Explore nossos recursos e aproveite ao máximo a experiência.',
        buttonText: 'Começar Agora',
        buttonUrl: 'https://meuapp.com/get-started',
        buttonVariant: 'primary',
        alignment: 'center',
        fontSize: 16
    },
    footer: {
        show: true,
        links: [
            { text: 'Política', url: 'https://meuapp.com/politica' },
            { text: 'Termos', url: 'https://meuapp.com/termos' }
        ],
        socialLinks: [
            { platform: 'facebook', url: 'https://facebook.com/meuapp' },
            { platform: 'twitter', url: 'https://twitter.com/meuapp' },
            { platform: 'linkedin', url: 'https://linkedin.com/company/meuapp' }
        ],
        copyrightText: '© 2024 Meu App',
        unsubscribeText: 'Cancelar inscrição'
    },
    layout: 'full',
    spacing: 'normal',
    borderRadius: 'medium'
});
// monokai 
const monokaiTemplate = templateService.createTemplate(theme_enum_1.ThemeType.MONOKAI, 'light', {
    header: {
        show: true,
        logo: {
            type: 'text',
            text: 'DevHub',
            size: 'medium'
        }
    },
    body: {
        title: 'DevHub Newsletter - Novidades da Semana',
        message: 'Olá DevHubbers!\n\nConfira as últimas novidades, tutoriais e eventos da comunidade DevHub. Fique por dentro de tudo que está acontecendo no mundo do desenvolvimento! \n <code>console.log("Stay Dev!");</code>',
        buttonText: 'Visitar DevHub',
        buttonUrl: 'https://devhub.com',
        buttonVariant: 'primary',
        alignment: 'center',
        fontSize: 16
    },
    footer: {
        show: true,
        links: [
            { text: 'GitHub', url: 'https://github.com' },
            { text: 'Docs', url: 'https://docs.com' }
        ],
        socialLinks: [
            { platform: 'twitter', url: 'https://twitter.com' },
            { platform: 'linkedin', url: 'https://linkedin.com' }
        ],
        copyrightText: '© 2024 DevHub'
    },
    layout: 'full',
    spacing: 'normal',
    borderRadius: 'small'
});
// corporate 
const corporateTemplate = templateService.createTemplate(theme_enum_1.ThemeType.CORPORATE, 'dark', {
    header: {
        show: true,
        logo: {
            type: 'image',
            imageUrl: 'https://talkspace-ten.vercel.app/_next/image?url=%2Flogo%2Ftalkspace-banner.png&w=640&q=75',
            size: 'large'
        }
    },
    body: {
        title: 'Relatório Trimestral - Q4 2024',
        message: 'Prezado(a) colaborador(a),\n\nSegue o relatório trimestral com os principais indicadores e resultados alcançados no último trimestre. Agradecemos a dedicação de todos e seguimos juntos rumo ao sucesso!',
        buttonText: 'Ver Relatório Completo',
        buttonUrl: 'https://lyrax.com/relatorio-q4-2024',
        buttonVariant: 'primary'
    },
    footer: {
        show: true,
        links: [
            { text: 'Sobre', url: 'https://empresa.com/sobre' },
            { text: 'Imprensa', url: 'https://empresa.com/imprensa' },
            { text: 'Carreiras', url: 'https://empresa.com/carreiras' },
            { text: 'Contato', url: 'https://empresa.com/contato' }
        ],
        copyrightText: '© 2024 Empresa Ltda'
    },
    layout: 'full',
    spacing: 'normal',
    borderRadius: 'small'
});
// minimal 
const minimalTemplate = templateService.createTemplate(theme_enum_1.ThemeType.MINIMAL, 'dark', {
    header: {
        show: true,
        logo: {
            type: 'text',
            text: 'TalkSpace',
            size: 'medium'
        }
    },
    body: {
        title: 'Pensamentos sobre design',
        message: 'Design é mais do que estética - é sobre criar experiências significativas. Em um mundo saturado de informações, o design minimalista nos lembra que menos é mais. Ao eliminar o excesso, podemos destacar o essencial e criar conexões mais profundas com nosso público. Menos distrações, mais impacto.',
        buttonText: 'Explorar Mais',
        buttonUrl: 'https://talkspace.com/design-thoughts',
        buttonVariant: 'primary',
        alignment: 'center',
        fontSize: 16
    },
    footer: {
        show: true,
        links: [
            { text: 'Sobre', url: 'https://empresa.com/sobre' },
            { text: 'Imprensa', url: 'https://empresa.com/imprensa' },
            { text: 'Carreiras', url: 'https://empresa.com/carreiras' },
            { text: 'Contato', url: 'https://empresa.com/contato' }
        ],
        socialLinks: [
            { platform: 'facebook', url: 'https://facebook.com' },
            { platform: 'twitter', url: 'https://twitter.com' },
            { platform: 'linkedin', url: 'https://linkedin.com' }
        ],
        copyrightText: 'TalkSpace'
    },
    layout: 'minimal',
    spacing: 'relaxed',
    borderRadius: 'none'
});
async function sendWelcomeEmail(to) {
    console.log(`\n📧 Enviando email de boas-vindas para ${to}...`);
    const result = await emailFactory.sendEmail({
        to,
        subject: 'Bem-vindo ao Meu App!',
        template: modernTemplate
    });
    console.log('Resultado:', result);
    return result;
}
async function sendTechNewsletter(to) {
    console.log(`\n📧 Enviando newsletter técnica para ${to}...`);
    const result = await emailFactory.sendEmail({
        to,
        subject: 'DevHub Newsletter - Novidades da Semana',
        template: monokaiTemplate
    });
    console.log('Resultado:', result);
    return result;
}
async function sendCorporateReport(to) {
    console.log(`\n📧 Enviando relatório corporativo para ${to}...`);
    const result = await emailFactory.sendEmail({
        to,
        subject: 'Relatório Trimestral - Q4 2024',
        template: corporateTemplate,
    });
    console.log('Resultado:', result);
    return result;
}
async function sendMinimalNewsletter(to) {
    console.log(`\n📧 Enviando newsletter minimalista para ${to}...`);
    const attachmentService = new attachment_service_1.AttachmentService();
    const attachment = await attachmentService.addFromPath('uploads/PHOTO.jpg');
    const result = await emailFactory.sendEmail({
        to,
        subject: 'Pensamentos sobre design',
        template: minimalTemplate,
        attachments: [
            {
                ...attachment
            }
        ]
    });
    console.log('Resultado:', result);
    return result;
}
app.get('/test', async (req, res) => {
    const result = await sendMinimalNewsletter('antiquesclub007@gmail.com');
    res.json(result);
});
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   📧 tzMail - Servidor de Teste                   ║
║                                                   ║
║   🚀 Servidor rodando em: http://localhost:${PORT}   ║
║                                                   ║
║   ⚠️  Configure seu SMTP no arquivo src/index.ts   ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
  `);
});
