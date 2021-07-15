import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Message from '../models/Message';
import Chat from '../models/Chat';
import Bookmark from '../models/Bookmark';

export const resolvers = {
    Query: {
        users(_, {}, ctx) {
            return ctx.isAuth ? User.find() : new Error('Unautheticated!');
        },
        user(_, {_id}, ctx) {
            return ctx.isAuth ? User.findById(_id) : new Error('Unautheticated!');
        },

        userByUserName(_, {username}, ctx) {
            return ctx.isAuth ? User.findOne({userName: username}) : new Error('Unautheticated!');
        },

        async messages(_, {}, ctx) {
            return ctx.isAuth ? Message.find() : new Error('Unautheticated!');          
        },

        messagesById(_, {_idChat, offset, limit}, ctx) {
            
            return ctx.isAuth ? Message.find({chat: _idChat}).limit(limit).skip(offset) : new Error('Unautheticated!');
        },

        message(_, {_id}, ctx) {
            return ctx.isAuth ? Message.findById(_id) : new Error('Unautheticated!');
        },

        chat(_, {_id}, ctx){ 
            return ctx.isAuth ? Chat.findById(_id).populate('guest') : new Error('Unautheticated!');
        },

        chats(_, {}, ctx) {
            return ctx.isAuth ? Chat.find() : new Error('Unautheticated!');
        },

        chatsByOwner(_, {_idOwner}, ctx) {
            if(!ctx.isAuth) {
                throw new Error('Unautheticated!');
            }

            const chat = Chat.find({owner: _idOwner}).populate({
                path: 'bookmarks',
                populate: {
                    path: 'message',
                    model: 'Message'
                }
            }).populate('guest');
            return chat;
        },

        async chatsByInvitation(_,{_idOwner}, ctx) {
            if(!ctx.isAuth) {
                throw new Error('Unautheticated!');
            }


            const chat = Chat.find({guest: _idOwner, shared: 'Yes'}).populate({
                path: 'bookmarks',
                populate: {
                    path: 'message',
                    model: 'Message'
                }
            });

            return chat
        },

        bookmarks(_, {}, ctx) {
            return ctx.isAuth ? Bookmark.find() : new Error('Unautheticated!');
        },

        bookmarksByOwner(_, {_idOwner, _idChat}, ctx) {
            if (!ctx.isAuth) {
                throw new Error('Unautheticated!');
            }
            return Bookmark.find({user: _idOwner});
        },

        messagesFavorites(_, {_idChat}, ctx) {
            return ctx.isAuth ? Message.find({chat: _idChat, favorite:true}) : new Error('Unautheticated!');
        }
    },
    Mutation: {
        async createUser(_, {input}) {
            if(await User.findOne({userName: input.userName})) {
                throw new Error('username already registered');
            }

            input.password = await bcrypt.hash(input.password, 12);

            const newUser = new User(input);
            await newUser.save();
            newUser.password = null;

            return newUser;
        },

        async login(_, {userName, password}) {
            const user = await User.findOne({userName: userName});
            if(!user) {
                throw new Error('Invalid Credentials!');
            }

            const isEqual = await bcrypt.compare(password, user.password);

            if(!isEqual) {
                throw new Error('Password wrong! Invalid Credentials!');
            }

            const token = jwt.sign({userId: user.id, userName: user.userName}, process.env.JWT_KEY, {
                expiresIn: '12h'
            });

            return {userId: user.id, token:token};
        },

        async updateUser(_, {_id, input}, ctx) {
            if(!ctx.isAuth) {
                throw new Error('Unautheticated!');
            }

            input.password = await bcrypt.hash(input.password, 12);

            return await User.findByIdAndUpdate(_id, input, {new:true});
        },

        async createMessage(_, {input}, ctx) {
            if(!ctx.isAuth) {
                throw new Error('Unautheticated!');
            }

            const newMessage = new Message(input);
            return await newMessage.save();
        },

        async createChat(_, {input}, ctx) {
            if(!ctx.isAuth) {
                throw new Error('Unautheticated!');
            }

            const newChat = new Chat(input);
            return await newChat.save();
        },

        async updateChat(_, {_id, nameChat, viewAs}, ctx) {
            if(!ctx.isAuth) {
                throw new Error('Unautheticated!');
            }
            return await Chat.findByIdAndUpdate(_id, {nameChat: nameChat, viewAs: viewAs}, {new: true});
        },

        async setBookmark(_, {_idChat, _idBookmark}, ctx) {
            if(!ctx.isAuth) {
                throw new Error('Unautheticated!');
            }

            const chat = await Chat.findById(_idChat);
            
            if(!chat.bookmarks.includes(_idBookmark)) {
                chat.bookmarks.push({_id: _idBookmark});
                chat.save();
            }

            return chat;
        },

        async setMessage(_, {_idChat, _idMessage}, ctx) {
            if(!ctx.isAuth) {
                throw new Error('Unautheticated!');
            }

            const chat = await Chat.findById(_idChat);
            chat.messages.push({_id: _idMessage});
            chat.save();
            return chat;
        },


        async addGuest(_, {_idChat, _idUser}, ctx) {
            if (!ctx.isAuth) {
                throw new Error('Unautheticated!');
            }

            const chat = await Chat.findById(_idChat);
            
            if(!chat.guest.includes(_idUser)) {
                chat.guest.push(_idUser);
                chat.save();
            }

            return chat;
        },

        async removeGuest(_, {_idChat, _idUser}, ctx) {
            if (!ctx.isAuth) {
                throw new Error('Unautheticated!');
            }

            const chat = await Chat.findById(_idChat);
            chat.guest.pull({_id: _idUser});
            await chat.save();
            const user = await User.findById(_idUser);
            user.save();


            return chat;
        },


        createBookmark(_, {input}, ctx) {
            if (!ctx.isAuth) {
                throw new Error('Unautheticated!');
            }

            const bookmark = new Bookmark(input);
            return bookmark.save();
        },

        updateBookmark(_, {_id, _idMessage, index}, ctx) {
            if (!ctx.isAuth) {
                throw new Error('Unautheticated!');
            }
            return Bookmark.findByIdAndUpdate(_id, {message: _idMessage, index: index}, {new: true});
        },


        async messagesArray(_, {input}, ctx) {



            if (!ctx.isAuth) {
                throw new Error('Unautheticated!');
            }
            
            await Message.insertMany(input);
            
            const idChat = input[0].chat;
            
            const chat = Chat.findById(idChat);
            
            return chat;

        },
        
        updateFavorite(_, {_idMessage, input}, ctx) {
            return ctx.isAuth ? Message.findByIdAndUpdate(_idMessage, {favorite: input}, {new: true}) : new Error('Unautheticated!');
        },

        async updateShared(_, {_idChat}, ctx) {
            const chat = await Chat.findById(_idChat);
            if(chat.shared == 'Yes') {
                chat.shared = 'No';
            } else {
                chat.shared = 'Yes';
            }
            return chat.save();
        }
    }
};