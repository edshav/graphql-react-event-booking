const DataLoader = require('dataloader');

const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../utils/date');

const eventLoader = new DataLoader((eventsIds) => getEvents(eventsIds));

const userLoader = new DataLoader((userIds) =>
  User.find({ _id: { $in: userIds } })
);

const getEvents = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(async (event) => transformEvent(event));
  } catch (error) {
    throw error;
  }
};

const getSingleEvent = (eventId) => async () => {
  try {
    const event = await eventLoader.load(eventId.toString());
    return event;
  } catch (error) {
    throw error;
  }
};

const getUser = (userId) => async () => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      password: null,
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents),
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
