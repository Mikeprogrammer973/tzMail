/// <reference types="node" />
/// <reference types="node" />
import { ITemplate } from "./template.interface";
export interface IEmailOptions {
    to: string | string[];
    subject: string;
    from?: string;
    cc?: string | string[];
    bcc?: string | string[];
    attachments?: IAttachment[];
    template?: ITemplate;
    text?: string;
    html?: string;
}
export interface IAttachment {
    filename: string;
    content?: string | Buffer;
    path?: string;
    contentType?: string;
    cid?: string;
}
export interface IEmailConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
    defaultFrom?: string;
}
//# sourceMappingURL=email.interface.d.ts.map