import likePng from './img/like.png';
import {getTranslate} from './WordList';
import {Component} from 'react';
import React from 'react';
import {SingleComment} from "./SingleComments";
import comments from './comments';

const CommentArea = (props) => {


    return (
        <div>
            <div className="comment_links">
                {getTranslate('offers', props.lang)} <span>0</span>
                <ShowOffersButton lang={props.lang} userId={props.userId} docId={props.docId}/>
                <div className="clearfix"></div>
            </div>

            <div className="correspondence">
                <ul className="correspondence_list" id="scroll_vertical">
                    {
                        comments.map((comment, key) => {
                                return <SingleComment comment={comment} key={key}/>
                            }
                        )
                    }
                </ul>

            </div>
        </div>
    )
};


class ShowOffersButton extends Component {
    render() {
        return <button type="button" className="blue_link" data-user-id={this.props.userId}
                       data-doc-id={this.props.docId}>
            {getTranslate('showOffers', this.props.lang)}
        </button>
    }
}

ShowOffersButton.defaultProps = {
    userId: 0,
    docId: 0,
    lang: 'uz',
};

export default CommentArea;