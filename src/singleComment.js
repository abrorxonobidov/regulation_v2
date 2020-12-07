/**
 * @author Abrorxon Obidov
 * @date 2020-12-03
 */


import React, {Component} from "react";
import {translate} from "./wordList";
import {LikedBtnSvg, LikeBtnSvg, DownloadBtnSvg} from "./img/svgList"
import {hostname, currentLang, ApiUrl} from "./params";
import axios from "axios";


let authorityTitle = document.getElementById('authority-title').innerText;


export class SingleComment extends Component {

    key;
    comment;
    userId;
    parentCommentKey;

    constructor(props) {
        super(props);
        this.state = {
            comment: this.props.comment,
            showReplyPoly: false
        };
        this.showNewReply = this.props.showNewReply.bind(this);
    }

    support = () => {

        let data = new FormData();
        data.append('user_id', this.props.userId);
        data.append('document_id', this.props.comment.document_id);
        data.append('comment_id', this.props.comment.id);
        data.append('paragraph_id', this.props.comment.document_id);

        axios.post(ApiUrl('support-comment'), data)
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
                        alertToUser(res.data['alertText']);
                    }
                } else {
                    alertToUser(res.statusText)
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    modal = () => {
        alert('Auth needed. Show auth modal');
    };

    handleReplyPoly = () => {
        this.setState({
            showReplyPoly: !this.state.showReplyPoly
        })
    };


    render() {

        let body;
        let comment = this.state.comment;

        if (comment.is_hidden === true) {
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
                    {comment.is_supported ? <LikedBtn/> :
                        <LikeBtn onClick={this.props.userId ? this.support : alertToUser('Auth needed..')}/>}
                    <i>{comment.support_count}</i>
                </div>
                <div className="add_comment">
                    <AddCommentBtn onClick={this.props.userId ? this.handleReplyPoly : alertToUser('Auth needed')}/>
                </div>

                {comment.file ? <DownloadBtn id={comment.id} d={comment.document_id} file={comment.file}/> : ''}

                {
                    this.state.showReplyPoly ?
                    <ReplyPoly parentId={comment.id} userId={this.props.userId} showNewReply={this.showNewReply} parentCommentKey={this.props.parentCommentKey}/>
                    :
                    ''
                }

                {comment.authority_answers.map((answer, key) => AuthorityAnswer(answer, key))}

                {comment.user_answers.map((reply, key) => UserReply(reply, key))}
            </div>
        )
    }

}

class ReplyPoly extends Component {

    constructor(props) {
        super(props);
        this.state = {
            content: ''
        };
        this.showNewReply = this.props.showNewReply.bind(this)
    }

    userId;
    parentId;
    parentCommentKey;

    sendReply = () => {
        if (this.state.content.length > 0) {

            let data = new FormData();
            data.append('user_id', this.props.userId);
            data.append('parent_id', this.props.parentId);
            data.append('content', this.state.content);

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

    setCommentText = (e) => {
        this.setState({
            content: e.target.value
        })
    };

    render() {
        return (
            <div>
                <textarea value={this.state.content} placeholder={translate('text_here') + '...'} onChange={this.setCommentText}/>
                <button type="button" className="blue_link pull-right" onClick={this.sendReply}>
                    {translate('reply_btn_text')}
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
                     dangerouslySetInnerHTML={{__html: '<b>' + translate('asos') + ': </b>' + this.props.reason}}/>
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


const UserReply = (reply, key) => {
    return (
        <div className={reply.is_hidden ? 'answer_box hidden_block' : 'answer_box'} key={key}>
            {reply.is_hidden ? <p className="hidden_comment">{translate('hidden_comment')}</p> : ''}
            <div dangerouslySetInnerHTML={{__html: reply.content}}/>
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
                        <div className="reason_to_hide">
                            <b>{translate('hidden_description')}: </b>
                            {reply.reason_to_hide}
                        </div>
                    </> : ''
            }
        </div>
    )
};


class LikedBtn extends Component {
    render() {
        return <button>{LikedBtnSvg}</button>
    }
}


class LikeBtn extends Component {
    render() {
        return (
            <button onClick={this.props.onClick}>{LikeBtnSvg}</button>
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

export let alertToUser = (params) => {
    alert(params);
};