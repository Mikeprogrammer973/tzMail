
import nodemailer from 'nodemailer';
import { IEmailConfig, IEmailOptions } from '../core/interfaces/email.interface';
import { EmailService } from '../services/email.service';
import { TemplateService } from '../services/template.service';
import { AttachmentService } from '../services/attachment.service';
import { ThemeType } from '../core/enums/theme.enum';
import { ITemplateConfig } from '../core/interfaces/template.interface';

export class EmailFactory {
  private static instance: EmailFactory;
  private emailService: EmailService;
  private templateService: TemplateService;
  private attachmentService: AttachmentService;

  private constructor(config: IEmailConfig, templateOptions?: any) {
    const transporter = nodemailer.createTransport(config);
    this.emailService = new EmailService(transporter, config.defaultFrom);
    this.templateService = new TemplateService(templateOptions);
    this.attachmentService = new AttachmentService();
  }

  static initialize(config: IEmailConfig, templateOptions?: any): EmailFactory {
    if (!this.instance) {
      this.instance = new EmailFactory(config, templateOptions);
    }
    return this.instance;
  }

  static getInstance(): EmailFactory {
    if (!this.instance) {
      throw new Error('EmailFactory not initialized. Call initialize() first.');
    }
    return this.instance;
  }

  async sendEmail(options: IEmailOptions): Promise<any> {
    return this.emailService.send(options);
  }

  getTemplateService(): TemplateService {
    return this.templateService;
  }

  getAttachmentService(): AttachmentService {
    return this.attachmentService;
  }
  
  async previewTemplate(
    themeType: ThemeType,
    variant: 'light' | 'dark',
    config: ITemplateConfig,
    data: any
  ): Promise<string> {
    return this.templateService.previewTemplate(themeType, variant, config, data);
  }
  
  getThemeInfo(themeType: ThemeType) {
    return this.templateService.getThemeInfo(themeType);
  }
  
  listThemes() {
    return this.templateService.listThemes();
  }
  
  getTemplateStats() {
    return this.templateService.getTemplateStats();
  }
}