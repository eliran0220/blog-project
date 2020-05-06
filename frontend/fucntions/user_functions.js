import axios from "axios";

export const add_like = (container) =>{
  return axios
    .post("http://localhost:4000/user/likePost", {
      user: container.user,
      post_liked : container.postLiked
    })
    .then((response) => {
      return response;
    });
};
export const remove_like = (container) =>{
  return axios
    .post("http://localhost:4000/user/unlikePost", {
      user: container.user,
      post_unliked : container.postLiked
    })
    .then((response) => {
      return response;
    });
};
export const getFollowingUsersPosts = (container) => {
  const following = container.data;
  return axios
    .post("http://localhost:4000/user/getFollowingUsersPosts", {
      following: container.data,
    })
    .then((response) => {
      return response;
    });
};

export const check = (info) => {
  const path =
    "http://localhost:4000/user/isFollowing/" +
    info.user +
    "/" +
    info.userToFollow;
  return axios.get(path, {}).then((response) => {
    return response;
  });
};

export const unfollow = (info) => {
  return axios
    .post("http://localhost:4000/user/unfollow", {
      loggedUser: info.user,
      follow: info.userToFollow,
    })
    .then((response) => {
      return response;
    });
};

export const removeFollower = (container) => {
  return axios
    .post("http://localhost:4000/user/removeFollower", {
      user: container.email,
      remove: container.toRemove,
    })
    .then((response) => {
      return response;
    });
};

export const follow = (info) => {
  return axios
    .post("http://localhost:4000/user/follow", {
      loggedUser: info.user,
      follow: info.userToFollow,
    })
    .then((response) => {
      return response;
    });
};
export const saveSettings = (settings) => {
  return axios
    .post("http://localhost:4000/user/changeSettings", {
      first_name: settings.first_name,
      last_name: settings.last_name,
      password: settings.password,
      originEmail: settings.originEmail,
    })
    .then((response) => {
      return response;
    });
};
export const deletePost = (toDelete) => {
  return axios
    .post("http://localhost:4000/user/deletePost", {
      id: toDelete.id,
      email: toDelete.email,
    })
    .then((response) => {
      return response;
    });
};
export const createPost = (post) => {
  return axios
    .post("http://localhost:4000/user/post", {
      post: post.post,
      email: post.email,
    })
    .then((response) => {
      return response;
    });
};

export const getUserPosts = (container) => {
  const email = container.email;
  const path = "http://localhost:4000/user/getPosts/" + email;
  return axios.get(path, {}).then((response) => {
    console.log(response);
    return response;
  });
};

export const getFollowingUsers = (container) => {
  const email = container.email;
  const path = "http://localhost:4000/user/getFollowing/" + email;
  return axios.get(path, {}).then((response) => {
    return response;
  });
};

export const getFollowedUsers = (container) => {
  const email = container.email;
  const path = "http://localhost:4000/user/getFollowers/" + email;
  return axios.get(path, {}).then((response) => {
    return response;
  });
};
export const login = (user) => {
  return axios
    .post("http://localhost:4000/user/login", {
      email: user.email,
      password: user.password,
    })
    .then((response) => {
      localStorage.setItem("usertoken", response.data.msg);
      localStorage.setItem("useremail", user.email);
      return response;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const signup = (user) => {
  console.log(user.gender);
  return axios
    .post("http://localhost:4000/user/signup", {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: user.password,
      gender: user.gender,
    })
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const search = (toSearch) => {
  const email = toSearch.email;
  const path = "http://localhost:4000/user/searchUser/" + email;
  return axios
    .get(path, {})
    .then((respose) => {
      return respose;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const logout = (token) => {
  localStorage.removeItem("usertoken");
  return "ok";
};
