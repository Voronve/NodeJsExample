import mongoose from 'mongoose';

const { Schema } = mongoose;

const CourseMainSchema = Schema({
  name: { type: String, require: true },
  description: { type: String, require: true },
  time: { type: Array },
  price: { type: Array },
  icon: { type: String },
  client: { type: Array },
});
const CourseMain = mongoose.model('CourseMain', CourseMainSchema);
export default CourseMain;
