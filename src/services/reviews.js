import axios from "axios";

const API = "http://localhost:3000/reviews";

export const getReviews = (movieId) =>
  axios.get(`${API}?movieId=${movieId}`);

export const addReview = (review) =>
  axios.post(API, review);

export const deleteReview = (id) =>
  axios.delete(`${API}/${id}`);

export const updateReview = (id, review) =>
  axios.put(`${API}/${id}`, review);

export const getUserReviews = (username) =>
  axios.get(`${API}?user=${username}`);

export const getReviewsByUserId = (userId) =>
  axios.get(`${API}?userId=${userId}`);
