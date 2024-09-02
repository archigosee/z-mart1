import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema({
  inviterId: { type: String, required: true },
  inviteeId: { type: String, required: true },
  joined: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Invitation || mongoose.model('Invitation', invitationSchema);
