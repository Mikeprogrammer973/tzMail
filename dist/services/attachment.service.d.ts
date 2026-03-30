/// <reference types="node" />
/// <reference types="node" />
import { IAttachment } from '../core/interfaces/email.interface';
/**
 * AttachmentService - Gerencia anexos para emails
 *
 * Métodos:
 * - addFromPath(filePath: string, options?: Partial<IAttachment>): Promise<IAttachment>
 *   Adiciona um anexo a partir de um caminho de arquivo.
 *
 * - addFromBuffer(buffer: Buffer, filename: string, options?: Partial<IAttachment>): Promise<IAttachment>
 *   Adiciona um anexo a partir de um buffer em memória.
 *
 * - addFromUrl(url: string, filename: string): Promise<IAttachment>
 *   Adiciona um anexo a partir de uma URL (ainda não implementado).
 *
 * Exemplo de uso:
 *
 * const attachmentService = new AttachmentService();
 * const attachment = await attachmentService.addFromPath('path/to/file.pdf');
 *
 * emailFactory.sendEmail({
 *   to: 'user@example.com',
 *   subject: 'Assunto do Email',
 *   template: myTemplate,
 *   attachments: [{...attachment}]
 * });
 */
export declare class AttachmentService {
    /**
     * addFromPath - Adiciona um anexo a partir de um caminho de arquivo
     * @param filePath - Caminho do arquivo a ser anexado
     * @param options - Opções adicionais para o anexo (filename, contentType, cid)
     * @returns Promise<IAttachment> - Objeto de anexo formatado para Nodemailer
     * @throws Error se o caminho não for um arquivo válido
     */
    addFromPath(filePath: string, options?: Partial<IAttachment>): Promise<IAttachment>;
    addFromBuffer(buffer: Buffer, filename: string, options?: Partial<IAttachment>): Promise<IAttachment>;
    /**
     * addFromUrl - Adiciona um anexo a partir de uma URL (a ser implementado)
     * @param url - URL do recurso a ser anexado
     * @param filename - Nome do arquivo para o anexo
     * @returns Promise<IAttachment> - Objeto de anexo formatado para Nodemailer
     * @throws Error se o método não for implementado
     */
    addFromUrl(url: string, filename: string): Promise<IAttachment>;
}
//# sourceMappingURL=attachment.service.d.ts.map