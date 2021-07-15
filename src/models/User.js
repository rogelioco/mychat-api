import {Schema, model} from 'mongoose';
const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    profilePic: String,
});

export default model('User', userSchema);