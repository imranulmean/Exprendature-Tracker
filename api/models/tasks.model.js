import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    userId: { type: String, required: true }, 
    purpose: { type: String, required: true }, 
  }, { timestamps: true });
  
const Tasks = mongoose.model('Tasks', TaskSchema);

export default Tasks;
