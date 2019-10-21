import mongoose from 'mongoose';

const CheckSchema = new mongoose.Schema(
  {
    student_id: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Check', CheckSchema);
