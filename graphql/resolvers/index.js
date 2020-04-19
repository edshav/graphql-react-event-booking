const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');

const getEvents = (eventIds) => async () => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(async (event) => {
      return {
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: getUser(event.creator),
      };
    });
  } catch (err) {
    throw err;
  }
};

const getUser = (userId) => async () => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      createdEvents: getEvents(user._doc.createdEvents),
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return {
          ...event._doc,
          date: new Date(event._doc.date).toISOString(),
          creator: getUser(event._doc.creator),
        };
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args) => {
    try {
    const { title, description, price, date } = args.eventInput;
    const event = new Event({
      title,
      description,
      price: parseFloat(price),
      date: new Date(date),
      creator: '5e9c9eaf5297f47a58244265',
    });
      const result = await event.save();
      const user = await User.findById('5e9c9eaf5297f47a58244265');
      if (!user) {
        throw new Error('User not found.');
      }
      user.createdEvents.push(event);
      await user.save();
      const createdEvent = {
        ...result._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: getUser(result._doc.creator),
      };
      return createdEvent;
    } catch (err) {
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
      return { ...result._doc, password: null };
    } catch (err) {
      throw err;
    }
  },
};
