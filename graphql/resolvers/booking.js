
const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { transformEvent, transformBooking } = require('./merge');

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (error) {}
  },
  bookEvent: async ({ eventId, userId }) => {
    const event = await Event.findById(eventId);

    const booking = new Booking({
      event,
      user: '5e9c9eaf5297f47a58244265',
    });
    const result = await booking.save();
    return transformBooking(result);
  },
  cancelBooking: async ({ bookingId }) => {
    try {
      const booking = await Booking.findById(bookingId).populate('event');
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: bookingId });
      return event;
    } catch (error) {
      throw error;
    }
  },
};
