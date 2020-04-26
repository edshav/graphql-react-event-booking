const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { transformEvent, transformBooking } = require('./merge');

module.exports = {
  bookings: async (_args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const bookings = await Booking.find({ user: req.userId });
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (error) {}
  },
  bookEvent: async ({ eventId }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const event = await Event.findById(eventId);

    const booking = new Booking({
      event,
      user: req.userId,
    });
    const result = await booking.save();
    return transformBooking(result);
  },
  cancelBooking: async ({ bookingId }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
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
