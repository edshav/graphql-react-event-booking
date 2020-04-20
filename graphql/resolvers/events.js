const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => transformEvent(event));
    } catch (error) {
      throw error;
    }
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
      return transformEvent(result);
    } catch (error) {
      throw error;
    }
  },
};
