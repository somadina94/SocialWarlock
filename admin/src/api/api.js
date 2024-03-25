import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: 'http://127.0.0.1:5002/api/v1/',
// });

const axiosInstance = axios.create({
  baseURL: 'https://api.socialwarlock.com/api/v1/',
});

export const logIn = async (data) => {
  try {
    const res = await axiosInstance({
      method: 'POST',
      url: 'users/loginAdmin',
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

export const getAllUsers = async (jwt) => {
  try {
    const res = await axiosInstance({
      method: 'GET',
      url: 'users',
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

export const blockUser = async (jwt, id) => {
  try {
    const res = await axiosInstance({
      method: 'PATCH',
      url: `users/block/${id}`,
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

export const unblockUser = async (jwt, id) => {
  try {
    const res = await axiosInstance({
      method: 'PATCH',
      url: `users/unblock/${id}`,
      headers: {
        authorization: `Bearer ${jwt}`,
      },
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

export const createPlatform = async (jwt, data) => {
  try {
    const res = await axiosInstance({
      method: 'POST',
      url: 'platform',
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

export const getOnePlatform = async (id, jwt) => {
  try {
    const res = await axiosInstance({
      method: 'GET',
      url: `platform/${id}`,
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

export const updatePlatform = async (id, data, jwt) => {
  try {
    const res = await axiosInstance({
      method: 'PATCH',
      url: `platform/${id}`,
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

export const getOrders = async (jwt) => {
  try {
    const res = await axiosInstance({
      method: 'GET',
      url: 'orders/admin',
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

export const approveOrder = async (jwt, id) => {
  try {
    const res = await axiosInstance({
      method: 'PATCH',
      url: `orders/approveOrder/${id}`,
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

export const deleteOrder = async (jwt, id) => {
  try {
    const res = await axiosInstance({
      method: 'DELETE',
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

export const createProduct = async (jwt, data) => {
  try {
    const res = await axiosInstance({
      method: 'POST',
      url: `products`,
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

export const getProducts = async (jwt) => {
  try {
    const res = await axiosInstance({
      method: 'GET',
      url: `products`,
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

export const approveProduct = async (jwt, id) => {
  try {
    const res = await axiosInstance({
      method: 'PATCH',
      url: `products/approve/${id}`,
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

export const deleteProduct = async (jwt, id) => {
  try {
    const res = await axiosInstance({
      method: 'DELETE',
      url: `products/${id}`,
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};
