"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailFactory = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const email_service_1 = require("../services/email.service");
const template_service_1 = require("../services/template.service");
const attachment_service_1 = require("../services/attachment.service");
class EmailFactory {
    constructor(config, templateOptions) {
        const transporter = nodemailer_1.default.createTransport(config);
        this.emailService = new email_service_1.EmailService(transporter, config.defaultFrom);
        this.templateService = new template_service_1.TemplateService(templateOptions);
        this.attachmentService = new attachment_service_1.AttachmentService();
    }
    static initialize(config, templateOptions) {
        if (!this.instance) {
            this.instance = new EmailFactory(config, templateOptions);
        }
        return this.instance;
    }
    static getInstance() {
        if (!this.instance) {
            throw new Error('EmailFactory not initialized. Call initialize() first.');
        }
        return this.instance;
    }
    async sendEmail(options) {
        return this.emailService.send(options);
    }
    getTemplateService() {
        return this.templateService;
    }
    getAttachmentService() {
        return this.attachmentService;
    }
    async previewTemplate(themeType, variant, config, data) {
        return this.templateService.previewTemplate(themeType, variant, config, data);
    }
    getThemeInfo(themeType) {
        return this.templateService.getThemeInfo(themeType);
    }
    listThemes() {
        return this.templateService.listThemes();
    }
    getTemplateStats() {
        return this.templateService.getTemplateStats();
    }
}
exports.EmailFactory = EmailFactory;
