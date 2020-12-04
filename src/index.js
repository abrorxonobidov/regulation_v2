/**
 * @author Abrorxon Obidov
 * @date 2020-12-03
 */


import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import CommentArea from "./commentArea";


const rootTag = document.getElementById('comment-block');


ReactDOM.render(
        <CommentArea
            userId={rootTag.getAttribute('data-user-id')}
            docId={rootTag.getAttribute('data-doc-id')}/>,
    rootTag
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
