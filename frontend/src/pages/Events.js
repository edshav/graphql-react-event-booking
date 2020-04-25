import React, { useState, useRef, useContext, useEffect } from 'react';

import './Events.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../contexts/auth-context';

const Events = () => {
  const [creating, setCreating] = useState(false);
  const [events, setEvents] = useState([]);
  const titleElRef = useRef(null);
  const priceElRef = useRef(null);
  const dateElRef = useRef(null);
  const descriptionElRef = useRef(null);
  const context = useContext(AuthContext);

  useEffect(() => {
    fetchEvents();
  }, []);

  const startCreateEventHandler = () => {
    setCreating(true);
  };

  const onModalCancel = () => {
    setCreating(false);
  };

  const onModalConfirm = () => {
    setCreating(false);

    const title = titleElRef.current.value;
    const price = parseFloat(priceElRef.current.value).toFixed(2);
    const date = dateElRef.current.value;
    const description = descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const requestBody = {
      query: `
        mutation {
          createEvent(eventInput: {title: "${title}", price: ${price}, date: "${date}", description: "${description}"} ) {
            _id
            title
            price
            date
            description
            creator {
              _id
              email
            }
          }
        }
    `,
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${context.token}`,
      },
    })
      .then((res) => {
        console.log(res.status);
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        fetchEvents();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchEvents = () => {
    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            price
            date
            description
            creator {
              _id
              email
            }
          }
        }
    `,
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log(res.status);
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        const { events } = resData.data;
        setEvents(events);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <React.Fragment>
      {creating && (
        <React.Fragment>
          <Backdrop onDismiss={onModalCancel} />
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={onModalCancel}
            onConfirm={onModalConfirm}
          >
            <form onSubmit={onModalConfirm}>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" name="title" ref={titleElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="price">price</label>
                <input type="number" id="price" name="price" ref={priceElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="date">date</label>
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  ref={dateElRef}
                />
              </div>
              <div className="form-control">
                <label htmlFor="description">description</label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  ref={descriptionElRef}
                />
              </div>
            </form>
          </Modal>
        </React.Fragment>
      )}
      {!!context.token && (
        <div className="events-control">
          <p>Share your own events!</p>
          <button className="btn" onClick={startCreateEventHandler}>
            Create Event
          </button>
        </div>
      )}
      <ul className="events__list">
        {events.map(({ _id, title }) => (
          <li key={_id} className="events__list-item">
            {title}
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
};

export default Events;
