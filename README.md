# tzMail

A powerful and flexible TypeScript/Node.js email package built on top of Nodemailer, featuring a robust templating system with built-in themes, caching, and easy attachment management.

## Features

- 🚀 **Singleton Factory**: Easy initialization and global access.

- 🎨 **Themed Templates**: 5 built-in professional themes (Modern, Corporate, Minimal, Monokai, System).

- 🌓 **Dark Mode Support**: All templates support light and dark variants.

- ⚡ **Performance**: In-memory template caching with TTL and version history.

- 📎 **Attachment Service**: Simple helpers for local files and buffers.

- ✅ **Validation**: Built-in configuration validation for templates.

## Installation

```bash
npm install @zyther/tzmail
# or
yarn add @zyther/tzmail
```

## Quick Start

### 1. Initialize the Factory

```typescript
import { EmailFactory } from 'tzmail';

const smtpConfig = {
  host: 'smtp.example.com',
  port: 587,
  auth: {
    user: 'user@example.com',
    pass: 'password'
  },
  defaultFrom: 'My App <noreply@myapp.com>'
};

const emailFactory = EmailFactory.initialize(smtpConfig);
```

### 2. Create and Send an Email

```typescript
const templateService = emailFactory.getTemplateService();

// Create a template
const welcomeTemplate = templateService.createTemplate(
  'modern', // ThemeType
  'light',  // Variant
  {
    body: {
      title: 'Welcome!',
      message: 'Thanks for joining us.',
      buttonText: 'Get Started',
      buttonUrl: 'https://myapp.com'
    }
  }
 );

// Send the email
const result = await emailFactory.sendEmail({
  to: 'user@example.com',
  subject: 'Welcome aboard!',
  template: welcomeTemplate
});

console.log(result.success ? 'Sent!' : 'Failed');
```

## Core Components

### Themes

| Theme | Best For | Features |
| --- | --- | --- |
| `MODERN` | Modern UI apps | Gradients, glassmorphism, rounded corners. |
| `CORPORATE` | Business/Enterprise | Serif typography, gold accents, structured layout. |
| `MINIMAL` | Clean newsletters | High whitespace, focused content, neutral colors. |
| `MONOKAI` | Technical content | Syntax highlighting for code blocks, vibrant colors. |
| `SYSTEM` | General purpose | Clean, accessible, system-native look. |

### Attachment Service

Easily add attachments from paths or buffers:

```typescript
const attachmentService = emailFactory.getAttachmentService();
const file = await attachmentService.addFromPath('path/to/report.pdf');

await emailFactory.sendEmail({
  to: 'user@example.com',
  subject: 'Monthly Report',
  attachments: [file],
  html: '<p>Please find the report attached.</p>'
});
```

## Configuration Reference

### `ITemplateConfig`

Customize your email structure:

- **header**: `{ show: boolean, logo: { type: 'text' | 'image', ... } }`

- **body**: `{ title, message, buttonText, buttonUrl, alignment, ... }`

- **footer**: `{ show: boolean, links: [], socialLinks: [], copyrightText }`

- **layout**: `'full'` | `'minimal'`

- **spacing**: `'compact'` | `'normal'` | `'relaxed'`

## Error Handling

The `sendEmail` method returns a result object:

```typescript
{
  success: boolean;
  messageId?: string;
  response?: string;
  error?: any;
}
```

---
