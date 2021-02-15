import React from "react";
import "./App.css";
import OutsideClickHandler from "react-outside-click-handler";
import axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //current state
      memeContent: [], //contains all the memes of db in array
      activeMeme: {
        //current meme being accessed by the user
        id: null,
        name: "",
        caption: "",
        url: "",
      },
      editing: false, //flag for making editing easier
      status: false, //another flag for checking if 200 response is given by backend
      errors: [],
      issubmitted: false,
    };
    //binding of the functions created to the constructor

    this.fetchMemes = this.fetchMemes.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getCookie = this.getCookie.bind(this);
    this.resetActive = this.resetActive.bind(this);
    this.startedit = this.startedit.bind(this);
  }

  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  componentWillMount() {
    this.fetchMemes(); //fetch all the memes in the db everytime we access the website
  }

  fetchMemes() {
    //console.log("Fetching memes...");

    fetch("https://sleepy-beyond-32078.herokuapp.com/memes/")
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          ...this.state,
          memeContent: data,
        })
      )
      .catch((error) => {
        this.setState({
          ...this.state,
          errors: [error.message],
        });
      });
  }

  handleSubmit(e) {
    e.preventDefault(); //preventing the default nature of a form
    let csrftoken = this.getCookie("csrftoken"); //preventing cross-site request forgery
    let req = "POST"; //by default the method is taken as POST
    let post_url = "https://sleepy-beyond-32078.herokuapp.com/memes/";

    if (this.state.editing == true) {
      post_url = `https://sleepy-beyond-32078.herokuapp.com/memes/${this.state.activeMeme.id}/`; //request url for patching a meme
      req = "PATCH"; //if a patch request is sent by the user
      this.setState({
        ...this.setState,
        editing: false,
      });
    } else {
      this.setState({
        ...this.state,
        activeMeme: {
          id: null,
          name: "",
          caption: "",
          url: "",
        },
      });
    }

    //fetch the required url with the required request method
    fetch(post_url, {
      method: req,
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(this.state.activeMeme),
    })
      .then((response) => {
        this.fetchMemes();
        console.log(this.state);
        console.log(response);
        if (response.ok == true) {
          this.setState({
            status: response.ok, //we are getting a 200 response code
          });
        }
        return response.json();
      })
      .then((data) => {
        if (this.state.status == false) {
          //if there is some error
          let err = [];
          for (const key in data) {
            err.push(
              key.charAt(0).toUpperCase() + key.slice(1) + " : " + data[key]
            );
          }
          console.log(err);
          this.setState({
            ...this.state,
            errors: err,
          });
        }
      })
      .catch((error) => {
        //any kind of fetching error
        console.log(error);
        this.setState({
          ...this.state,
          errors: [error.message],
        });
      });
    this.setState({
      ...this.state,
      issubmitted: true, //form submitted
    });
    document.getElementById("exampleModalLong").modal = "hide";
    //console.log(document.getElementById('submit'));
    setTimeout(() => {
      this.setState({
        ...this.state,
        issubmitted: false,
        errors: [],
      });
      document.getElementById("exampleModalLong").modal = "hide";
    }, 2000);
    document.getElementById("exampleModalLong").modal = "hide";
  }

  startedit(meme) {
    this.setState({
      ...this.state,
      activeMeme: {
        id: meme.id,
        name: meme.name,
        url: meme.url,
        caption: meme.caption,
      },
      editing: true,
    });

    // console.log(this.state)
    //   console.log(meme)
  }

  resetActive(meme) {
    this.setState({
      ...this.setState,
      activeMeme: {
        id: null,
        name: "",
        caption: "",
        url: "",
      },
      editing: false,
      status: false,
    });
  }

  handleChange(e) {
    console.log([e.target.name], e.target.value);
    this.setState({
      ...this.setState,
      activeMeme: {
        ...this.state.activeMeme,
        [e.target.name]: e.target.value,
      },
    });
  }

  render() {
    let memes = this.state.memeContent;
    let self = this;
    let errors = this.state.errors;
    return (
      <div>
        <nav className="navbar navbar-light bg-light bor">
          <div className="container text-center">
            <div id="head" className="navbar-brand ">
              <p className="headd">Meme Stream</p>
            </div>

            <a href="https://sleepy-beyond-32078.herokuapp.com/swagger-ui/">
              <button className="swagger btn-lg btn-success">swagger</button>
            </a>
          </div>
        </nav>
        <div className="container" style={{ paddingBottom: "20px" }}>
          <nav id="post-nav" className="navbar navbar-light bg-light">
            <h4 className="subhead display-6">Got a meme?</h4>
            <button
              onClick={this.resetActive}
              type="button"
              className="post btn btn-outline-danger"
              data-toggle="modal"
              data-target="#exampleModalLong"
            >
              <h4> Post it </h4>
            </button>
          </nav>

          <div id="meme-container">
            <div
              className="modal fade"
              id="exampleModalLong"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="exampleModalLongTitle"
              aria-hidden="true"
            >
              <div className="poster modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLongTitle">
                      {this.state.editing ? "Edit Post" : "New Post"}
                    </h5>
                    <button
                      onClick={self.resetActive}
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div id="form_wrapper">
                      <form onSubmit={this.handleSubmit} id="form">
                        <div className="flex-wrapper">
                          <div>
                            <input
                              onChange={this.handleChange}
                              value={this.state.activeMeme.name}
                              className="form-control"
                              type="text"
                              placeholder="Name"
                              name="name"
                            ></input>
                            <br></br>
                            <input
                              onChange={this.handleChange}
                              value={this.state.activeMeme.caption}
                              className="form-control"
                              type="text"
                              placeholder="A creative caption here!"
                              name="caption"
                            ></input>
                            <br></br>
                            <input
                              onChange={this.handleChange}
                              value={this.state.activeMeme.url}
                              className="form-control"
                              type="text"
                              placeholder="Meme URL"
                              name="url"
                            ></input>
                            <br></br>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  {this.state.issubmitted &&
                    (this.state.status ? (
                      <div
                        className="alert alert-success mx-4 text-center"
                        role="alert"
                      >
                        {" "}
                        Success{" "}
                      </div>
                    ) : (
                      <div className="alert alert-danger mx-4" role="alert">
                        {errors.map(function (error, index) {
                          return (
                            <div className="error-log m-0 py-2" key={index}>
                              <p className="m-0 p-0">{error}</p>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  <div className="modal-footer center">
                    <button
                      type="button"
                      onClick={self.resetActive}
                      className="btn btn-secondary"
                      data-dismiss="modal"
                    >
                      Close
                    </button>
                    <input
                      id="submit"
                      onClick={this.handleSubmit}
                      className="btn btn-success"
                      data-toggle="modal"
                      data-target="exampleModalLong"
                      type="submit"
                    ></input>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row" style={{ marginBottom: "15px," }}>
            {memes.map(function (meme, index) {
              return (
                <div className="col-md-4 mb-1 col-sm-6" style={{}} key={index}>
                  <div
                    className="card text-white bg-dark p-0 m-0 my-2"
                    style={{}}
                  >
                    <div className="card-header p-2 mr-1">
                      <h5 style={{ marginRight: "4em" }}>{meme.name}</h5>
                      <div className="card-buttons">
                        <button
                          onClick={() => self.startedit(meme)}
                          data-toggle="modal"
                          data-target="#exampleModalLong"
                          className="edit btn-sm btn-warning mr-1"
                          id="editBut"
                        >
                          <i className="fas fa-pencil-alt"></i>
                        </button>
                        <a
                          onClick={() => self.startedit(meme)}
                          data-toggle="modal"
                          data-target="#imagepreviewModal"
                          className="view btn-sm btn-warning mr-1"
                        >
                          <i className="fa fa-eye" aria-hidden="true"></i>
                        </a>
                      </div>
                    </div>

                    <div className="card-img p-1">
                      <img className="img-fluid rounded" src={meme.url}></img>
                    </div>
                    <div className="card-body p-2">
                      <p className="card-text">{meme.caption}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            <div
              className="modal fade"
              id="imagepreviewModal"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="imageModalTitle"
              aria-hidden="true"
            >
              <div className="modal-dialog" role="document">
                <div className="img-view modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="imageModalTitle">
                      {self.state.activeMeme.name}
                    </h5>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <img src={self.state.activeMeme.url}></img>
                    <br></br>
                    <br></br>
                    <p>{self.state.activeMeme.caption}</p>
                  </div>
                  <div className="modal-footer center">
                    <button
                      type="button"
                      onClick={self.resetActive}
                      className="btn btn-secondary"
                      data-dismiss="modal"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-div">
          <div className="foot text-center">
            <img
              src="https://cdn.pocket-lint.com/r/s/660x/assets/images/140427-apps-news-the-best-stupidest-and-most-famous-internet-memes-around-image8-zeqjykn0ls-jpg.webp?v1"
              className=" rounded-circle"
              alt=""
            ></img>
            <h4>Made with Memes!</h4>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
