import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  question: String,
  answers: [String],
  correctAnswer: String,
  explanation: String,
});

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);