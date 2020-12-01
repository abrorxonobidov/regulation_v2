import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import CommentArea from "./CommentArea";

const rootTag = document.getElementById('comment-block');

ReactDOM.render(
  <React.StrictMode>
    <CommentArea
        lang={rootTag.getAttribute('lang')}
        userId={rootTag.getAttribute('data-user-id')}
        docId={rootTag.getAttribute('data-doc-id')} />
  </React.StrictMode>,
    rootTag
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
