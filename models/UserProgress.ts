import mongoose from 'mongoose';

const UserProgressSchema = new mongoose.Schema({
  email: String,
  correctAnswers: Number,
  totalQuestions: Number,
});

export default mongoose.models.UserProgress || mongoose.model('UserProgress', UserProgressSchema);