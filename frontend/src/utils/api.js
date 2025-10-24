import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

// export const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
// });
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

// 공통 에러 처리 함수
const handleError = (error, msg = 'Something went wrong') => {
  console.error('API Error:', error);
  toast.error(msg);
  throw error;
};

export const getAllProperties = async () => {
  try {
    const response = await api.get('/residency/allresd', {
      timeout: 10 * 1000,
    });
    if (response.status === 400 || response.status === 500) {
      throw response.data;
    }
    return response.data;
  } catch (err) {
    // toast.error("Something's not right");
    // throw error;
    handleError(err, 'Failed to fetch properties');
  }
};

export const getProperty = async (id) => {
  try {
    const response = await api.get(`/residency/${id}`, {
      timeout: 10 * 1000,
    });
    if (response.status === 400 || response.status === 500) {
      throw response.data;
    }
    return response.data;
  } catch (error) {
    // toast.error("Something's not right");
    // throw error;
    handleError(error, 'Failed to load property details');
  }
};

export const createUser = async (email, token) => {
  try {
    await api.post(
      `/user/register`,
      { email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    // toast.error("Something's not right, Please Try again");
    // throw error;
    handleError(error, 'User registration failed');
  }
};

export const bookVisit = async (date, propertyId, email, token) => {
  try {
    await api.post(
      `/user/bookVisit/${propertyId}`,
      {
        email,
        id: propertyId,
        date: dayjs(date).format('DD/MM/YYYY'),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    // toast.error("Something's not right. Please try again.");
    // throw error;
    handleError(error, 'Booking failed');
  }
};

export const removeBooking = async (id, email, token) => {
  try {
    await api.post(
      `/user/removeBooking/${id}`,
      { email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    // toast.error("Something's not right. Please try again.");
    // throw error;
    handleError(error, 'Failed to cancel booking');
  }
};

export const toFav = async (id, email, token) => {
  // eslint-disable-next-line no-useless-catch
  try {
    await api.post(
      `/user/toFav/${id}`,
      {
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (e) {
    //throw e;
    handleError(e, 'Failed to toggle favorite');
  }
};

export const getAllFav = async (email, token) => {
  if (!token) return;
  try {
    const res = await api.post(
      `/user/allFav`,
      { email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // console.log(res)
    return res.data['favResidenciesID'];
  } catch (e) {
    // toast.error('Something went wrong while fetching favs');
    // throw e;
    handleError(e, 'Failed to fetch favorites');
  }
};

export const getAllBookings = async (email, token) => {
  if (!token) return;
  try {
    const res = await api.post(
      `/user/allBookings`,
      { email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // console.log("res", res)
    return res.data['bookedVisits'];
  } catch (e) {
    // toast.error('Something went wrong while fetching bookings');
    // throw e;
    handleError(e, 'Failed to fetch bookings');
  }
};

export const createResidency = async (data, token, userEmail) => {
  // Ensure userEmail is included in the data object
  const requestData = { ...data, userEmail };
  console.log(requestData); // Log the updated data object
  // eslint-disable-next-line no-useless-catch
  try {
    const res = await api.post(
      `/residency/create`,
      requestData, // Pass the updated data object as the request body
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    // throw error;
    handleError(error, 'Failed to create property');
  }
};
