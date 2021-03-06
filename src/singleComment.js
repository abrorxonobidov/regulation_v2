/**
 * @author Abrorxon Obidov
 * @date 2020-12-03
 */


import React, {Component} from "react";
import {translate} from "./wordList";
import {LikedBtnSvg, LikeBtnSvg, DownloadBtnSvg} from "./img/svgList"
import {hostname, currentLang, apiUrl} from "./params";
import axios from "axios";
import Loader from 'react-loader-spinner';
import {consoleLog} from "./functions";


let authorityTitle = document.getElementById('authority-title').innerText;


export class SingleComment extends Component {

    key;
    comment;
    userId;
    docId;
    parentCommentKey;
    isDiscussing;

    constructor(props) {
        super(props);
        this.state = {
            comment: this.props.comment,
            showReplyPoly: false,
            isSupportProcessing: false
        };
        this.showNewReply = this.props.showNewReply.bind(this);
        this.addNewNote = this.props.addNewNote.bind(this);
    }

    support = () => {

        this.setState({
            isSupportProcessing: true
        });

        let data = new FormData();
        data.append('user_id', this.props.userId);
        data.append('document_id', this.props.comment.document_id);
        data.append('comment_id', this.props.comment.id);
        data.append('paragraph_id', this.props.comment.document_id);

        axios.post(apiUrl('support-comment'), data)
            .then(res => {
                if (res.status === 200 && res.statusText === 'OK') {
                    if (res.data && res.data.status) {
                        let supportedComment = this.state.comment;
                        supportedComment.is_supported = true;
                        supportedComment.support_count = res.data.count;
                        this.setState({
                            comment: supportedComment,
                        });
                    } else {
                        this.addNewNote(res.data['alertText']);
                    }
                } else {
                    this.addNewNote(res.statusText)
                }
                this.setState({
                    isSupportProcessing: false
                });
            })
            .catch(error => {
                consoleLog(error);
                this.setState({
                    isSupportProcessing: false
                });
                this.addNewNote(translate('errorInConnection'), 'danger')
            });
    };


    handleReplyPoly = () => {
        this.setState({
            showReplyPoly: !this.state.showReplyPoly
        })
    };


    render() {

        let body;
        let comment = this.state.comment;

        if (comment.is_hidden) {
            body = <HiddenCommentBody content={comment.content} reason={comment.reason_to_hide}/>
        } else if (comment.is_applied) {
            body = <AcceptedCommentBody content={comment.content}/>
        } else {
            body = <RegularCommentBody content={comment.content}/>
        }

        return (
            <div className="their_text">
                <div className="their_name">
                    <span>
                        {comment.full_name}
                        {comment.special ? <span className="badge badge_green"> {comment.special} </span> : ''}
                    </span>
                    <span className="comment_date">{comment.created_at}</span>
                </div>

                {body}

                <div className="like_btn">
                    {
                        comment.is_supported ? <LikedBtn/> :
                            <LikeBtn
                                onClick={this.props.userId > 0 ? this.support : () => this.addNewNote(translate('authNeededToLike'))}
                                isSupportProcessing={this.state.isSupportProcessing}/>
                    }
                    <i>{comment.support_count}</i>
                </div>
                {
                    (this.props.isDiscussing === null || comment.is_hidden) ? '' :
                        <div className="add_comment">
                            <AddCommentBtn
                                onClick={this.props.userId > 0 ? this.handleReplyPoly : () => this.addNewNote(translate('authNeededToComment'))}/>
                        </div>
                }

                {comment.file ? <DownloadBtn id={comment.id} d={comment.document_id} file={comment.file}/> : ''}

                {
                    this.state.showReplyPoly ?
                        <ReplyPoly parentId={comment.id} userId={this.props.userId} docId={this.props.docId}
                                   showNewReply={this.showNewReply} parentCommentKey={this.props.parentCommentKey}
                                   addNewNote={this.addNewNote}
                        /> : ''
                }

                {comment.authority_answers.map((answer, key) => AuthorityAnswer(answer, key))}

                {comment.user_answers.map((reply, key) => userReply(reply, key))}
            </div>
        )
    }

}

class ReplyPoly extends Component {

    constructor(props) {
        super(props);
        this.state = {
            content: '',
            isReplyProcessing: false
        };
        this.showNewReply = this.props.showNewReply.bind(this);
        this.addNewNote = this.props.addNewNote.bind(this)
    }

    userId;
    parentId;
    parentCommentKey;

