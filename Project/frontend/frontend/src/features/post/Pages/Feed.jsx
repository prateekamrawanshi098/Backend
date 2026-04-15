import React, { useEffect, useMemo, useState } from "react";
import "../style/feed.scss";
import Post from "../component/Post";
import usePost from "../hook/hook";
import useAuth from "../../auth/hooks/useAuth";

const Feed = () => {
  const {
    feed,
    requests,
    handleGetFeed,
    handleToggleLike,
    handleCreatePost,
    handleFollowUser,
    handleUnfollowUser,
    handleGetFollowRequests,
    handleAcceptFollowRequest,
    handleRejectFollowRequest,
    loading,
  } = usePost();
  const { user, handleGetMe } = useAuth();
  const [showRequests, setShowRequests] = useState(false);
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [followMap, setFollowMap] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        await handleGetMe();
      } catch (_err) {
        setMessage("Please login first");
      }
      await handleGetFeed();
      await handleGetFollowRequests();
    };
    init();
  }, []);

  const postUsers = useMemo(() => {
    const map = {};
    (feed || []).forEach((item) => {
      if (item?.userId?.username) {
        map[item.userId.username] = map[item.userId.username] || false;
      }
    });
    return map;
  }, [feed]);

  useEffect(() => {
    setFollowMap((prev) => ({ ...postUsers, ...prev }));
  }, [postUsers]);

  const handleFollowToggle = async (username, isFollowing) => {
    if (!username) return;
    try {
      if (isFollowing) {
        await handleUnfollowUser(username);
        setMessage(`Unfollowed ${username}`);
      } else {
        await handleFollowUser(username);
        setMessage(`Follow request sent to ${username}`);
      }
      setFollowMap((prev) => ({ ...prev, [username]: !isFollowing }));
    } catch (err) {
      setMessage(err?.response?.data?.message || "Action failed");
    }
  };

  const submitPost = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setMessage("Please select an image");
      return;
    }
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", imageFile);
    try {
      await handleCreatePost(formData);
      setCaption("");
      setImageFile(null);
      setMessage("Post created successfully");
    } catch (err) {
      setMessage(err?.response?.data?.message || "Post creation failed");
    }
  };

  const acceptRequest = async (username) => {
    try {
      await handleAcceptFollowRequest(username);
      setMessage(`Accepted ${username}`);
    } catch (err) {
      setMessage(err?.response?.data?.message || "Accept failed");
    }
  };

  const rejectRequest = async (username) => {
    try {
      await handleRejectFollowRequest(username);
      setMessage(`Rejected ${username}`);
    } catch (err) {
      setMessage(err?.response?.data?.message || "Reject failed");
    }
  };

  if (loading || !feed) {
    return <main>Feed is LOADING....</main>;
  }

  return (
    <main>
      <div className="feed">
        <section className="feed-topbar">
          <div className="identity">
            <img
              src={user?.profilePicture || "https://ik.imagekit.io/r35i8psgvz/default.jpg"}
              alt="profile"
              className="identity-pic"
            />
            <div>
              <p className="small-label">Logged in as</p>
              <h2>{user?.username || "Guest"}</h2>
            </div>
          </div>
          <button
            className="requests-btn"
            type="button"
            onClick={() => setShowRequests((prev) => !prev)}
          >
            Requests ({requests.length})
          </button>
        </section>

        {showRequests ? (
          <section className="requests-panel">
            {requests.length === 0 ? (
              <p>No pending requests</p>
            ) : (
              requests.map((req) => (
                <div className="request-item" key={req._id}>
                  <span>{req.follower}</span>
                  <div className="request-actions">
                    <button type="button" onClick={() => acceptRequest(req.follower)}>
                      Accept
                    </button>
                    <button type="button" onClick={() => rejectRequest(req.follower)}>
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>
        ) : null}

        <section className="create-post">
          <h3>Create Post</h3>
          <form onSubmit={submitPost}>
            <input
              type="text"
              placeholder="Write a caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            <button type="submit">Upload</button>
          </form>
          {message ? <p className="feed-message">{message}</p> : null}
        </section>

        {(feed || []).map((item) => (
          <Post
            key={item._id}
            user={item.userId}
            post={item}
            onLike={handleToggleLike}
            onFollowToggle={handleFollowToggle}
            currentUsername={user?.username}
            followMap={followMap}
          />
        ))}
      </div>
    </main>
  );
};

export default Feed;
