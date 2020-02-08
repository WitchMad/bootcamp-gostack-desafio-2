import * as Yup from 'yup';
import HelpOrder from '../models/Help';
import Student from '../models/Student';
import AnswerHelpOrderMail from '../jobs/AnswerHelpOrderMail';
import Queue from '../../lib/Queue';

class HelpController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      question: Yup.string().required(),
    });
    if (
      !(await schema.isValid({
        student_id: req.params.id,
        question: req.body.question,
      }))
    ) {
      return res.status(400).json({ error: 'Validation error' });
    }
    const { question } = req.body;
    const help = await HelpOrder.create({
      student_id: req.params.id,
      question,
    });

    return res.json(help);
  }

  async index(req, res) {
    const { id = null } = req.params;
    const { page = 1 } = req.query;
    if (id) {
      const helpOrders = await HelpOrder.findAll({
        where: { student_id: id },
        order: ['id'],
        limit: 20,
        offset: (page - 1) * 20,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['name', 'email', 'age', 'weight', 'height'],
          },
        ],
      });

      return res.json(helpOrders);
    }
    const helpOrders = await HelpOrder.findAll({
      order: ['id'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email', 'age', 'weight', 'height'],
        },
      ],
    });

    return res.json(helpOrders);
  }

  async update(req, res) {
    const { id } = req.params;
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      answer: Yup.string().required(),
    });
    if (!(await schema.isValid({ id, answer: req.body.answer }))) {
      return res.status(400).json({ error: 'Validation error' });
    }
    const helpOrder = await HelpOrder.findOne({
      where: { id },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });
    if (!helpOrder) {
      return res.status(400).json({ error: 'Help order not found' });
    }
    const response = await helpOrder.update({
      answer: req.body.answer,
      answer_at: new Date(),
    });

    await Queue.add(AnswerHelpOrderMail.key, {
      response,
      answer_at: new Date(),
    });

    return res.json(response);
  }
}

export default new HelpController();
