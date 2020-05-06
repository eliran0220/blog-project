import "../App.css";
import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  Button,
  Input,
  Card,
  CardTitle,
  Col,
  CardBody,
  CardFooter,
  CardText,
} from "reactstrap";
import {
  getUserPosts,
  search,
  getFollowingUsers,
  getFollowingUsersPosts,
  add_like,
  remove_like,
} from "../fucntions/user_functions";

function Follow() {
  let history = useHistory();
  var email;
  const doesInclude = localStorage.getItem("useremail");
  const [length, setLength] = useState(0);
  const [following, setFollowing] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [followingPosts, setFollowingPosts] = useState([]);
  const [showLess, setShowLess] = useState(false);
  const [numLikes, setNumLikes] = useState(0);

  function like_post(post_id) {
    const loggedUser = localStorage.getItem("useremail");
    const container = {
      user: loggedUser,
      postLiked: post_id,
    };
    add_like(container).then((res) => {
      setNumLikes(numLikes + 1);
      let copy = [...followingPosts];
      for (var i = 0; i < copy.length; i++) {
        if (copy[i].id === res.data.id) {
          copy[i].likesNum = res.data.likesNum;
          copy[i].likes = res.data.likes;
          break;
        }
      }
      setFollowingPosts(copy);
    });
  }
  function unlike_post(post_id) {
    const loggedUser = localStorage.getItem("useremail");
    const container = {
      user: loggedUser,
      postLiked: post_id,
    };
    remove_like(container).then((res) => {
      setNumLikes(numLikes - 1);
      let copy = [...followingPosts];
      for (var i = 0; i < copy.length; i++) {
        if (copy[i].id === res.data.id) {
          copy[i].likesNum = res.data.likesNum;
          copy[i].likes = res.data.likes;
          break;
        }
      }
      setFollowingPosts(copy);
    });
  }

  const [followingData, setFollowingData] = useState({
    isInitial: true,
    filteredList: following.slice(0, 3),
    completeList: following,
  });

  const showMoreUsers = (_evt /*: SyntheticEvent<Event> */) => {
    setFollowingData({
      ...followingData,
      filteredList: following,
      isInitial: false,
    });
    setShowLess(true);
  };

  const showLessUsers = (_evt /*: SyntheticEvent<Event> */) => {
    setFollowingData({
      ...followingData,
      filteredList: following.slice(0, 2),
      isInitial: true,
    });
    setShowLess(false);
  };

  const moreUsersStyle = {
    color: "rgba(0,0,0,0.5)",
    textDecoration: "underline",
    marginTop: "10px",
  };

  const handleSearchUser = (e) => {
    setUserSearch(e.target.value);
  };

  function handleBack() {
    history.goBack();
  }

  function seachUserHandler(usr) {
    var tempPosts;
    let toSearch = null;
    if (typeof usr == "undefined") {
      toSearch = {
        email: userSearch,
      };
    } else {
      toSearch = {
        email: usr,
      };
    }
    if (toSearch.email == localStorage.getItem("useremail")) {
      history.push("/home");
    } else {
      search(toSearch).then((res) => {
        if (res.data.code.code !== 0) {
          window.confirm(res.data.code.message);
        } else {
          const postsOfUser = {
            email: toSearch.email,
          };
          tempPosts = postsOfUser;
          getUserPosts(tempPosts).then((response) => {
            if (response.data.code != -1) {
              var lengthOfPosts = res.data.user.posts.length;
              localStorage.setItem("numPosts", lengthOfPosts);
              localStorage.setItem(
                "searchedUserPosts",
                JSON.stringify(response.data)
              );
              localStorage.setItem("searchedUser", toSearch.email);
              localStorage.setItem(
                "searchedUserName",
                res.data.user.first_name
              );
              history.push("/profile");
            }
          });
        }
      });
    }
  }

  function getFollowing() {
    const container = {
      email: email,
    };
    getFollowingUsers(container).then((res) => {
      if (res.data.code != -1) {
        var data = res.data;
        setFollowing(data);
        setLength(data.length);
        getFollowingPosts(data);
        setFollowingData({
          ...followingData,
          filteredList: data.slice(0, 2),
          completeList: following,
        });
      }
    });
  }

  function getFollowingPosts(data) {
    const container = {
      data: data,
    };
    getFollowingUsersPosts(container).then((res) => {
      if (res.data.code != -1) {
        var data = res.data;
        setFollowingPosts(data);
      }
    });
  }

  useEffect(() => {
    if (localStorage.getItem("usertoken") === null) {
      history.push("/errorPage");
    } else {
      const _email = localStorage.getItem("useremail");
      email = _email;
      localStorage.removeItem("searchedUser"); //used to delete the last profile searched
      localStorage.removeItem("searchedUserPosts"); // used to delete the last profile searched post from cache
      getFollowing();
    }
  }, []);

  return (
    <div className="box">
      <div>
        <Navbar
          color="light"
          light
          expand="lg"
          className="justify-content-flex"
          style={{ padding: "5" }}
        >
          <div className="header-home">
            <NavbarBrand type="text">inTouch</NavbarBrand>
          </div>
          <div>
            <Col>
              <Input
                id="usr"
                name="user1"
                type="text"
                value={userSearch}
                placeholder="Enter user's email..."
                onChange={handleSearchUser}
              ></Input>
            </Col>
          </div>
          <div>
            <Col>
              <Button
                outline
                color="primary"
                onClick={() => seachUserHandler()}
              >
                Search
              </Button>
            </Col>
          </div>
          <div>
            <Col>
              <NavbarBrand type="button" onClick={handleBack}>
                Back
              </NavbarBrand>
            </Col>
          </div>
        </Navbar>

        <div className="feed">
          <Card body outline color="secondary">
            <CardTitle className="following-list text-center">
              <following-list>Feed</following-list>
            </CardTitle>
            <CardBody className="text-center">
              Welcome to your feed! Catch up with the people you follow.
            </CardBody>
          </Card>
        </div>
        <div className="following">
          <Card body outline color="secondary">
            <CardTitle className="following-list text-center">
              <following-list>Following list:</following-list>
              {followingData.isInitial ? (
                <p onClick={showMoreUsers} style={moreUsersStyle}>
                  Show all users...
                </p>
              ) : null}

              {showLess ? (
                <p onClick={showLessUsers} style={moreUsersStyle}>
                  Show less...
                </p>
              ) : null}
            </CardTitle>
            <CardBody className="text-center">
              {followingData.filteredList.length > 0 &&
                followingData.filteredList.map((usr) => (
                  <div>
                    <Button
                      className="button-follow"
                      outline
                      color="primary"
                      onClick={() => seachUserHandler(usr)}
                      id={usr}
                    >
                      {usr}
                    </Button>
                  </div>
                ))}
            </CardBody>
          </Card>
        </div>
        <div className="wrapper-all-posts-follow">
          {length > 0 &&
            followingPosts.map((post) => {
              return (
                <Card body outline color="secondary" className="card-home ">
                  <CardTitle>
                    Posted at : {post.createdAt} By : {post.email}
                  </CardTitle>
                  <CardBody>{post.post}</CardBody>
                  <CardText>
                    {!post.likes.includes(doesInclude) ? (
                      <Button onClick={() => like_post(post._id)}>Like!</Button>
                    ) : null}
                    {post.likes.includes(doesInclude) ? (
                      <Button onClick={() => unlike_post(post._id)}>
                        Unlike!
                      </Button>
                    ) : null}
                    {<p>{post.likesNum} Likes total.</p>}
                  </CardText>
                </Card>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Follow;
