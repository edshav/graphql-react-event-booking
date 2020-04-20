const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../utils/date');

const getEvents = (eventIds) => async () => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(async (event) => transformEvent(event));
  } catch (error) {
    throw error;
  }
};

const getSingleEvent = (eventId) => async () => {
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event);
  } catch (error) {
    throw error;
  }
};

const getUser = (userId) => async () => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      password: null,
      createdEvents: getEvents(user._doc.createdEvents),
    };
  } catch (error) {
    throw error;
  }
};

const transformEvent = (event) => ({
  ...event._doc,
  date: dateToString(event._doc.date),
  creator: getUser(event.creator),
});

const transformBooking = (booking) => ({
  ...booking._doc,
  user: getUser(booking._doc.user),
  event: getSingleEvent(booking._doc.event),
  createdAt: dateToString(booking._doc.createdAt),
  updatedAt: dateToString(booking._doc.updatedAt),
});

module.exports = { transformEvent, transformBooking };
