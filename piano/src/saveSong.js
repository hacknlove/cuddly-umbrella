import React, { Component } from 'react'

import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import './saveSong.scss'
import { trigger, events } from './events'

const ADD_SONG = gql`
  mutation AddSongMutation($title: String!, $events: [EventInput]!) {
    addSong(title: $title, events: $events) {
        id
        title
        events{
            activeNotes
            duration
        }
    }
}
`

class SaveSong extends Component {
    state = {
        tite: '',
    }

    render () {
        return (
            <div id="saveSong">
                <div>
                    <input
                        onChange={e => { this.setState({title: e.currentTarget.value})}}
                        type="text"
                        placeholder="The title of the song"
                    />
                    <Mutation
                        mutation={ADD_SONG}
                        variables={{ title: this.state.title, events: this.props.song }}
                        onCompleted={() => trigger(events.SONG_SAVED)}
                        onError={() => trigger(events.ERROR)}
                    >
                        {AddSongMutation => (
                            <button onClick={AddSongMutation}>
                                Submit
                            </button>
                        )}
                    </Mutation>
                </div>
            </div>
        )
    }
}

export default SaveSong
