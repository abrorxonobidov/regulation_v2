/**
 * @author Abrorxon Obidov
 * @date 2020-12-03
 */


import {translate, translateParams} from './wordList';
import {Component} from 'react';
import React from 'react';
import {SingleComment} from "./singleComment";
import axios from 'axios';
import Loader from 'react-loader-spinner';
import {apiUrl, staticUserSpecList, userFileConfig} from './params';
import CKEditor from 'ckeditor4-react';
import UserNotification from "./userNotification";
import {consoleLog} from "./functions";


let initialCountComment = document.getElementById('count-comment').innerText;


export default class CommentArea extends Component {

    docId;
    userId;
    userSpec;
    isDiscussing;

    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            isCommentListProcessing: false,
            isCommentListShown: false,
            countComment: initialCountComment,
            userSpec: this.props.userSpec ? this.props.userSpec : 1,
            isNewCommentProcessing: false,
            commentEditorInitText: false,
            notes: []
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

        axios.post(apiUrl('get-comments'), data)
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
                        this.addNewNote(translate('no_comment'));
                    }
                } else {
                    this.addNewNote(res.status + res.statusText)
                }
            })
            .catch(error => {
                this.setState({
                    isCommentListProcessing: false
                });
                this.addNewNote(translate('errorInConnection'), 'danger');
                consoleLog(error);
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

        if (params.content.length <= 0) {
            this.addNewNote(translate('text_here'));
            return false
        }
        this.setState({
            isNewCommentProcessing: true
        });
        let comment = new FormData();
        comment.append('content', params.content);
        comment.append('user_id', this.props.userId);
        comment.append('document_id', this.props.docId);
        comment.append('u_s_i', params.userSpec);
        comment.append('c_f_i', params.file);

        axios.post(apiUrl('send-comment'), comment)
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
                        document.getElementById('count-comment').innerText = this.state.countComment;
                    } else {
                        this.addNewNote(res.data['alertText'])
                    }
                } else {
                    this.addNewNote(res.statusText)
                }
            })
            .catch(error => {
                consoleLog(error);
                this.setState({
                    isNewCommentProcessing: false
                });
                this.addNewNote(translate('errorInConnection'), 'danger')
            });


    };

    /*componentDidMount() {
        this.getCommentList()
    }*/

    addNewNote = (text, type = 'success') => {
        let notes = this.state.notes;
        notes.push({
            text: text,
            type: type
        });
        this.setState({
            notes: notes
        });
    };

    clearNotes = () => {
        this.setState({
            notes: []
        })
    };

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
                {this.state.isCommentListProcessing ? <CommentLoader/> : ''}
                <div className="correspondence">
                    {
                        !this.state.isCommentListShown ? '' :
                            <>
                                {
                                    this.state.comments.length ?
                                        <div className="correspondence_list">
                                            {
                                                this.state.comments.map(
                                                    (comment, key) =>
                                                        <SingleComment comment={comment} key={key}
                                                                       userId={this.props.userId}
                                                                       docId={this.props.docId}
                                                                       parentCommentKey={key}
                                                                       showNewReply={this.showNewReply}
                                                                       addNewNote={this.addNewNote}
                                                                       isDiscussing={this.props.isDiscussing}
                                                        />
                                                )
                                            }
                                        </div>
                                        :
                                        <div className="alert alert-success auth-needed-to-comment"
                                             dangerouslySetInnerHTML={{__html: translate('no_comment')}}>
                                        </div>
                                }
                                {
                                    this.props.isDiscussing === null ? '' :
                                        <CommentEditor
                                            userSpec={this.state.userSpec}
                                            sendComment={this.sendComment}
                                            initText={this.state.commentEditorInitText}
                                            isNewCommentProcessing={this.state.isNewCommentProcessing}
                                            userId={this.props.userId}
                                        />
                                }
                            </>
                    }
                </div>
                <UserNotification notes={this.state.notes} clearNotes={this.clearNotes}/>
            </>
        )
    }

}


