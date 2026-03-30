import { Transporter } from 'nodemailer';
import { IEmailOptions } from '../core/interfaces/email.interface';
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
export declare class EmailService {
    private transporter;
    private defaultFrom?;
    constructor(transporter: Transporter, defaultFrom?: string | undefined);
    /**
     * send - Envia um email com as opções especificadas
     * @param options - Opções para o email (to, cc, bcc, subject, text, html, template, attachments)
     * @returns Promise<any> - Resultado do envio do email
     * @throws Error se o envio falhar
     */
    send(options: IEmailOptions): Promise<any>;
}
//# sourceMappingURL=email.service.d.ts.map