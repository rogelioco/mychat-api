import express from 'express';
import {graphqlHTTP} from 'express-graphql';
import { connect } from './database';
import schema from './graphql/schema'
import {config} from 'dotenv';
import isAuth from './middleware/is-auth';
import cors from 'cors'

config();

const app = express();
connect();

app.use(isAuth, cors());

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema,
}));



const port = process.env.PORT;
app.listen(port, () => console.log(`server on port ${port}`))