class CommentLoader extends Component {
    render() {
        return (
            <ul className="comment-list-loader">
                <li>
                    <Loader type="BallTriangle" color="#05439d" height={60} width={70}/>
                </li>
                <li>
                    <Loader type="BallTriangle" color="#05439d" height={60} width={70}/>
                </li>
                <li>
                    <Loader type="BallTriangle" color="#05439d" height={60} width={70}/>
                </li>
                <li>
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
    userId;

    constructor(props) {
        super(props);
        this.state = {
            content: '',
            userSpec: this.props.userSpec,
            file: null,
            fileSummaryText: null,
            fileSummaryClass: null,
            userSpecList: staticUserSpecList,
            isSpecListProcessing: false
        };
        this.sendComment = this.props.sendComment.bind(this)
    }


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

            if (!userFileConfig.allowedExtensions.includes(extension.toLowerCase())) {
                this.setState({
                    fileSummaryText: translateParams('allowedExtensions', {extensions: '<b>' + userFileConfig.allowedExtensions.join(', ') + '</b>'}),
                    fileSummaryClass: 'text-danger'
                });
                return false
            }

            if (file.size < userFileConfig.minFileSize || file.size > userFileConfig.maxFileSize) {
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
        });
        document.getElementById('comment-file').value = null;
    };


    selectUserSpec = (e) => {
        this.setState({
            userSpec: e.target.value
        })
    };


    getSpecList = () => {

        let userSpecListSession = sessionStorage.getItem('userSpecList');

        if (userSpecListSession) {
            this.setState({
                userSpecList: JSON.parse(userSpecListSession)
            });
            return true
        }

        this.setState({
            isSpecListProcessing: true
        });
        axios.post(apiUrl('spec-list'))
            .then(res => {
                if (res.status === 200 && res.statusText === 'OK')
                    if (res.data && res.data.status) {
                        this.setState({
                            userSpecList: res.data.list
                        });
                        sessionStorage.setItem('userSpecList', JSON.stringify(res.data.list))
                    } else
                        this.addNewNote(translate('errorInSystem'), 'danger');
                else
                    this.addNewNote(res.statusText);
                this.setState({
                    isSpecListProcessing: false
                });
            })
            .catch(error => {
                consoleLog(error);
                this.setState({
                    isSpecListProcessing: false
                });
                this.addNewNote(translate('errorInConnection'), 'danger')
            });
    };


    componentDidMount() {
        if (this.props.userId)
            this.getSpecList();
    }


    render() {
        return (
            <>
                <button className="hidden-divider-btn"></button>
                {
                    this.props.userId ?
                        <>
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
                                        <label htmlFor="comment-file" className="comment-file-label">
                                            {translate('chooseFile')}
                                            <p>
                                                {translate('chooseFile')} <i
                                                className="glyphicon glyphicon-folder-open"></i>
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
                                        <input type="file" id="comment-file" className="hidden"
                                               onChange={this.chooseFile}/>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6">
                                    <div className="form-group">
                                        <label htmlFor="comment-spec">
                                            {translate('chooseSpec')}
                                        </label>
                                        <select id="comment-spec" className="form-control"
                                                onChange={this.selectUserSpec}
                                                disabled={this.state.isSpecListProcessing}
                                        >
                                            {
                                                this.state.isSpecListProcessing ?
                                                    <option>{translate('processing')} ...</option>
                                                    :
                                                    this.state.userSpecList.map((spec, key) => {
                                                        return (
                                                            <option
                                                                value={spec.id}
                                                                key={key}
                                                                selected={this.state.userSpec === spec.id.toString() ? 'selected' : ''}>
                                                                {spec.title}
                                                            </option>
                                                        )
                                                    })
                                            }
                                        </select>
                                        <Loader type="ThreeDots" color="Green" height={20} width={60}
                                                className="user-spec-loader"
                                                visible={this.state.isSpecListProcessing}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-offset-3 col-md-3">
                                    <button className="leave-comment-btn col-md-8 col-sm-4 col-xs-3"
                                            disabled={this.props.isNewCommentProcessing}
                                            onClick={() => {
                                                this.clearFile();
                                                this.sendComment(this.state)
                                            }}>
                                        {
                                            this.props.isNewCommentProcessing ?
                                                <Loader type="Oval" color="white" radius={18} height={24} width={24}/>
                                                : translate('leaveComment')
                                        }
                                    </button>
                                </div>
                            </div>
                        </>
                        :
                        <div className="alert alert-success auth-needed-to-comment"
                             dangerouslySetInnerHTML={{__html: translate('authNeededToComment')}}>
                        </div>
                }
            </>
        )
    }

}
