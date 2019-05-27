import mongoose from 'mongoose';

const { Schema } = mongoose;

const ServiceShema = Schema({
  name: { type: String, require: true },
  img: { type: String, require: true }, // когда фронт скажет,убрать это
  icon: { type: String, require: true },
  description: { type: String, require: true },
  price: { type: Array, require: false },
});

const Service = mongoose.model('Service', ServiceShema);

export default Service;
