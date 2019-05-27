import mongoose from 'mongoose';

const ClientBaseSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true },
  phone: { type: String, require: true },
});

const ClientBase = mongoose.model('ClientBase', ClientBaseSchema);

export default ClientBase;
