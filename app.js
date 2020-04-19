const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHttp({
    schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
      creator: ID!
    }

    type User {
      _id: ID!
      email: String!
      password: String
      createdEvents: [Event]
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input UserInput {
      email: String!
      password: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
    rootValue: {
      events: async () => {
        try {
          const events = await Event.find();
          return events.map((event) => {
            return { ...event._doc, _id: event.id };
          });
        } catch (err) {
          throw err;
        }
      },
      createEvent: async (args) => {
        const { title, description, price, date } = args.eventInput;
        const event = new Event({
          title,
          description,
          price: parseFloat(price),
          date: new Date(date),
          creator: '5e9c5493e9330d323f6748e0',
        });
        try {
          const result = await event.save();
          const user = await User.findById('5e9c5493e9330d323f6748e0');
          if (!user) {
            throw new Error('User not found.');
          }
          user.createdEvents.push(event);
          await user.save();
          return { ...result._doc, _id: result._doc._id.toString() };
        } catch (err) {
          console.log(err);
          throw err;
        }
      },
      createUser: async (args) => {
        const { email, password } = args.userInput;
        try {
          const existingUser = await User.findOne({ email });
          if (existingUser) {
            throw new Error('User exists already.');
          }
          const hashedPassword = await bcrypt.hash(password, 12);
          const user = new User({
            email,
            password: hashedPassword,
          });
          const result = await user.save();
          return { ...result._doc, password: null, _id: result.id };
        } catch (err) {
          throw err;
        }
      },
    },
    graphiql: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@cluster0-elt7z.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
