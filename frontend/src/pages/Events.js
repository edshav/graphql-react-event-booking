import React, { useState } from 'react';

import './Events.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';

const Events = () => {
  const [creating, setCreating] = useState(false);

  const startCreateEventHandler = () => {
    setCreating(true);
  };

  const onModalCancel = () => {
    setCreating(false);
  };

  const onModalConfirm = () => {
    setCreating(false);
  };

  return (
    <React.Fragment>
      <div className="events-control">
        <p>Share your own events!</p>
        <button className="btn" onClick={startCreateEventHandler}>
          Create Event
        </button>
      </div>
      {creating && (
        <React.Fragment>
          <Backdrop onDismiss={onModalCancel} />
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={onModalCancel}
            onConfirm={onModalConfirm}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Events;
