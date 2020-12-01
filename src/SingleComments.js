import React, {Component} from "react";
import {getTranslate} from "./WordList";


export class SingleComment extends Component {
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

        return <li className="their_text">
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
                <button type="button">{getTranslate('reply_btn_text')}</button>
            </div>
            <a href="#" className="download-comment-file">
                <span className="glyphicon glyphicon-download"></span> &nbsp;
                {getTranslate('download')}
            </a>
            <div id="show_textarea_com3" className="hide_show">
                <textarea></textarea>
            </div>
        </li>
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
                <p className="hidden_comment">{getTranslate('hidden_comment')}</p>
                <div dangerouslySetInnerHTML={{__html: this.props.content}}/>
                <div className="their_name">
                    <span>{authorityTitle}</span>
                </div>
                <div className="reason_to_hide"
                     dangerouslySetInnerHTML={{__html: '<b>' + getTranslate('asos') + ': </b>' + this.props.reason}}/>
            </div>
        )
    }

}


let authorityTitle = document.getElementById('authority-title').innerText;


export class AcceptedCommentBody extends Component {

    render() {
        return (
            <div className="text_write green_block">
                <p className="accepted">{getTranslate('accepted_comment')}</p>
                <div dangerouslySetInnerHTML={{__html: this.props.content}}/>
            </div>
        )
    }

}

export class AuthorityAnswer extends Component {
    render() {
        return (
            <div className="their_text org_text">
                <div className="text_write">
                    <p className="reject">{getTranslate('denied_comment')}</p>
                    <p>1 comment ga javob</p>
                    <div className="their_name">
                        <span>Министерство юстиции Республики Узбекистан</span>
                        <span className="comment_date">2020-09-09 14:37:44</span>
                    </div>
                </div>
            </div>
        )
    }
}


const LikedBtnSvg = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 172.05 165.18">
        <g id="liked">
            <path style={{fill: '#05439D'}}
                  d="M166.14 91.73c3.94,-4.52 5.91,-9.86 5.91,-16.03 0,-5.58 -2.05,-10.42 -6.12,-14.52 -4.09,-4.09 -8.93,-6.13 -14.52,-6.13l-29.79 0c0.28,-1.01 0.57,-1.86 0.86,-2.58 0.28,-0.72 0.69,-1.51 1.18,-2.37 0.5,-0.86 0.87,-1.5 1.08,-1.94 1.29,-2.44 2.28,-4.45 2.96,-6.02 0.68,-1.58 1.35,-3.73 2.04,-6.45 0.69,-2.72 1.02,-5.45 1.02,-8.18 0,-1.72 -0.02,-3.12 -0.05,-4.19 -0.03,-1.08 -0.22,-2.69 -0.53,-4.84 -0.32,-2.16 -0.76,-3.94 -1.29,-5.38 -0.54,-1.43 -1.4,-3.04 -2.58,-4.84 -1.19,-1.79 -2.62,-3.24 -4.3,-4.35 -1.68,-1.11 -3.84,-2.04 -6.45,-2.79 -2.62,-0.76 -5.57,-1.13 -8.88,-1.13 -1.86,0 -3.47,0.69 -4.84,2.05 -1.43,1.43 -2.65,3.23 -3.66,5.37 -1,2.15 -1.7,4.01 -2.1,5.59 -0.39,1.57 -0.84,3.76 -1.34,6.56 -0.65,3 -1.13,5.17 -1.45,6.5 -0.32,1.32 -0.95,3.06 -1.89,5.21 -0.93,2.16 -2.04,3.87 -3.34,5.16 -2.36,2.37 -5.98,6.67 -10.86,12.9 -3.52,4.6 -7.14,8.93 -10.86,13.01 -3.73,4.09 -6.46,6.2 -8.18,6.35 -1.79,0.14 -3.34,0.88 -4.63,2.2 -1.29,1.33 -1.94,2.89 -1.94,4.68l0 68.94c0,1.85 0.69,3.46 2.05,4.78 1.36,1.33 2.97,2.03 4.84,2.1 2.51,0.07 8.17,1.65 16.99,4.74 5.52,1.86 9.84,3.28 12.96,4.24 3.11,0.97 7.47,2.01 13.06,3.12 5.58,1.11 10.75,1.66 15.48,1.66l1.82 0 8.18 0 3.87 0c9.54,-0.14 16.59,-2.94 21.18,-8.39 4.16,-4.95 5.92,-11.43 5.27,-19.47 2.8,-2.65 4.74,-6.02 5.81,-10.11 1.22,-4.36 1.22,-8.56 0,-12.58 3.3,-4.36 4.84,-9.28 4.63,-14.73 0.01,-2.3 -0.53,-5.02 -1.6,-8.18z"></path>
            <path style={{fill: '#05439D'}}
                  d="M37.85 68.83l-30.97 0c-1.86,0 -3.49,0.68 -4.85,2.04 -1.36,1.36 -2.04,2.97 -2.04,4.84l0 68.83c0,1.86 0.68,3.48 2.04,4.84 1.37,1.36 2.98,2.05 4.85,2.05l30.97 0c1.86,0 3.48,-0.69 4.84,-2.05 1.36,-1.36 2.04,-2.97 2.04,-4.84l0 -68.83c0,-1.86 -0.68,-3.48 -2.04,-4.84 -1.36,-1.36 -2.97,-2.04 -4.84,-2.04zm-12.37 66.83c-1.36,1.32 -2.97,1.99 -4.84,1.99 -1.94,0 -3.57,-0.67 -4.89,-1.99 -1.33,-1.33 -2,-2.96 -2,-4.9 0,-1.86 0.67,-3.48 2,-4.84 1.32,-1.36 2.95,-2.04 4.89,-2.04 1.86,0 3.48,0.68 4.84,2.04 1.36,1.36 2.05,2.97 2.05,4.84 0,1.94 -0.69,3.57 -2.05,4.9z"></path>
        </g>
    </svg>
);

