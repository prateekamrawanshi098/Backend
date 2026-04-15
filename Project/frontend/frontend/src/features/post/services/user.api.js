import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export async function followUser(username) {
  const response = await api.post(`/api/user/follow/${username}`);
  return response.data;
}

export async function unfollowUser(username) {
  const response = await api.post(`/api/user/unfollow/${username}`);
  return response.data;
}

export async function getFollowRequests() {
  const response = await api.get("/api/user/requests");
  return response.data;
}

export async function acceptFollowRequest(username) {
  const response = await api.patch(`/api/user/accept/${username}`);
  return response.data;
}

export async function rejectFollowRequest(username) {
  const response = await api.patch(`/api/user/reject/${username}`);
  return response.data;
}
