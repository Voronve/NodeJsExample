import mongoose from 'mongoose';

const { Schema } = mongoose;

const MasterclassKidScheema = Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  icon: { type: String, required: true },
  price: { type: String, required: true },
  duration: { type: String, required: true },
  client: { type: Array, required: false },
});
const MasterKid = mongoose.model('MasterKid', MasterclassKidScheema);
export default MasterKid;
