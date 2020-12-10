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
            });
            return true
        }

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
            comment.append('u_s_i', params.userSpec);
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
                                commentEditorInitText: !this.state.commentEditorInitText,
                                countComment: this.state.comments.length
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
                    this.setState({
                        isNewCommentProcessing: false
                    });
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
                    <button type="button" className="blue_link" onClick={this.getCommentList}
                            disabled={this.state.isCommentListProcessing}>
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
                                ) : ''
                        }
                    </div>
                    {
                        this.state.isCommentListShown ?
                            <CommentEditor
                                userSpec={this.state.userSpec}
                                sendComment={this.sendComment}
                                initText={this.state.commentEditorInitText}
                                isNewCommentProcessing={this.state.isNewCommentProcessing}
                            /> : ''
                    }
                </div>
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
    userSpec;

    constructor(props) {
        super(props);
        this.state = {
            content: '',
            userSpec: this.props.userSpec,
            file: null,
            fileSummaryText: null,
            fileSummaryClass: null
        };
        this.sendComment = this.props.sendComment.bind(this)
    }

    config = {
        allowedExtensions: ['doc', 'docx', 'pdf'],
        maxFileSize: 20971520, //bytes
        minFileSize: 1024 //bytes
    };


    chooseFile = (e) => {

        this.setState({
            fileSummaryText: null,
            fileSummaryClass: null
        });

        let file = e.target.files[0];

        if (file) {

            let fileName = file.name;
            let fileTitle = fileName.substring(0, fileName.lastIndexOf('.'));
            let extension = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);

            if (fileTitle.length <= 0) {
                this.setState({
                    fileSummaryText: translate('incompatibleFile'),
                    fileSummaryClass: 'text-danger'
                });
                return false
            }

            if (!this.config.allowedExtensions.includes(extension.toLowerCase())) {
                this.setState({
                    fileSummaryText: '<b>' + this.config.allowedExtensions.join(', ') + '</b> fayllar ruxsat etilgan',
                    fileSummaryClass: 'text-danger'
                });
                return false
            }

            if (file.size < this.config.minFileSize || file.size > this.config.maxFileSize) {
                this.setState({
                    fileSummaryText: translate('incompatibleFileSize'),
                    fileSummaryClass: 'text-danger'
                });
                return false
            }

            this.setState({
                fileSummaryText: fileName,
                fileSummaryClass: 'text-success',
                file: file
            })

        }
    };


    clearFile = () => {
        this.setState({
            fileSummaryText: null,
            fileSummaryClass: null,
            file: null
        })
    };

    selectUserSpec = (e) => {
        this.setState({
            userSpec: e.target.value
        })
    };

    render() {
        return (
            <>
                <button style={{height: 0, width: '100%', border: 'none'}}></button>
                <CKEditor
                    data={this.props.initText}
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
                <br/>
                <div className="row">
                    <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="comment-file" style={{width: '100%'}}>
                                {translate('chooseFile')}
                                <p style={{
                                    backgroundColor: '#05439d',
                                    padding: 8,
                                    width: '100%',
                                    height: 34,
                                    borderRadius: 17,
                                    textAlign: 'center',
                                    color: '#ffffff',
                                    marginTop: 5
                                }}>
                                    {translate('chooseFile')} <i className="glyphicon glyphicon-folder-open"></i>
                                </p>
                            </label>
                            <div className="row">
                                <div className="col-md-9">
                                    <p className={this.state.fileSummaryClass}
                                       dangerouslySetInnerHTML={{__html: this.state.fileSummaryText}}/>
                                </div>
                                <div className="col-md-3">
                                    {
                                        this.state.fileSummaryText ?
                                            <button className='btn btn-default pull-right btn-sm'
                                                    onClick={this.clearFile}>
                                                <i className="text-danger glyphicon glyphicon-remove"></i>
                                            </button>
                                            : ''
                                    }
                                </div>
                            </div>
                            <input type="file" id="comment-file" className="hidden" onChange={this.chooseFile}/>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="comment-spec">
                                {translate('chooseSpec')}
                            </label>
                            <select id="comment-spec" className="form-control" defaultValue={this.state.userSpec}
                                    onChange={this.selectUserSpec}
                                    style={{borderRadius: 20}}>
                                <option value="1">Тадбиркор - 1</option>
                                <option value="2">Давлат хизматчиси - 2</option>
                                <option value="3">Илмий изланувчи - 3</option>
                                <option value="4">Мустақил изланувчи - 4</option>
                                <option value="5">Журналист/блогер - 5</option>
                                <option value="6">Халқаро ташкилот ҳодими - 6</option>
                                <option value="7">Дастурчи - 7</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-offset-3 col-md-3">
                        <button className="leave-comment-btn col-md-8 col-sm-4 col-xs-3"
                                disabled={this.props.isNewCommentProcessing}
                                onClick={() => this.sendComment(this.state)}>
                            {this.props.isNewCommentProcessing ?
                                <Loader type="Oval" color="white" radius={18} height={24} width={24}/>
                                :
                                translate('leaveComment')
                            }
                        </button>
                    </div>
                </div>

            </>
        )
    }
}
