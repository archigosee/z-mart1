import mongoose from 'mongoose';

const earnOptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  points: { type: Number, required: true },
  icon: { type: String, required: true },
  link: { 
    type: String, 
    default: '', 
    validate: {
      validator: function(v) {
        return this.text === "Invite Your Friend" || v.length > 0;
      },
      message: props => `${props.path} is required unless text is "Invite Your Friend"`
    }
  },
  requiresCheck: { type: Boolean, default: false },
});

export default mongoose.models.EarnOption || mongoose.model('EarnOption', earnOptionSchema);
