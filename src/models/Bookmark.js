import {Schema, model} from 'mongoose';

const bookmarkSchema = new Schema({
    message: {type: Schema.Types.ObjectId, ref: 'Message', required: true, autopopulate: true},

    user: {type: Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true},

    index: {type: Number, required: false, default: 50}
})
bookmarkSchema.plugin(require('mongoose-autopopulate'));
export default model('Bookmark', bookmarkSchema);