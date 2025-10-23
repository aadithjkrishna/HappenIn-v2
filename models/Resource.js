import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
    resourceName: { type: String, required: true },
    quantity: { type: Number, required: true }
});

export default mongoose.model('Resource', resourceSchema);