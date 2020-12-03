/**
 * @author Abrorxon Obidov
 * @date 2020-12-03
 */


import React, {Component} from "react";
import {Translate} from "./wordList";
import {LikedBtnSvg, LikeBtnSvg, DownloadBtnSvg} from "./img/svgList"
import {hostname, currentLang} from "./params";


let authorityTitle = document.getElementById('authority-title').innerText;


export class SingleComment extends Component {

    key;
    comment;

    render() {

        let body;
        let comment = this.props.comment;

        if (comment.is_hidden === true) {
            body = <HiddenCommentBody content={comment.content} reason={comment.reason_to_hide}/>
        } else if (comment.is_applied) {
            body = <AcceptedCommentBody content={comment.content}/>
        } else {
            body = <RegularCommentBody content={comment.content}/>
        }

        return (
            <li className="their_text">
                <div className="their_name">
                    <span>
                        {comment.full_name}
                        {comment.special ? <span className="badge badge_green"> {comment.special} </span> : ''}
                    </span>
                    <span className="comment_date">{comment.created_at}</span>
                </div>

                {body}

                <div className="like_btn">
                    {comment.is_supported ? <LikedBtn/> : <LikeBtn/>}
                    <i>{comment.support_count}</i>
                </div>
                <div className="add_comment">
                    <AddCommentBtn/>
                </div>

                {comment.file ? <DownloadBtn id={comment.id} d={comment.document_id} file={comment.file}/> : ''}

                <div id="show_textarea_com3" className="hide_show">
                    <textarea></textarea>
                </div>

                {comment.authority_answers.map((answer, key) => AuthorityAnswer(answer, key))}

                {comment.user_answers.map((reply, key) => UserReply(reply, key))}
            </li>
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
                <p className="hidden_comment">{Translate('hidden_comment')}</p>
                <div dangerouslySetInnerHTML={{__html: this.props.content}}/>
                <div className="their_name">
                    <span>{authorityTitle}</span>
                </div>
                <div className="reason_to_hide"
                     dangerouslySetInnerHTML={{__html: '<b>' + Translate('asos') + ': </b>' + this.props.reason}}/>
            </div>
        )
    }

}


export class AcceptedCommentBody extends Component {

    render() {
        return (
            <div className="text_write green_block">
                <p className="accepted">{Translate('accepted_comment')}</p>
                <div dangerouslySetInnerHTML={{__html: this.props.content}}/>
            </div>
        )
    }

}


const AuthorityAnswer = (answer, key) => {

    return (
        <div className="their_text org_text" key={key}>
            <div className="text_write">
                <p className="reject"> {Translate('denied_comment')}</p>
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
            {reply.is_hidden ? <p className="hidden_comment">{Translate('hidden_comment')}</p> : ''}
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
                            <b>{Translate('hidden_description')}: </b>
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
            <button>{LikeBtnSvg}</button>
        )
    }
}


let DownloadBtn = (props) => {
    return (
        <a href={hostname + '/' + currentLang + '/download/dc-f?c=' + props.id + '&d=' + props.d + '&f=' + props.file}
           className="dc-f">
            {DownloadBtnSvg} {Translate('download')}
        </a>
    );
};


class AddCommentBtn extends Component {
    render() {
        return (
            <button type="button">{Translate('reply_btn_text')}</button>
        )
    }
}