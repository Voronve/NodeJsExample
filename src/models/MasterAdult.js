import mongoose from 'mongoose';

const { Schema } = mongoose;

const MasterclassAdultScheema = Schema({
  name: { type: String, require: true },
  icon: { type: String, require: true },
  info: { type: String, require: true },
  desc: { type: Array },
  client: { type: Array },
});

const MasterAdult = mongoose.model('MasterAdult', MasterclassAdultScheema);

export default MasterAdult;
