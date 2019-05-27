import mongoose from 'mongoose';

const { Schema } = mongoose;

const ServiceOrdersShema = Schema({
  clientId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  serviceName: { type: String, required: true },
  price: { type: String, required: false },
  serviceId: { type: String, required: true },
  description: { type: String, required: false },
  adress: { type: String, required: true },
});

const ServiceOrders = mongoose.model('ServiceOrder', ServiceOrdersShema);

export default ServiceOrders;
