/**
 * @author Abrorxon Obidov
 * @date 2020-12-03
 */


import {Translate} from './wordList';
import {Component} from 'react';
import React from 'react';
import {SingleComment, alertToUser} from "./singleComment";
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
                    if (res.status === 200 && res.statusText === 'OK') {
                        console.log(res);
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

    componentDidMount() {
        //this.getData()
    }

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
                                    (comment, key) => <SingleComment comment={comment} key={key}
                                                                     userId={this.props.userId}/>
                                )
                                : ''
                        }
                    </ul>
                    <Loaders show={this.state.isProcessing}/>
                </div>
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
