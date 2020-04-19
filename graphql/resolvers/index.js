const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');

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
  } catch (error) {
    throw error;
  }
};

const getSingleEvent = (eventId) => async () => {
  try {
    const event = await Event.findById(eventId);
    return {
      ...event._doc,
      date: new Date(event._doc.date).toISOString(),
      creator: getUser(event.creator),
    };
  } catch (error) {
    throw error;
  }
};

const getUser = (userId) => async () => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      createdEvents: getEvents(user._doc.createdEvents),
    };
  } catch (error) {
    throw error;
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
    } catch (error) {
      throw error;
    }
  },
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return {
          ...booking._doc,
          user: getUser(booking._doc.user),
          event: getSingleEvent(booking._doc.event),
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString(),
        };
      });
    } catch (error) {}
  },
  createEvent: async ({ eventInput }) => {
    try {
      const { title, description, price, date } = eventInput;
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
    } catch (error) {
      throw error;
    }
  },
  createUser: async ({ userInput }) => {
    const { email, password } = userInput;
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
    } catch (error) {
      throw error;
    }
  },
  bookEvent: async ({ eventId, userId }) => {
    const event = await Event.findById(eventId);

    const booking = new Booking({
      event,
      user: '5e9c9eaf5297f47a58244265',
    });
    const result = await booking.save();
    return {
      ...result._doc,
      user: getUser(booking._doc.user),
      event: getSingleEvent(booking._doc.event),
      createdAt: new Date(booking._doc.createdAt).toISOString(),
      updatedAt: new Date(booking._doc.updatedAt).toISOString(),
    };
  },
  cancelBooking: async ({ bookingId }) => {
    try {
      const booking = await Booking.findById(bookingId).populate('event');
      const event = {
        ...booking.event._doc,
        creator: getUser(booking.event._doc.creator),
      };
      await Booking.deleteOne({ _id: bookingId });
      return event;
    } catch (error) {
      throw error;
    }
  },
};
