
import express, { Request, Response } from 'express';
import { ThemeType } from './core/enums/theme.enum';
import { EmailFactory } from './factories/email-factory';

import dotenv from 'dotenv';
import { AttachmentService } from './services/attachment.service';
dotenv.config();



export { EmailFactory } from './factories/email-factory';
export { TemplateFactory } from './factories/template-factory';
export { ITemplate, ITemplateConfig } from './core/interfaces/template.interface';
export { ThemeType } from './core/enums/theme.enum';
export { ITheme } from './templates/themes/theme.interface';
export { TemplateService } from './services/template.service';
export { EmailService } from './services/email.service';
export { AttachmentService } from './services/attachment.service';
export { TemplateBuilder } from './templates/base/template-builder';
export { CorporateTheme } from './templates/themes/corporate.theme';
export { MinimalTheme } from './templates/themes/minimal.theme';
export { ModernTheme } from './templates/themes/modern.theme';
export { MonokaiTheme } from './templates/themes/monokai.theme';
export { SystemTheme } from './templates/themes/system.theme';




/*  
*
*
* *
* *
* *   🚀 tzMail - Servidor de Teste
*/

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const SMTP_CONFIG = {
  host: 'smtp.gmail.com',     
  port: 587,                   
  secure: false,               
  auth: {
    user: process.env.SMTP_USER!,    
    pass: process.env.SMTP_PASS!           
  },
  defaultFrom: 'LyraX Corp <lyrax.com@gmail.com>'
};

// init EmailFactory
const emailFactory = EmailFactory.initialize(SMTP_CONFIG);
const templateService = emailFactory.getTemplateService();


// modern
const modernTemplate = templateService.createTemplate(
  ThemeType.MODERN,
  'light',
  {
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
  }
);

// monokai 
const monokaiTemplate = templateService.createTemplate(
  ThemeType.MONOKAI,
  'light',
  {
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
  }
);

// corporate 
const corporateTemplate = templateService.createTemplate(
  ThemeType.CORPORATE,
  'dark',
  {
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
  }
);

// minimal 
const minimalTemplate = templateService.createTemplate(
  ThemeType.MINIMAL,
  'dark',
  {
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
  }
);


async function sendWelcomeEmail(to: string) {
  console.log(`\n📧 Enviando email de boas-vindas para ${to}...`);

  const result = await emailFactory.sendEmail({
    to,
    subject: 'Bem-vindo ao Meu App!',
    template: modernTemplate
  });
  
  console.log('Resultado:', result);
  return result;
}

async function sendTechNewsletter(to: string) {
  console.log(`\n📧 Enviando newsletter técnica para ${to}...`);
  
  const result = await emailFactory.sendEmail({
    to,
    subject: 'DevHub Newsletter - Novidades da Semana',
    template: monokaiTemplate
  });
  
  console.log('Resultado:', result);
  return result;
}

async function sendCorporateReport(to: string) {
  console.log(`\n📧 Enviando relatório corporativo para ${to}...`);
  
  const result = await emailFactory.sendEmail({
    to,
    subject: 'Relatório Trimestral - Q4 2024',
    template: corporateTemplate,
  });
  
  console.log('Resultado:', result);
  return result;
}

async function sendMinimalNewsletter(to: string) {
  console.log(`\n📧 Enviando newsletter minimalista para ${to}...`);
  
  const attachmentService = new AttachmentService();
  
  const attachment = await attachmentService.addFromPath('uploads/PHOTO.jpg')

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


app.get('/test', async (req: Request, res: Response) => {
  const result = await sendMinimalNewsletter('antiquesclub007@gmail.com')
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