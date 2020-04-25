import React, { useContext } from 'react';

import './EventItem.css';
import AuthContext from '../../../contexts/auth-context';

const EventItem = ({
  eventId,
  title,
  price,
  date,
  creatorId,
  onSelectEvent,
}) => {
  const { userId } = useContext(AuthContext);
  console.log(typeof onSelectEvent);

  const onClickHandler = (eventId) => () => onSelectEvent(eventId);
  return (
    <li className="event__list-item">
      <div>
        <h1>{title}</h1>
        <h2>{`$${price} - ${new Date(date).toLocaleDateString()}`}</h2>
      </div>
      <div>
        {userId !== creatorId ? (
          <button className="btn" onClick={onClickHandler(eventId)}>
            View Detail
          </button>
        ) : (
          <p>Your the owner of this event</p>
        )}
      </div>
    </li>
  );
};

export default EventItem;
