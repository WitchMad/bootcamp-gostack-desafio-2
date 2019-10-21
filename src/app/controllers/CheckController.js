import { subDays } from 'date-fns';
import Check from '../schemas/Check';
import Student from '../models/Student';

class CheckController {
  async store(req, res) {
    const studentExist = await Student.findByPk(req.params.id);
    if (!studentExist) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    const daysAgo = subDays(new Date(), 7);
    const verifyCheckIn = await Check.find({
      createdAt: {
        $gte: daysAgo,
        $lte: new Date(),
      },
    }).count();

    if (verifyCheckIn === 5) {
      return res
        .status(400)
        .json({ error: 'You can not do more than 5 checkins in 7 days' });
    }

    const checkIn = await Check.create({
      student_id: req.params.id,
    });

    return res.json(checkIn);
  }

  async index(req, res) {
    const checkIn = await Check.find({
      student_id: req.params.id,
    });
    return res.json(checkIn);
  }
}

export default new CheckController();
