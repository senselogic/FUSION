// -- IMPORTS

import { Resend } from "resend";
import { logError } from "senselogic-opus";

// -- TYPES

class ResendService {
  client: Resend | null;
  key: string | undefined;

  constructor() {
    this.client = null;
    this.key = process.env.FUSION_PROJECT_RESEND_KEY;
  }

  // -- INQUIRIES

  getClient(): Resend {
    if (this.client === null) {
      this.client = new Resend(this.key ?? "");
    }

    return this.client;
  }

  // -- OPERATIONS

  async sendMail(sender: string, recipientArray: string[], subject: string, emailBody: string) {
    const { data, error } = await this.getClient().emails.send({
      from: sender,
      to: recipientArray,
      subject,
      html: emailBody,
    });

    if (error !== null) {
      logError(error);
    }

    return data;
  }

  // ~~

  async sendTemplateEmail(sender: string, recipientArray: string[], subject: string, emailTemplateBody: unknown) {
    const { data, error } = await this.getClient().emails.send({
      from: sender,
      to: recipientArray,
      subject,
      react: emailTemplateBody as any,
    });

    if (error !== null) {
      logError(error);
    }

    return data;
  }
}

// -- VARIABLES

export const resendService = new ResendService();

