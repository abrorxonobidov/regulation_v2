/**
 * @author Abrorxon Obidov
 * @date 2020-12-03
 */


import {translate} from './wordList';
import {Component} from 'react';
import React from 'react';
import {SingleComment, alertToUser} from "./singleComment";
import axios from 'axios';
import Loader from 'react-loader-spinner';
import {ApiUrl} from './params';
import CKEditor from 'ckeditor4-react';


let countComment = document.getElementById('count-comment').innerText;


export default class CommentArea extends Component {

    docId;
    userId;
    userSpec;

    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            isProcessing: false,
            shown: false,
            countComment: countComment,
            newCommentText: '',
            newCommentSpec: this.props.userSpec,
            newCommentFile: null,
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
                    if (res.status === 200 && res.statusText === 'OK') {
                        if (res.data) {
                            this.setState({
                                comments: res.data,
                                shown: true,
                                isProcessing: false,
                                countComment: res.data.length
                            });
                            document.getElementById('count-comment').innerText = this.state.countComment;
                        } else {
                            alertToUser('Izohlar mavjud emas');
                        }
                    } else {
                        alertToUser(res.status + res.statusText)
                    }
                })
                .catch(error => {
                    this.setState({
                        isProcessing: false
                    });
                    alertToUser('Error in connection');
                    console.log(error);
                });

        }

    };

    showNewReply = (newReply) => {
        let newCommentList = this.state.comments;
        newCommentList[newReply.parentCommentKey]['user_answers'].push(newReply);
        this.setState({
            comments: newCommentList
        })
    };


    sendComment = () => {
        if (this.state.newCommentText.length > 0) {

            let data = new FormData();
            data.append('user_id', this.props.userId);
            data.append('c_f_i', this.state.newCommentFile);
            data.append('u_s_i', this.state.newCommentSpec);
            data.append('content', this.state.newCommentText);

            axios.post(ApiUrl('send-comment'), data)
                .then(res => {
                    if (res.status === 200 && res.statusText === 'OK') {
                        if (res.data && res.data.status) {
                            let newReply = res.data.data;
                            newReply.content = this.state.content;
                            newReply.parentCommentKey = this.props.parentCommentKey;
                            newReply.parentId = this.props.parentId;
                            this.setState({
                                content: ''
                            });
                            this.showNewReply(newReply);
                        } else {
                            alertToUser(res.data['alertText'])
                        }
                    } else {
                        alertToUser(res.statusText)
                    }
                })
                .catch(error => {
                    console.log(error);
                    alertToUser('Error in connection')
                });

        } else {
            alert(translate('text_here'))
        }
    };

    componentDidMount() {
        //this.getData()
    }

    render() {

        return (
            <div>
                <div className="comment_links">
                    {translate('offers')} <span>{this.state.countComment}</span>
                    <button type="button" className="blue_link" onClick={this.getData}>
                        {translate(this.state.shown ? 'hideComments' : 'showComments')}
                    </button>
                    <div className="clearfix"></div>
                </div>
                <div className="correspondence">
                    <ul id="scroll_vertical" className="correspondence_list"
                        style={{display: this.state.shown ? 'block' : 'none'}}>
                        {
                            this.state.shown ?
                                this.state.comments.map(
                                    (comment, key) =>
                                        <SingleComment comment={comment} key={key} userId={this.props.userId}
                                                       parentCommentKey={key} showNewReply={this.showNewReply}/>
                                )
                                : ''
                        }
                    </ul>
                    <Loaders show={this.state.isProcessing}/>
                </div>
                {!this.state.shown ? <CommentEditor/> : ''}
            </div>
        )
    }

}

class Loaders extends Component {
    render() {
        return (
            <ul style={{
                display: this.props.show ? 'block' : 'none ',
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
        )
    }
}


class CommentEditor extends Component {
    render() {
        return (
            <div>

                <CKEditor
                    config={
                        {
                            toolbar: [
                                ['Bold', 'Italic', 'Underline'],
                                ['RemoveFormat']
                            ],
                            language: 'ru',
                            removeButtons: '',
                            editorPlaceholder: translate('text_here')
                        }
                    }
                    onChange={e => this.setState({
                        newCommentText: e.editor.getData().trim()
                    })}
                />
                <button type="submit" className="submit-comment blue_link">
                    {translate('leaveComment')}
                </button>
            </div>
        )
    }
}
