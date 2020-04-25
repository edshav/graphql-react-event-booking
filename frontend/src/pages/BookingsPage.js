import React, { useState, useEffect, useContext } from 'react';

import AuthContext from '../contexts/auth-context';
import Spinner from '../components/Spinner/Spinner';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(AuthContext);

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, []);

  const fetchBookings = () => {
    setIsLoading(true);
    const requestBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            event {
              _id
              title
              date
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
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        const { bookings } = resData.data;
        setBookings(bookings);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  return isLoading ? (
    <Spinner />
  ) : (
    <ul>
      {bookings.map(({ _id, event, createdAt }) => (
        <li key={_id}>
          {event.title} - {new Date(createdAt).toLocaleDateString()}
        </li>
      ))}
    </ul>
  );
};

export default BookingsPage;
