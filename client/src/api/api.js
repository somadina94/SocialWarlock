import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:5002/api/v1/',
});

// const axiosInstance = axios.create({
//   baseURL: 'https://api.socialwarlock.com/api/v1/',
// });

export const createAccount = async (data) => {
  try {
    const res = await axiosInstance({
      method: 'POST',
      url: 'users/signUp',
      data,
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

export const logIn = async (data) => {
  try {
    const res = await axiosInstance({
      method: 'POST',
      url: 'users/loginUser',
      data,
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

export const logOut = async () => {
  try {
    const res = await axiosInstance({
      method: 'POST',
      url: 'users/logout',
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

export const updatePassword = async (jwt, data) => {
  try {
    const res = await axiosInstance({
      method: 'PATCH',
      url: 'users/updatePassword',
      data,
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

export const forgotPassword = async (data) => {
  try {
    const res = await axiosInstance({
      method: 'POST',
      url: 'users/forgotPassword',
      data,
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

export const resetPassword = async (data, token) => {
  try {
    const res = await axiosInstance({
      method: 'POST',
      url: `users/resetPassword/${token}`,
      data,
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

export const getPlatforms = async () => {
  try {
    const res = await axiosInstance({
      method: 'GET',
      url: 'platform',
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

export const getOnePlatform = async (id) => {
  try {
    const res = await axiosInstance({
      method: 'GET',
      url: `platform/${id}`,
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

export const getProductCount = async (name) => {
  try {
    const res = await axiosInstance({
      method: 'GET',
      url: `products/${name}`,
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

export const createOrder = async (jwt, data) => {
  try {
    const res = await axiosInstance({
      method: 'POST',
      url: 'orders',
      data,
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

export const createCheckout = async (jwt, data) => {
  try {
    const res = await axiosInstance({
      method: 'POST',
      url: 'payment/checkout',
      data,
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

export const getOrders = async (jwt) => {
  try {
    const res = await axiosInstance({
      method: 'GET',
      url: 'orders',
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

export const getOneOrder = async (jwt, id) => {
  try {
    const res = await axiosInstance({
      method: 'GET',
      url: `orders/${id}`,
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

export const uploadAndSort = async (data) => {
  try {
    const res = await axiosInstance({
      method: 'POST',
      url: `download/upload-file`,
      data,
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};