    sendReply = () => {
        if (this.state.content.length <= 0) {
            alert(translate('text_here'));
            return false
        }

        this.setState({
            isReplyProcessing: true
        });

        let data = new FormData();
        data.append('user_id', this.props.userId);
        data.append('parent_id', this.props.parentId);
        data.append('document_id', this.props.docId);
        data.append('content', stripHtml(this.state.content));

        axios.post(apiUrl('send-comment'), data)
            .then(res => {
                if (res.status === 200 && res.statusText === 'OK') {
                    if (res.data && res.data.status) {
                        let newReply = res.data.data;
                        newReply.content = this.state.content;
                        newReply.parentCommentKey = this.props.parentCommentKey;
                        newReply.parentId = this.props.parentId;
                        this.setState({
                            content: '',
                            isReplyProcessing: false
                        });
                        this.showNewReply(newReply);
                    } else {
                        this.addNewNote(res.data['alertText'], 'danger')
                    }
                } else {
                    this.addNewNote(res.statusText, 'danger')
                }
            })
            .catch(error => {
                consoleLog(error);
                this.setState({
                    isReplyProcessing: false
                });
                this.addNewNote(translate('errorInConnection'), 'danger')
            });

    };

    setCommentText = (e) => {
        this.setState({
            content: e.target.value
        })
    };

    render() {
        return (
            <div className="reply-poly">
                <textarea value={this.state.content} placeholder={translate('text_here') + ' ...'}
                          onChange={this.setCommentText}/>
                <button type="button" className="blue_link" onClick={this.sendReply}
                        disabled={this.state.isReplyProcessing}>
                    {
                        this.state.isReplyProcessing ?
                            <Loader type="Oval" color="white" radius={18} height={24} width={24}/>
                            :
                            translate('reply_btn_text')
                    }
                </button>
            </div>
        )
    }

}


export class RegularCommentBody extends Component {
    render() {
        return <div className="text_write" dangerouslySetInnerHTML={{__html: this.props.content}}/>
    }
}


export class HiddenCommentBody extends Component {

    render() {
        return (
            <div className="text_write hidden_block">
                <p className="hidden_comment">{translate('hidden_comment')}</p>
                <div dangerouslySetInnerHTML={{__html: this.props.content}}/>
                <div className="their_name">
                    <span>{authorityTitle}</span>
                </div>
                <div className="reason_to_hide"
                     dangerouslySetInnerHTML={{__html: this.props.reason ? '<b>' + translate('hidden_description') + ': </b>' + this.props.reason : ''}}/>
            </div>
        )
    }

}


export class AcceptedCommentBody extends Component {

    render() {
        return (
            <div className="text_write green_block">
                <p className="accepted">{translate('accepted_comment')}</p>
                <div dangerouslySetInnerHTML={{__html: this.props.content}}/>
            </div>
        )
    }

}


const AuthorityAnswer = (answer, key) => {

    return (
        <div className="their_text org_text" key={key}>
            <div className="text_write">
                <p className="reject"> {translate('denied_comment')}</p>
                <div dangerouslySetInnerHTML={{__html: answer.content}}/>
                <div className="their_name">
                    <span>{answer.authority}</span>
                    <span className="comment_date">{answer.created_at}</span>
                </div>
            </div>
        </div>
    )
};


const userReply = (reply, key) => {
    return (
        <div className={reply.is_hidden ? 'answer_box hidden_block' : 'answer_box'} key={key}>
            {reply.is_hidden ? <p className="hidden_comment">{translate('hidden_comment')}</p> : ''}
            <div dangerouslySetInnerHTML={{__html: stripHtml(reply.content)}}/>
            <div className="their_name">
                <span> {reply.full_name} </span>
                <span className="comment_date">{reply.created_at}</span>
            </div>
            {
                reply.is_hidden ?
                    <>
                        <div className="their_name">
                            <span>{authorityTitle}</span>
                        </div>
                        <div className="reason_to_hide"
                             dangerouslySetInnerHTML={{__html: reply.reason_to_hide ? '<b>' + translate('hidden_description') + ': </b>' + reply.reason_to_hide : ''}}
                        ></div>
                    </> : ''
            }
        </div>
    )
};

let stripHtml = (html) => {
    const code = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '&': '&amp;',
        '\'': '&apos;'
    };
    return html.replace(/[\u00A0-\u9999<>\&''""]/gm, (i) => code[i]);
};

class LikedBtn extends Component {
    render() {
        return <button>{LikedBtnSvg}</button>
    }
}


class LikeBtn extends Component {
    render() {
        return (
            <button onClick={this.props.onClick}>
                {
                    this.props.isSupportProcessing ?
                        <Loader type="Oval" width={15} height={15} radius={12} color="#05439d"
                                className='like-btn-loader'/>
                        :
                        LikeBtnSvg
                }
            </button>
        )
    }
}


let DownloadBtn = (props) => {
    return (
        <a href={hostname + '/' + currentLang + '/download/dc-f?c=' + props.id + '&d=' + props.d + '&f=' + props.file}
           className="dc-f">
            {DownloadBtnSvg} {translate('download')}
        </a>
    );
};


class AddCommentBtn extends Component {
    render() {
        return (
            <button type="button" onClick={this.props.onClick}>{translate('reply_btn_text')}</button>
        )
    }
}