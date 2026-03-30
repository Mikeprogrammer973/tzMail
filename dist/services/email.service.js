"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
/**
 * EmailService - Gerencia o envio de emails usando Nodemailer
 *
 * Métodos:
 * - send(options: IEmailOptions): Promise<any>
 *   Envia um email com as opções especificadas.
 *
 * Exemplo de uso:
 *
 * const emailService = new EmailService(transporter, 'from@example.com');
 * const result = await emailService.send({
 *   to: 'to@example.com',
 *   subject: 'Assunto do Email',
 *   template: myTemplate
 * });
 */
class EmailService {
    constructor(transporter, defaultFrom) {
        this.transporter = transporter;
        this.defaultFrom = defaultFrom;
    }
    /**
     * send - Envia um email com as opções especificadas
     * @param options - Opções para o email (to, cc, bcc, subject, text, html, template, attachments)
     * @returns Promise<any> - Resultado do envio do email
     * @throws Error se o envio falhar
     */
    async send(options) {
        const mailOptions = {
            from: options.from || this.defaultFrom,
            to: Array.isArray(options.to) ? options.to.join(',') : options.to,
            cc: options.cc,
            bcc: options.bcc,
            subject: options.subject,
            text: options.text,
            html: options.html || (options.template ? await options.template.render(options) : undefined),
            attachments: options.attachments
        };
        try {
            const info = await this.transporter.sendMail(mailOptions);
            return {
                success: true,
                messageId: info.messageId,
                response: info.response
            };
        }
        catch (error) {
            return {
                success: false,
                error: error
            };
        }
    }
}
exports.EmailService = EmailService;
