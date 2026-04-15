import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials:true
})

export async function getFeed() {
    const response = await api.get('/api/posts/feed')
    return response.data
}

export async function toggleLike(postId) {
    const response = await api.post(`/api/like/${postId}`);
    return response.data;
}

export async function createPost(formData) {
    const response = await api.post("/api/post", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

export async function getMyPosts() {
    const response = await api.get("/api/post");
    return response.data;
}

export async function getPostDetails(postId) {
    const response = await api.get(`/api/details/${postId}`);
    return response.data;
}