const LikeBtnSvg = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 163.18 167.86">
        <g id="like">
            <path style={{fill: '#05439D'}}
                  d="M158.28 114.12c3.44,-4.39 5.08,-9.09 4.87,-13.94 -0.21,-5.33 -2.59,-9.52 -4.56,-12.07 2.28,-5.7 3.16,-14.64 -4.47,-21.59 -5.58,-5.09 -15.05,-7.38 -28.18,-6.74 -9.23,0.42 -16.96,2.14 -17.27,2.21l-0.04 0.01c-1.75,0.33 -3.62,0.71 -5.52,1.13 -0.14,-2.26 0.26,-7.83 4.4,-20.39 4.91,-14.96 4.63,-26.41 -0.91,-34.05 -5.83,-8.04 -15.13,-8.68 -17.87,-8.68 -2.63,0 -5.05,1.09 -6.76,3.09 -3.9,4.53 -3.45,12.88 -2.95,16.75 -4.63,12.42 -17.61,42.9 -28.6,51.34 -0.21,0.14 -0.39,0.32 -0.56,0.5 -3.24,3.41 -5.41,7.09 -6.88,10.32 -2.07,-1.12 -4.42,-1.75 -6.95,-1.75l-21.42 0c-8.06,0 -14.6,6.57 -14.6,14.61l0 57.04c0,8.07 6.57,14.6 14.6,14.6l21.41 0c3.13,0 6.04,-0.98 8.43,-2.66l8.25 0.98c1.26,0.18 23.73,3.02 46.79,2.56 4.18,0.32 8.11,0.5 11.76,0.5 6.29,0 11.76,-0.5 16.32,-1.48 10.74,-2.28 18.08,-6.84 21.8,-13.55 2.84,-5.13 2.84,-10.21 2.39,-13.44 6.99,-6.32 8.22,-13.31 7.97,-18.22 -0.14,-2.83 -0.77,-5.26 -1.44,-7.05zm-143.68 42.9c-2.84,0 -5.12,-2.32 -5.12,-5.12l0 -57.07c0,-2.85 2.32,-5.13 5.12,-5.13l21.41 0c2.85,0 5.13,2.32 5.13,5.13l0 57.04c0,2.84 -2.32,5.12 -5.13,5.12l-21.41 -0.01 0 0.04zm134.69 -47c-1.48,1.55 -1.75,3.89 -0.63,5.71 0,0.04 1.44,2.5 1.61,5.86 0.25,4.6 -1.96,8.68 -6.61,12.14 -1.64,1.26 -2.32,3.44 -1.61,5.41 0,0.04 1.51,4.66 -0.95,9.05 -2.35,4.22 -7.59,7.23 -15.51,8.91 -6.36,1.37 -15,1.61 -25.59,0.77 -0.14,0 -0.32,0 -0.5,0 -22.57,0.5 -45.38,-2.46 -45.63,-2.49l-0.02 0 -3.55 -0.42c0.21,-0.98 0.32,-2.03 0.32,-3.09l0 -57.07c0,-1.52 -0.25,-2.99 -0.66,-4.36 0.63,-2.35 2.39,-7.59 6.53,-12.03 15.77,-12.5 31.17,-54.65 31.83,-56.47 0.28,-0.73 0.35,-1.55 0.21,-2.35 -0.59,-3.94 -0.39,-8.75 0.46,-10.18 1.86,0.04 6.88,0.56 9.89,4.73 3.58,4.95 3.44,13.8 -0.42,25.51 -5.89,17.87 -6.39,27.28 -1.71,31.42 2.32,2.08 5.4,2.19 7.66,1.37 2.14,-0.5 4.17,-0.91 6.1,-1.23 0.14,-0.04 0.32,-0.07 0.46,-0.11 10.78,-2.35 30.08,-3.78 36.79,2.33 5.69,5.19 1.64,12.07 1.19,12.81 -1.3,1.96 -0.91,4.53 0.84,6.1 0.04,0.04 3.71,3.52 3.89,8.18 0.14,3.12 -1.34,6.32 -4.39,9.48z"></path>
        </g>
    </svg>
);


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


