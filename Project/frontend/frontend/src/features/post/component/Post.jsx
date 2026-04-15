import React from 'react'

const Post = ({ user, post, onLike, onFollowToggle, currentUsername, followMap }) => {
  const isOwnPost = currentUsername === user?.username;
  const isFollowing = !!followMap[user?.username];

  return (
    <div className="posts">
      <div className="user">
        <div className="user-left">
          <img
            className="profile-pic"
            src={user?.profilePicture}
            alt={user?.username || "profile"}
          />
          <p>{user?.username || "Unknown user"}</p>
        </div>
        {!isOwnPost ? (
          <button
            className={`follow-btn ${isFollowing ? "is-following" : ""}`}
            type="button"
            onClick={() => onFollowToggle(user?.username, isFollowing)}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        ) : null}
      </div>
      <div className="post">
        <img
          className="post-pic"
          src={post?.imgURL}
          alt={post?.caption || "post image"}
        />
      </div>
      <div className="bottom">
        <div className="actions">
          <button
            className={`like-btn ${post?.isLiked ? "is-liked" : ""}`}
            type="button"
            aria-label="Like post"
            onClick={() => onLike(post?._id)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.001 20.727c-.31 0-.621-.1-.883-.302-3.652-2.814-6.04-4.92-7.325-6.443-1.397-1.657-2.02-3.225-2.02-5.084C1.773 5.63 4.318 3 7.446 3c1.829 0 3.543.858 4.555 2.243C13.011 3.858 14.725 3 16.554 3 19.681 3 22.227 5.63 22.227 8.9c0 1.859-.624 3.427-2.02 5.084-1.286 1.524-3.674 3.63-7.326 6.443-.26.201-.57.3-.88.3Z"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
            <span>{post?.isLiked ? "Liked" : "Like"}</span>
          </button>
          <p className="like-count">{post?.likesCount || 0} likes</p>
        </div>
        <p className="caption">{post?.caption}</p>
      </div>
    </div>
  );
}

export default Post
