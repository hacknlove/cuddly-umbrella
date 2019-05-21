import React, { Component } from 'react'
import Song from './Song'

import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const SONGS_QUERY = gql`
    query {
        songs {
            id
            title
        events{
            activeNotes
            duration
        }
        }
    }
`

class SongList extends Component {
    render () {
        return (
            <Query query={SONGS_QUERY}>
                {({loading, error, data}) => {
                    if (loading) return <div>Fetching</div>
                    if (error) return <div>Error</div>
                    return (
                        <div>
                            {data.songs.map(song => <Song key={song.id} title={song.title} />)}
                        </div>
                    )
                }}
            </Query>
        )
    }
}

export default SongList
