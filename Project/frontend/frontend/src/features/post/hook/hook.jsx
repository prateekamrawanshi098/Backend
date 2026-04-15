import React from "react";
import {
  createPost,
  getFeed,
  getMyPosts,
  getPostDetails,
  toggleLike,
} from "../services/post.api";
import { useContext, useState } from "react";
import { PostContext } from "../Post.context";
import {
  acceptFollowRequest,
  followUser,
  getFollowRequests,
  rejectFollowRequest,
  unfollowUser,
} from "../services/user.api";

const usePost = () => {
  const context = useContext(PostContext);
  const { loading, setloading, post, setpost, feed, setfeed } = context;
  const [requests, setRequests] = useState([]);

  const handleGetFeed = async () => {
    try {
      setloading(true);
      const data = await getFeed();
      setfeed(data.posts);
    } finally {
      setloading(false);
    }
  };

  const handleToggleLike = async (postId) => {
    const data = await toggleLike(postId);
    setfeed((prevFeed) =>
      (prevFeed || []).map((item) =>
        item._id === postId
          ? {
              ...item,
              likesCount: data.likesCount,
              isLiked: data.isLiked,
            }
          : item,
      ),
    );
  };

  const handleCreatePost = async (formData) => {
    const data = await createPost(formData);
    await handleGetFeed();
    return data;
  };

  const handleGetMyPosts = async () => {
    const data = await getMyPosts();
    setpost(data.post || []);
    return data;
  };

  const handleGetPostDetails = async (postId) => {
    const data = await getPostDetails(postId);
    setpost(data.post || null);
    return data;
  };

  const handleFollowUser = async (username) => {
    return followUser(username);
  };

  const handleUnfollowUser = async (username) => {
    return unfollowUser(username);
  };

  const handleGetFollowRequests = async () => {
    const data = await getFollowRequests();
    setRequests(data.requests || []);
    return data;
  };

  const handleAcceptFollowRequest = async (username) => {
    const data = await acceptFollowRequest(username);
    setRequests((prev) => prev.filter((item) => item.follower !== username));
    return data;
  };

  const handleRejectFollowRequest = async (username) => {
    const data = await rejectFollowRequest(username);
    setRequests((prev) => prev.filter((item) => item.follower !== username));
    return data;
  };

  return {
    loading,
    feed,
    post,
    requests,
    handleGetFeed,
    handleToggleLike,
    handleCreatePost,
    handleGetMyPosts,
    handleGetPostDetails,
    handleFollowUser,
    handleUnfollowUser,
    handleGetFollowRequests,
    handleAcceptFollowRequest,
    handleRejectFollowRequest,
  };
};

export default usePost;
