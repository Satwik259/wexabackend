const activityLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    activityType: { type: String, enum: ['login', 'message', 'logout'], required: true },
    description: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  });
  
  const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
  