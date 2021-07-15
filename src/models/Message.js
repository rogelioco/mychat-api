import {Schema, model} from 'mongoose';

const messageSchema = new Schema({
    date: {
        type: String,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    user: {
        type: String,
        required: true
    },

    body: {
        type: String,
        required: true
    },

    chat: {type: Schema.Types.ObjectId, ref: 'Chat', required: true, autopopulate: true},

    favorite: {
        type: Boolean,
        default: false,
        required: true
    }
});
messageSchema.plugin(require('mongoose-autopopulate'));
export default model('Message', messageSchema);