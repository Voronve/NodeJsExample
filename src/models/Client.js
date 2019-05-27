import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  course: { type: Array },
  service: [
    {
      serviceName: { type: String },
      serviceId: { type: String },
      price: { type: String },
      description: { type: String },
      adress: { type: String },
      status: { type: String },
      time: { type: String },
    },
  ],
});

const Client = mongoose.model('Client', ClientSchema);

export default Client;
