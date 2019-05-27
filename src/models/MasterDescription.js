import mongoose from 'mongoose';

const { Schema } = mongoose;

const MasterDescriptionScheema = Schema({
  imgDesc: { type: String, require: true },
  image: { type: String, require: true },
});

const MasterDesc = mongoose.model('MasterDesc', MasterDescriptionScheema);

export default MasterDesc;
