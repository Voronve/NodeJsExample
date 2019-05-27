import mongoose from 'mongoose';

const { Schema } = mongoose;

const AdminSchema = Schema({
  name: { type: String, require: true },
  email: { type: String, require: true },
  phone: { type: String, require: false },
  password: { type: String, require: true },
});

const Admin = mongoose.model('Admin', AdminSchema);

export default Admin;
