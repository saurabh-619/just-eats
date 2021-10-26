import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from './../common/common.constants';
import { EmailVars, MailModuleOptions } from './mail.interfaces';
import got from 'got';
import * as Formdata from 'form-data';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  private async sendEmail(
    subject: string,
    to: string,
    template: string,
    emailVariables: EmailVars[],
  ) {
    const form = new Formdata();
    form.append('from', `Admin | just-eats <mailgun@${this.options.domain}>`);
    form.append('to', to);
    form.append('subject', subject);
    form.append('template', template);
    emailVariables.forEach((eVar) => form.append(`v:${eVar.key}`, eVar.value));

    try {
      const response = await got(
        `https://api.mailgun.net/v3/${this.options.domain}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.options.apiKey}`,
            ).toString('base64')}`,
          },
          body: form,
        },
      );
      console.log({ res: response.body });
    } catch (e) {
      console.log({ e: e.message });
    }
  }

  sendVerficationEmail(email: string, code: string) {
    this.sendEmail('Verify your email', email, 'verify-email', [
      { key: 'code', value: code },
      { key: 'username', value: 'Saurabh' },
    ]);
  }
}
