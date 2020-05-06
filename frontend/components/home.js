import "../App.css";
import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import logo from "../images/home-logo.png";
import {
  Navbar,
  NavbarBrand,
  Button,
  Input,
  Card,
  CardTitle,
  Form,
  Col,
  CardBody,
  CardText
} from "reactstrap";
import {
  createPost,
  getUserPosts,
  deletePost,
  search,
  getFollowingUsers,
  add_like,
  remove_like
} from "../fucntions/user_functions";
export default function Home() {
  let history = useHistory();
  var email;
  const doesInclude = localStorage.getItem('useremail')
  const [numPost, setNumPost] = useState(0);
  const [post_text, setPost] = useState("");
  const [allPosts, setAllPosts] = useState([{}]);
  const [numLikes, setNumLikes] = useState(0)

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
  const handleChangePost = (e) => {
    setPost(e.target.value);
  };

  function followingHandler() {
    history.push("/following");
  }

  function followersHandler() {
    history.push("/followers");
  }

  const handleSettings = (e) => {
    history.push("/settings");
  };

  function deletePostHandler(id) {
    const toDelete = {
      id: id,
      email: email,
    };
    deletePost(toDelete).then((res) => {
      setNumPost(numPost - 1);
      var currentPosts = allPosts;
      for (var i = 0; i < currentPosts.length; i++) {
        if (currentPosts[i]._id == id) {
          currentPosts = currentPosts.splice(i, 1);
          break;
        }
      }
      setAllPosts(currentPosts);
    });
  }

  function handlePost(e) {
    e.preventDefault();
    const toPost = {
      post: post_text,
      email: email,
    };
    createPost(toPost).then((res) => {
      if (res.data.code != 1) {
        setAllPosts(toPost.concat(allPosts));
        setNumPost(numPost + 1);
      } else {
        window.confirm(res.data.message);
      }
    });
  }

  function getPosts() {
    const container = {
      email: localStorage.getItem("useremail"),
    };
    getUserPosts(container).then((res) => {
      var data = res.data;
      data.reverse();
      setAllPosts(data);
      setNumPost(data.length);
    });
  }

  function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem("usertoken");
    history.push(`/login`);
  }

  useEffect(() => {
    if (localStorage.getItem("usertoken") === null) {
      history.push("/errorPage");
    } else {
      localStorage.removeItem("searchedUser"); //used to delete the last profile searched
      localStorage.removeItem("searchedUserPosts"); // used to delete the last profile searched post from cache
      email = localStorage.getItem("useremail");
      getPosts();
    }
  });
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
              <NavbarBrand type="button" onClick={() => followingHandler()}>
                Following
              </NavbarBrand>
            </Col>
          </div>
          <div>
            <Col>
              <NavbarBrand type="button" onClick={() => followersHandler()}>
                Followers
              </NavbarBrand>
            </Col>
          </div>
          <div>
            <Col>
              <NavbarBrand type="button" onClick={handleSettings}>
                Settings
              </NavbarBrand>
            </Col>
          </div>
          <div>
            <Col>
              <NavbarBrand type="button" onClick={handleLogout}>
                Logout
              </NavbarBrand>
            </Col>
          </div>
        </Navbar>

        <div className="wrapper">
          <Card body outline color="secondary" className="card-home ">
            <CardTitle>
              <img src={logo} alt="logo"></img>Create post
            </CardTitle>
            <Form onSubmit={handlePost}>
              <Input
                id="tx"
                name="input1"
                type="textarea"
                value={post_text}
                placeholder="Enter your post here"
                onChange={handleChangePost}
              ></Input>
              <br></br>
              <Col sm={{ span: 10, offset: 5 }}>
                <Button outline color="primary" type="submit">
                  Post!
                </Button>
              </Col>
            </Form>
            <div
              id="p2"
              class="mdl-progress mdl-js-progress mdl-progress__indeterminate"
            ></div>
          </Card>
        </div>
        <div className="wrapper-all-posts-home">
          {numPost > 0 &&
            allPosts.map((post) => {
              return (
                <Card body outline color="secondary" className="card-home ">
                  <CardTitle>Posted at : {post.createdAt}</CardTitle>
                  <CardBody>{post.post}</CardBody>
                  <Button
                    outline
                    color="primary"
                    onClick={() => deletePostHandler(post._id)}
                  >
                    Delete post
                  </Button>
                  <br/>
                  <CardText>
                    {!post.likes.includes(doesInclude) ?
                    <Button onClick={() => like_post(post._id)}>Like!</Button>
                    : null
                    }
                    {post.likes.includes(doesInclude) ?
                    <Button onClick={() => unlike_post(post._id)}>Unlike!</Button>
                    : null
                    }
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
