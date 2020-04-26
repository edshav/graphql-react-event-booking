import React from 'react';

import './BookingList.css';

const BookingList = ({ bookings, onDelete }) => {
  return (
    <ul className="bookings__list">
      {bookings.map(({ _id, event, createdAt }) => {
        return (
          <li key={_id} className="bookings__item">
            <div className="bookings__item-data">
              {event.title} - {new Date(createdAt).toLocaleDateString()}
            </div>
            <div className="bookings__item-actions">
              <button className="btn" onClick={onDelete.bind(this, _id)}>
                Cancel
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default BookingList;
