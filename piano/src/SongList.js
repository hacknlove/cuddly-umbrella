import React, { Component } from 'react'
import Song from './Song'
import './songList.scss'

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
                {({ loading, error, data, refetch}) => {
                    refetch()
                    if (loading) return <div>Fetching</div>
                    if (error) return <div>Error</div>
                    return (
                        <div id="songList">
                            {data.songs.map(song => <Song key={song.id} song={song}/>)}
                        </div>
                    )
                }}
            </Query>
        )
    }
}

export default SongList
