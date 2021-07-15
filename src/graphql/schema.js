import {makeExecutableSchema} from "graphql-tools";
import { resolvers } from './resolver';

const typeDefs = `
    type Query {
        users: [User]
        user(_id: ID): User
        userByUserName(username: String): User

        messages: [Message]
        messagesById(_idChat: ID, offset: Int, limit: Int): [Message]
        message(_id: ID): Message

        messagesFavorites(_idChat: ID): [Message]

        chats: [Chat]
        chat(_id: ID): Chat
        chatsByOwner(_idOwner: ID): [Chat]
        chatsByInvitation(_idOwner: ID): [Chat]

        bookmarks: [Bookmark]
        bookmarksByOwner(_idOwner: ID!): [Bookmark]
        bookmarkByChat(_idChat: ID, _idUser: ID): Bookmark
    }

    type Mutation {
        createUser(input: UserInput!): User
        login(userName: String!, password: String!): AuthData
        updateUser(_id: ID!, input: UserInput): User

        createMessage(input: MessageInput!): Message
        
        updateFavorite(_idMessage: ID, input: Boolean): Message

        createChat(input: ChatInput!): Chat

        updateChat(_id: ID, nameChat: String, viewAs: String): Chat

        setBookmark(_idChat: ID!, _idBookmark: ID!): Chat

        setMessage(_idChat: ID!, _idMessage: ID!): Chat

        updateShared(_idChat: ID!): Chat

        addGuest(_idChat: ID!, _idUser: ID!): Chat
        removeGuest(_idChat: ID!, _idUser: ID!): Chat

        createBookmark(input: BookmarkInput): Bookmark
        updateBookmark(_id: ID!, _idMessage: ID!, index: Int): Bookmark
        
        messagesArray(input: [MessageInput]): Chat

    }

    type User {
        _id: ID
        userName: String
        password: String
        profilePic: String
    }

    input UserInput {
        userName: String!
        password: String!
        profilePic: String!
    }

    type AuthData {
        userId: ID!
        token: String!
    }

    input MessageInput {
        date: String!
        time: String!
        user: String!
        body: String!
        chat: String!
        favorite: Boolean
    }

    type Message {
        _id: ID
        date: String
        time: String
        user: String
        body: String
        chat: Chat
        favorite: Boolean
    }

    input ChatInput {
        nameChat: String!
        creationDate: String!
        owner: String!
        guest: [String]
        key: String
        shared: String
        favoriteMessages: [String]
        bookmarks: [String]
        messageUsers: [String]
        viewAs: String!
    }

    type Chat {
        _id: ID
        nameChat: String
        creationDate: String
        owner: User
        guest: [User]
        key: String
        shared: String
        favoriteMessages: [Message]
        bookmarks: [Bookmark]
        messageUsers: [String]
        viewAs: String
        chat: String
    }

    input BookmarkInput {
        message: String!
        user: String!
    }

    type Bookmark {
        _id: ID
        message: Message
        user: User
        index: Int
    }

`;

export default makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers
    }
)