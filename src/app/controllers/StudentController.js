import * as Yup from 'yup';
import { Op } from 'sequelize';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const studentExists = await Student.findOne({
      where: {
        email: req.body.email,
        name: req.body.name,
      },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists.' });
    }
    const { id, name, email, age, weight, height } = await Student.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }

  async delete(req, res) {
    const { id } = req.params;
    const student = await Student.findByPk(id);
    if(!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    await student.destroy();
    return res.status(200).json({ msg: 'Student deleted' });
  }

  async update(req, res) {
    const { id } = req.params;
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string(),
      age: Yup.number(),
      weight: Yup.number(),
      height: Yup.number(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const student = await Student.findByPk(id);
    if(!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    await student.update(req.body);
    return res.status(200).json({ msg: 'Student updated' });
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    if (req.query.name) {
      const response = await Student.findAll({
        where: {
          name: {
            [Op.iLike]: `%${req.query.name}%`,
          },
        },
        order: ['name'],
        limit: 20,
        offset: (page - 1) * 20,
      });
      return res.json(response);
    }
    const response = await Student.findAll({
      order: ['name'],
      limit: 20,
      offset: (page - 1) * 20,
    });
    return res.json(response);
  }
}

export default new StudentController();
