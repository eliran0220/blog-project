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
} from "reactstrap";
import {
  getUserPosts,
  search,
  getFollowedUsers,
  removeFollower,
} from "../fucntions/user_functions";

function Followers() {
  let history = useHistory();
  var email;
  const [followers, setFollowers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [showLess, setShowLess] = useState(false);
  const handleSearchUser = (e) => {
    setUserSearch(e.target.value);
  };

  const [followersData, setFollowersData] = useState({
    isInitial: true,
    filteredList: followers.slice(0, 3),
    completeList: followers,
  });

  const showMoreUsers = (_evt /*: SyntheticEvent<Event> */) => {
    setFollowersData({
      ...followersData,
      filteredList: followers,
      isInitial: false,
    });
    setShowLess(true);
  };

  const showLessUsers = (_evt /*: SyntheticEvent<Event> */) => {
    setFollowersData({
      ...followersData,
      filteredList: followers.slice(0, 2),
      isInitial: true,
    });
    setShowLess(false);
  };

  const moreUsersStyle = {
    color: "rgba(0,0,0,0.5)",
    textDecoration: "underline",
    marginTop: "10px",
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
    search(toSearch).then((res) => {
      if (res.data.code.code !== 0) {
        window.confirm(res.data.code.message);
      } else {
        const postsOfUser = {
          email: toSearch.email,
        };
        tempPosts = postsOfUser;
        getUserPosts(tempPosts).then((response) => {
          localStorage.setItem(
            "searchedUserPosts",
            JSON.stringify(response.data)
          );
          localStorage.setItem("searchedUser", toSearch.email);
          localStorage.setItem("searchedUserName", res.data.user.first_name);
          var lengthOfPosts = res.data.user.posts.length;
          localStorage.setItem("numPosts", lengthOfPosts);
          history.push("/profile");
        });
      }
    });
  }

  function getFollowers() {
    const container = {
      email: email,
    };
    getFollowedUsers(container).then((res) => {
      var data = res.data;
      setFollowers(data);
      setFollowersData({
        ...followersData,
        filteredList: data.slice(0, 2),
        completeList: followers,
      });
    });
  }

  function removeUserHandler(usr) {
    const _email = localStorage.getItem("useremail");
    const container = {
      email: _email,
      toRemove: usr,
    };
    removeFollower(container).then((res) => {
      var data = res.data;
      setFollowers(data);
      setFollowersData({
        ...followersData,
        filteredList: data.slice(0, 2),
        completeList: followers,
      });
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
      getFollowers();
    }
  }, []);

  return (
    <div className="box">
      <div></div>
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

        <div className="followers">
          <Card body outline color="secondary">
            <CardTitle className="following-list text-center">
              <following-list>Followers list:</following-list>
            </CardTitle>
            <CardBody>
              {followersData.filteredList.length > 0 &&
                followersData.filteredList.map((usr) => {
                  return (
                    <div className="inline-div">
                      <div className="followers-left">
                        <Button
                          className="button-follow"
                          outline
                          color="primary"
                          onClick={() => seachUserHandler(usr)}
                        >
                          {usr}
                        </Button>
                      </div>
                      <div className="followers-right">
                        <Button
                          className="button-follow"
                          outline
                          color="danger"
                          onClick={() => removeUserHandler(usr)}
                        >
                          {"Remove"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Followers;
