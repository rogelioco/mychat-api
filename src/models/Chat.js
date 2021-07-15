import {Schema, model} from 'mongoose';

const chatSchema = new Schema({
    nameChat: {
        type: String,
        required: true
    },

    creationDate: {
        type:String,
        required: true
    },

    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true},

    guest: [{ type: Schema.Types.ObjectId, ref: 'User', required: false}],

    key: {
        type:String,
        required: false
    },

    shared: {
        type: String,
        enum: ['No', 'Yes'],
        default: 'No'
    },

    bookmarks: [{ type: Schema.Types.ObjectId, ref: 'Bookmark', required: false, autopopulate: true }],

    messageUsers: [{type: String, required: false}],

    viewAs: {
        type: String,
        required: true,
    }
});
chatSchema.plugin(require('mongoose-autopopulate'));
export default model('Chat', chatSchema);