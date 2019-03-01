import React, { Component } from "react";
import BookmarksContext from "../BookmarksContext";
import config from "../config";

export default class EditBookmark extends React.Component {
  static contextType = BookmarksContext;
  state = {
    id: 0,
    title: "",
    url: "",
    description: "",
    rating: 0
  };
  componentDidMount() {
    const bookmarkId = this.props.match.params.bookmarkId;
    fetch(`http://localhost:8000/api/bookmarks/${bookmarkId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${config.API_KEY}`
      }
    })
      .then(res => res.json())
      .then(responseData => {
        this.setState({
          id: responseData.id,
          title: responseData.title,
          url: responseData.url,
          description: responseData.description,
          rating: responseData.rating
        });
      });
  }
  handleSubmit = e => {
    e.preventDefault();
    const { title, url, description, rating } = e.target;
    const bookmark = {
      title: title.value,
      url: url.value,
      description: description.value,
      rating: rating.value
    };
    const bookmarkId = this.props.match.params.bookmarkId;
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: "PATCH",
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      },
      body: JSON.stringify(bookmark)
    })
      .then(res => console.log(res))
      .then(() => {
        this.context.updateBookmark(bookmark);
        this.props.history.push("/");
      });
  };
  handleChange = e => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value
    });
  };
  render() {
    const { title, url, description, rating } = this.state;
    return (
      <section className="EditBookmarkForm">
        <h2>Edit Bookmark</h2>
        <form onSubmit={this.handleSubmit}>
          <label>Title</label>
          <input
            type="text"
            name="title"
            placeholder={title}
            value={this.state.title}
            onChange={this.handleChange}
          />
          <label>URL</label>
          <input
            type="text"
            name="url"
            placeholder={url}
            value={this.state.url}
            onChange={this.handleChange}
          />
          <label>Description</label>
          <input
            type="text"
            name="description"
            placeholder={description}
            value={this.state.description}
            onChange={this.handleChange}
          />
          <label>Rating</label>
          <input
            type="number"
            name="rating"
            placeholder={rating}
            value={this.state.rating}
            onChange={this.handleChange}
          />
          <button type="submit">Submit</button>
        </form>
      </section>
    );
  }
}
