import axios from 'axios';
import { showAlert } from './alert';

export const bookTour = async (tourId) => {
  try {
    const session = await axios(
      `http://localhost:3000/api/v1/booking/checkout-session/${tourId}`,
    );
    if (session.data.status !== 'success') {
      throw new Error('Failed to create order');
    }
    console.log(session);
    window.location.href = session.data.paymentUrl;
  } catch (err) {
    console.error('Booking error:', err);
    showAlert('error', err.response?.data?.message || 'Error booking tour!');
  }
};
