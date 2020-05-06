import "../App.css";
import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { follow, check, unfollow,add_like , remove_like} from "../fucntions/user_functions";

import {
  Card,
  CardTitle,
  Navbar,
  NavbarBrand,
  CardBody,
  Col,
  Button,
  CardText
} from "reactstrap";

function Profile() {
  let history = useHistory();
  const doesInclude = localStorage.getItem('useremail')
  const [isFollowing, setIsFollowing] = useState(-1);
  const [userEmail, setSearchedUserEmail] = useState("");
  const [user, SetSearchedUser] = useState("");
  const [numPost, setNumPost] = useState(0);
  const [allPosts, setAllPosts] = useState([{}]);
  const [numLikes, setNumLikes] = useState(0)
  function handleBack() {
    history.goBack();
  }

  function checkIfFollow() {
    const loggedUser = localStorage.getItem("useremail");
    const usrEmail = localStorage.getItem("searchedUser");
    const info = {
      user: loggedUser,
      userToFollow: usrEmail,
    };
    check(info).then((res) => {
      if (res.data.code === -1) {
        window.confirm(res.data.message);
      } else {
        setIsFollowing(res.data.code);
      }
    });
  }

  function handleFollow() {
    const loggedUser = localStorage.getItem("useremail");
    const info = {
      user: loggedUser,
      userToFollow: userEmail,
    };
    follow(info).then((res) => {
      if (res.data.code === -1) {
        window.confirm(res.data.message);
      }
    });
    setIsFollowing(0);
  }

  function handleUnfollow() {
    const loggedUser = localStorage.getItem("useremail");
    const info = {
      user: loggedUser,
      userToFollow: userEmail,
    };
    unfollow(info).then((res) => {
      if (res.data.code === -1) {
        window.confirm(res.data.message);
      }
    });
    setIsFollowing(1);
  }

  function like_post(post_id){
    const loggedUser = localStorage.getItem("useremail");
    const container = {
      user: loggedUser,
      postLiked: post_id
    };
    add_like(container).then((res) =>{
      setNumLikes(numLikes + 1)
      let copy = [...allPosts]
      for (var i =0; i<copy.length; i++){
        if (copy[i].id === res.data.id){
          copy[i].likesNum = res.data.likesNum
          copy[i].likes = res.data.likes
          break;
        }  
      };
      setAllPosts(copy)
    });  
  }
    function unlike_post(post_id) {
    const loggedUser = localStorage.getItem("useremail");
    const container = {
      user: loggedUser,
      postLiked: post_id
    };
    remove_like(container).then((res) =>{
      setNumLikes(numLikes - 1)
      let copy = [...allPosts]
      for (var i =0; i<copy.length; i++){
        if (copy[i].id === res.data.id){
          copy[i].likesNum = res.data.likesNum
          copy[i].likes = res.data.likes
          break;
        }  
      };
      setAllPosts(copy)
    });  
  }
  function apply(usr, dat, nm, em) {
    SetSearchedUser(usr);
    setAllPosts(dat);
    setNumPost(nm);
    setSearchedUserEmail(em);
    checkIfFollow();
  }

  useEffect(() => {
    if (
      localStorage.getItem("searchedUser") === null &&
      localStorage.getItem('"usertoken"') == null
    ) {
      history.push("/errorPage");
    } else {
      const user = localStorage.getItem("searchedUserName");
      const usrEmail = localStorage.getItem("searchedUser");
      const posts = JSON.parse(localStorage.getItem("searchedUserPosts"));
      var data = posts;
      data.reverse();
      var num = localStorage.getItem("numPosts");
      apply(user, data, num, usrEmail);
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
            <NavbarBrand type="text">Welcome to {user}'s profile!</NavbarBrand>
          </div>
          <div>
            <Col>
              {isFollowing === 0 && (
                <Button
                  color="danger"
                  size="md  "
                  onClick={() => handleUnfollow()}
                >
                  Unfollow {user}
                </Button>
              )}
              {isFollowing > 0 && (
                <Button
                  color="primary"
                  size="md  "
                  onClick={() => handleFollow()}
                >
                  Follow {user}
                </Button>
              )}
            </Col>
          </div>
          <div>
            <Col>
              <NavbarBrand type="button" onClick={() => handleBack()}>
                Back
              </NavbarBrand>
            </Col>
          </div>
        </Navbar>
        <div className="wrapper-all-posts-profile">
          {numPost > 0 &&
            allPosts.map((post) => {
              return (
                <Card body outline color="secondary" className="card-home ">
                  <CardTitle>Posted at : {post.createdAt}</CardTitle>
                  <CardBody className = "text-center">{post.post}</CardBody>
                  <CardText>
                    {!post.likes.includes(doesInclude) ?
                    <Button color = "primary"  img onClick={() => like_post(post._id)}>Like :)</Button>
                    : null
                    }
                    {post.likes.includes(doesInclude) ?
                    <Button color = "secondary" onClick={() => unlike_post(post._id)}>Unlike :(</Button>
                    : null
                    }
                     {<p>{post.likesNum} Likes total.</p>}
                  </CardText>
                </Card>
              );
            })}{" "}
          {numPost == 0 && (
            <Card body outline color="secondary" className="card-home ">
              <CardBody>
                The user hasn't posted anything yet, be sure to check up on him
                soon!
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
