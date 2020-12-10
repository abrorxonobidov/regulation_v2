/**
 * @author Abrorxon Obidov
 * @date 2020-12-10
 */

import React, {Component} from 'react'

export default class UserNotification extends Component {

    constructor(props) {
        super(props);
        this.clearNotes = this.props.clearNotes.bind(this)
    }

    removeOldestItem = () => {
        console.log('removeOldestItem');
        setTimeout(() => {
            console.log('setTimeout');
            this.clearNotes();
        }, 3000);
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.notes.length > 0) {
            this.removeOldestItem()
        }
    }


    render() {

        return (
            <div id="user-notifications">
                {
                    this.props.notes.map((note, key) => {
                        return (
                            <div className={'alert alert-' + note.type} role="alert" key={key}>
                                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                {note.text}
                                {/*<div className="progress">
                                    <div className={'progress-bar progress-bar-' + note.type} role="progressbar"
                                         style={{width: note.value + '%'}}>
                                    </div>
                                </div>*/}
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}