import React from 'react';

import './EventList.css';
import EventItem from '../EventItem/EventItem';

const EventList = ({ events, onSelectEvent }) => {
  return (
    <ul className="event__list">
      {events.map(({ _id, title, price, date, creator }) => (
        <EventItem
          key={_id}
          eventId={_id}
          title={title}
          price={price}
          date={date}
          creatorId={creator._id}
          onSelectEvent={onSelectEvent}
        />
      ))}
    </ul>
  );
};

export default EventList;
