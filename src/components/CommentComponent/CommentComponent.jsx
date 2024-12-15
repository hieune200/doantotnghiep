import React from "react";

const CommentComponent = (props) => {
  const { dataHref, width } = props;
  return (
    <div style={{ margin: "-10px -12px 0" }}>
      <div
        className="fb-comments"
        data-href="https://developers.facebook.com/docs/plugins/comments#configurator"
        data-width={width}
        data-numposts="5"
      ></div>
    </div>
  );
};

export default CommentComponent;
