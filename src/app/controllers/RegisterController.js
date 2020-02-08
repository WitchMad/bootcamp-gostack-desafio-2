import { addMonths, parseISO, startOfHour } from 'date-fns';
import * as Yup from 'yup';
import Register from '../models/Register';
import Student from '../models/Student';
import Plan from '../models/Plan';
import WelcomeMail from '../jobs/WelcomeMail';
import Queue from '../../lib/Queue';

class RegisterController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation error' });
    }
    const { student_id, plan_id, start_date } = req.body;
    const studentExists = await Student.findByPk(student_id);
    if (!studentExists) {
      return res.status(400).json({ error: 'Student does not exist' });
    }
    const planExists = await Plan.findByPk(plan_id);
    if (!planExists) {
      return res.status(400).json({ error: 'Plan does not exist' });
    }
    const price = Number(planExists.price) * Number(planExists.duration);
    const end_date = addMonths(
      parseISO(start_date),
      Number(planExists.duration)
    );

    const register = await Register.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    await Queue.add(WelcomeMail.key, {
      studentExists,
      planExists,
      price,
      end_date,
    });

    return res.json(register);
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const registers = await Register.findAll({
      attributes: [
        'id',
        'start_date',
        'end_date',
        'price',
        'student_id',
        'plan_id',
        'active',
      ],
      order: ['id'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email', 'age', 'weight', 'height'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['title', 'duration', 'price'],
        },
      ],
    });

    return res.json(registers);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().integer(),
      plan_id: Yup.number().integer(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid)) {
      return res
        .status(400)
        .json({ error: 'There are problems with validation' });
    }

    const { student_id, plan_id, start_date } = req.body;
    const plan = await Plan.findByPk(plan_id);
    const hourStart = startOfHour(parseISO(start_date));

    const end_date = addMonths(parseISO(start_date), plan.duration);
    const priceFinal = plan.duration * plan.price;

    /**
     * Get all values of 'req.body' and unstructures
     */
    await Register.update(
      { ...req.body, end_date, price: priceFinal },
      {
        where: { id: req.params.id },
      }
    );

    return res.json({
      student_id,
      plan_id,
      start_date: hourStart,
      end_date,
      price: priceFinal,
    });
  }

  async delete(req, res) {
    const { id } = req.params;
    await Register.destroy({
      where: {
        id,
      },
    });
    return res.json({ ok: true });
  }
}

export default new RegisterController();
