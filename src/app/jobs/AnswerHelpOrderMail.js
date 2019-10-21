import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class AnswerHelpOrderMail {
  get key() {
    return 'AnswerHelpOrderMail';
  }

  async handle({ data }) {
    const { response, answer_at } = data;

    await Mail.sendMail({
      to: `${response.student.name} <${response.student.email}>`,
      subject: 'Resposta de Pedido de Auxílio - GymPoint',
      template: 'helpOrder',
      context: {
        student: response.student.name,
        question: response.question,
        answer: response.answer,
        answer_at: format(parseISO(answer_at), "'dia' dd 'de' MMMM 'de' Y", {
          locale: pt,
        }),
      },
    });
  }
}

export default new AnswerHelpOrderMail();
