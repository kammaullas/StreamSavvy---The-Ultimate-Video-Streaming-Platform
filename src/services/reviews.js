import axios from "axios";

const API = "http://localhost:3000/reviews";

export const getReviews = (movieId) =>
  axios.get(`${API}?movieId=${movieId}`);

export const addReview = (review) =>
  axios.post(API, review);

export const deleteReview = (id) =>
  axios.delete(`${API}/${id}`);
