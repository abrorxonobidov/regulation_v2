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
            isCommentListProcessing: false,
            isCommentListShown: false,
            countComment: countComment,
            userSpec: this.props.userSpec,
            isNewCommentProcessing: false,
            commentEditorInitText: false
        };
    }

    getCommentList = () => {

        if (this.state.isCommentListShown) {

            this.setState({
                isCommentListShown: false
            })

        } else {

            this.setState({
                isCommentListProcessing: true
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
                                isCommentListShown: true,
                                isCommentListProcessing: false,
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
                        isCommentListProcessing: false
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

    sendComment = (params) => {

        if (params.content.length > 0) {
            this.setState({
                isNewCommentProcessing: true
            });
            let comment = new FormData();
            comment.append('content', params.content);
            comment.append('user_id', this.props.userId);
            comment.append('document_id', this.props.docId);
            comment.append('u_s_i', params.userSpec ?? this.state.userSpec);
            comment.append('c_f_i', params.file);

            axios.post(ApiUrl('send-comment'), comment)
                .then(res => {
                    if (res.status === 200 && res.statusText === 'OK') {
                        if (res.data && res.data.status) {
                            let newComment = res.data.data;
                            newComment.content = params.content;
                            newComment.document_id = this.props.docId;
                            newComment.entity_id = this.props.docId;
                            newComment.parent_id = null;
                            newComment.authority = null;
                            newComment.is_anonymous = false;
                            newComment.is_applied = false;
                            newComment.is_answered = false;
                            newComment.support_count = 0;
                            newComment.is_hidden = false;
                            newComment.reason_to_hide = null;
                            newComment.is_supported = false;
                            newComment.authority_answers = [];
                            newComment.user_answers = [];
                            let allComments = this.state.comments;
                            allComments.push(newComment);
                            this.setState({
                                comments: allComments,
                                isNewCommentProcessing: false,
                                commentEditorInitText: !this.state.commentEditorInitText
                            });
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
        this.getCommentList()
    }

    render() {

        return (
            <>
                <div className="comment_links">
                    {translate('offers')} <span>{this.state.countComment}</span>
                    <button type="button" className="blue_link" onClick={this.getCommentList}>
                        {translate(this.state.isCommentListShown ? 'hideComments' : 'showComments')}
                    </button>
                    <div className="clearfix"></div>
                </div>
                <Loaders show={this.state.isCommentListProcessing}/>
                <div className="correspondence">
                    <div className="correspondence_list"
                         style={{display: this.state.isCommentListShown ? 'block' : 'none'}}>
                        {
                            this.state.isCommentListShown ?
                                this.state.comments.map(
                                    (comment, key) =>
                                        <SingleComment comment={comment} key={key} userId={this.props.userId}
                                                       docId={this.props.docId}
                                                       parentCommentKey={key} showNewReply={this.showNewReply}/>
                                )
                                : ''
                        }
                    </div>
                </div>
                {
                    this.state.isCommentListShown ?
                        <CommentEditor
                            userSpec={this.props.userSpec}
                            sendComment={this.sendComment}
                            initText={this.state.commentEditorInitText}
                        />
                        :
                        ''
                }
            </>
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

    initText;
    isNewCommentProcessing;

    constructor(props) {
        super(props);
        this.state = {
            content: '',
            userSpec: 5,
            file: null
        };
        this.sendComment = this.props.sendComment.bind(this)
    }

    render() {
        return (
            <>
                <button style={{height: 0, width: '100%', border: 'none'}}> </button>
                <CKEditor
                    data = {this.props.initText}
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
                        content: e.editor.getData().trim()
                    })}
                />
                <button className="pull-right blue_link" disabled={this.props.isNewCommentProcessing}
                        onClick={() => this.sendComment(this.state)}>
                    {translate('leaveComment')}
                </button>
            </>
        )
    }
}
