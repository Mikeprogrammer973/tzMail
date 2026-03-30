"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentService = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
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
class AttachmentService {
    /**
     * addFromPath - Adiciona um anexo a partir de um caminho de arquivo
     * @param filePath - Caminho do arquivo a ser anexado
     * @param options - Opções adicionais para o anexo (filename, contentType, cid)
     * @returns Promise<IAttachment> - Objeto de anexo formatado para Nodemailer
     * @throws Error se o caminho não for um arquivo válido
     */
    async addFromPath(filePath, options) {
        const stats = await fs.promises.stat(filePath);
        if (!stats.isFile()) {
            throw new Error(`Path is not a file: ${filePath}`);
        }
        return {
            filename: (options === null || options === void 0 ? void 0 : options.filename) || path.basename(filePath),
            path: filePath,
            contentType: options === null || options === void 0 ? void 0 : options.contentType,
            cid: options === null || options === void 0 ? void 0 : options.cid
        };
    }
    async addFromBuffer(buffer, filename, options) {
        return {
            filename,
            content: buffer,
            contentType: options === null || options === void 0 ? void 0 : options.contentType,
            cid: options === null || options === void 0 ? void 0 : options.cid
        };
    }
    /**
     * addFromUrl - Adiciona um anexo a partir de uma URL (a ser implementado)
     * @param url - URL do recurso a ser anexado
     * @param filename - Nome do arquivo para o anexo
     * @returns Promise<IAttachment> - Objeto de anexo formatado para Nodemailer
     * @throws Error se o método não for implementado
     */
    addFromUrl(url, filename) {
        throw new Error('Method not implemented yet');
    }
}
exports.AttachmentService = AttachmentService;
