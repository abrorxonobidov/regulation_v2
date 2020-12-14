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

    removeNote = () => setTimeout(() => this.clearNotes(), 3000);

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.notes.length > 0) this.removeNote()
    }


    render() {

        return (
            <div id="user-notifications">
                {
                    this.props.notes.map((note, key) => {
                        return (
                            <div className={'alert alert-' + note.type} role="alert" key={key}
                                 dangerouslySetInnerHTML={{__html: note.text}}>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}