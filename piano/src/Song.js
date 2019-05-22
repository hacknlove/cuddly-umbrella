import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons'
import './song.scss'

import { trigger, listen, events } from './events'

class Song extends Component {
    state = {
        status: 'STOP'
    }

    componentDidMount () {
        this.unlistReproductionStarted = listen(events.REPRODUCTION_STARTED, (song) => {
            if (song.id !== this.props.song.id) {
                this.setState({status: 'PLAYINGOTHER'})
                return
            }
            this.setState({status: 'PLAYING'})
        })

        this.unlistReproductionStoped = listen(events.REPRODUCTION_STOPED, () => {
            this.setState({status: 'STOP'})
        })
    }
    componentWillUnmount () {
        this.unlistReproductionStarted()
        this.unlistReproductionStoped()
    }

    onClick = () => {
        switch (this.state.status) {
            case 'PLAYINGOTHER':
                return
            case 'PLAYING':
                trigger(events.STOP_REPRODUCTION)
            break;
            default:
                trigger(events.START_REPRODUCTION, this.props.song)
        }
    }
    render () {
        return (
            <div className={this.state.status} onClick={this.onClick}>
                <span className="controls">
                    <FontAwesomeIcon className="start" icon={faPlay} />
                    <FontAwesomeIcon className="stop" icon={faStop} />
                </span>
                <span className="title">{this.props.song.title}</span>
            </div>
        )
    }
}

export default Song
