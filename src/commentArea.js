/**
 * @author Abrorxon Obidov
 * @date 2020-12-03
 */


import {Translate} from './wordList';
import {Component} from 'react';
import React from 'react';
import {SingleComment} from "./singleComment";
import axios from 'axios';
import Loader from 'react-loader-spinner';
import {ApiUrl} from './params'


let countComment = document.getElementById('count-comment').innerText;


export default class CommentArea extends Component {

    docId;
    userId;

    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            isProcessing: false,
            shown: false,
            countComment: countComment
        };
    }

    getData = () => {

        if (this.state.shown) {

            this.setState({shown: false})

        } else {

            this.setState({
                isProcessing: true
            });


            let data = new FormData();
            data.append('doc_id', this.props.docId);
            data.append('user_id', this.props.userId);

            axios.post(ApiUrl('get-comments'), data)
                .then(res => {
                    this.setState({
                        comments: res.data,
                        shown: true,
                        isProcessing: false,
                        countComment: res.data.length
                    });
                    document.getElementById('count-comment').innerText = this.state.countComment;
                })
                .catch(error => {
                    console.log(error);
                });

        }

    };

    render() {

        return (
            <div>
                <div className="comment_links">
                    {Translate('offers')} <span>{this.state.countComment}</span>
                    <button type="button" className="blue_link" onClick={this.getData}>
                        {Translate(this.state.shown ? 'hideComments' : 'showComments')}
                    </button>
                    <div className="clearfix"></div>
                </div>
                <div className="correspondence">
                    <ul id="scroll_vertical" className="correspondence_list"
                        style={{display: this.state.shown ? 'block' : 'none'}}>
                        {
                            this.state.shown ?
                                this.state.comments.map(
                                    (comment, key) => <SingleComment comment={comment} key={key}/>
                                )
                                : ''
                        }
                    </ul>
                    <ul style={{
                        display: this.state.isProcessing ? 'block' : 'none ',
                        textAlign: 'center'
                    }}>
                        <li style={{display: 'inline-block'}}>
                            <Loader type="BallTriangle" color="#05439d" height={60} width={70}/>
                        </li>
                        <li style={{display: 'inline-block'}}>
                            <Loader type="BallTriangle" color="#05439d" height={60} width={70}/>
                        </li>
                        <li style={{display: 'inline-block'}}>
                            <Loader type="BallTriangle" color="#05439d" height={60} width={70}/>
                        </li>
                        <li style={{display: 'inline-block'}}>
                            <Loader type="BallTriangle" color="#05439d" height={60} width={70}/>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }

}
