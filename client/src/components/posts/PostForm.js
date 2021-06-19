import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {AddPost} from "../../actions/post";

const PostForm = ({ AddPost }) => {
  const [text, setText] = useState("");
  return (
    <div class="post-form">
      <div class="bg-primary p">
        <h3>Say Something...</h3>
      </div>
      <form
        class="form my-1"
        onSubmit={(e) => {
          e.preventDefault();
          AddPost({ text });
          setText("");
        }}
      >
        <textarea
          name="text"
          cols="30"
          rows="5"
          placeholder="Create a post"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        ></textarea>
        <input type="submit" class="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
};

PostForm.propTypes = {
  AddPost: PropTypes.func.isRequired,
};

export default connect(null,{AddPost})(PostForm);
