import React, { useState, useRef, useContext, useEffect } from 'react';

import './EventsPage.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../contexts/auth-context';
import EventList from '../components/events/EventList/EventList';
import Spinner from '../components/Spinner/Spinner';

const EventsPage = () => {
  const [creating, setCreating] = useState(false);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const titleElRef = useRef(null);
  const priceElRef = useRef(null);
  const dateElRef = useRef(null);
  const descriptionElRef = useRef(null);
  const isActive = useRef(true);
  const context = useContext(AuthContext);

  useEffect(() => {
    fetchEvents();
    return () => {
      isActive.current = false;
    };
  }, []);

  const startCreateEventHandler = () => {
    setCreating(true);
  };

  const onModalCancel = () => {
    setCreating(false);
    setSelectedEvent(null);
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
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        const event = {
          ...resData.data.createEvent,
          creator: { _id: context.userId },
        };
        setEvents((prevEvents) => [...prevEvents, event]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchEvents = () => {
    setIsLoading(true);
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
        if (isActive.current) {
          const { events } = resData.data;
          setEvents(events);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        if (isActive.current) {
          setIsLoading(false);
        }
      });
  };

  const onSelectEvent = (eventId) => {
    setSelectedEvent(events.find(({ _id }) => _id === eventId));
  };

  const bookEventHandler = () => {
    if (!context.token) {
      setSelectedEvent(null);
      return;
    }

    const requestBody = {
      query: `
        mutation {
          bookEvent(eventId: "${selectedEvent._id}") {
            _id
            createdAt
            updatedAt
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
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        setSelectedEvent(null);
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
            confirmText="Confirm"
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
      {selectedEvent && (
        <React.Fragment>
          <Backdrop onDismiss={onModalCancel} />
          <Modal
            title={selectedEvent.title}
            canCancel
            canConfirm
            onCancel={onModalCancel}
            onConfirm={bookEventHandler}
            confirmText={context.token ? 'Book' : 'Confirm'}
          >
            <h1>{selectedEvent.title}</h1>
            <h2>{`$${selectedEvent.price} - ${new Date(
              selectedEvent.date
            ).toLocaleDateString()}`}</h2>
            <p>{selectedEvent.description}</p>
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
      {isLoading ? (
        <Spinner />
      ) : (
        <EventList events={events} onSelectEvent={onSelectEvent} />
      )}
    </React.Fragment>
  );
};

export default EventsPage;
