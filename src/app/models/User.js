import { Sequelize, Model } from 'sequelize';
import bcryot from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  checkPassowrd(password) {
    return bcryot.compare(password, this.password_hash);
  }
}

export default User;
