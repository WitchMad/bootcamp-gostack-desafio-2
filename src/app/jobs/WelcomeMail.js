import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class WelcomeMail {
  get key() {
    return 'WelcomeMail';
  }

  async handle({ data }) {
    const { studentExists, planExists, price, end_date } = data;

    await Mail.sendMail({
      to: `${studentExists.name} <${studentExists.email}>`,
      subject: 'Bem Vindo à GymPoint',
      template: 'welcome',
      context: {
        student: studentExists.name,
        plan: planExists.title,
        price,
        end_date: format(parseISO(end_date), "'dia' dd 'de' MMMM 'de' Y", {
          locale: pt,
        }),
      },
    });
  }
}

export default new WelcomeMail();
