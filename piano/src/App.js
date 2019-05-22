import React, { Component } from 'react'
import './App.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlayCircle, faStopCircle } from '@fortawesome/free-solid-svg-icons'

import MyPiano from './myPiano'
import SongList from './SongList'
import SaveSong from './saveSong';

import { trigger, listen, events } from './events'

class App extends Component {

  componentDidMount () {
     listen(events.NEW_SONG_RECORDED, (song) => {
      this.song = song
      this.setState({ status: 'SAVING' })
    })

    listen(events.SONG_SAVED, () => {
      delete this.song
      this.setState({ status: 'STOP' })
    })

    listen(events.ERROR, () => {
      window.alert('ERROR')
      this.setState({ status: 'STOP' })
    })

    listen(events.REPRODUCTION_STARTED, () => {
      this.setState({ status: 'PLAYING' })
    })

    listen(events.REPRODUCTION_STOPED, () => {
      this.setState({ status: 'STOP' })
    })
    listen(events.RECORD_STARTED, () => {
      this.setState({ status: 'RECORDING' })
    })

  }
  state = {
    status: 'STOP'
  }

  onClickStartRecord = () => {
    trigger(events.START_RECORD)
  }
  onClickStopRecord = () => {
    trigger(events.STOP_RECORD)
  }

  render () {
    if (this.state.status === 'SAVING') {
      return (<SaveSong song={this.song}/>)
    }
    return (
      <div id ="app" className={this.state.status}>
        <SongList/>
        <div id="buttons">
          <button className="start record" onClick={this.onClickStartRecord}>
            <FontAwesomeIcon icon={faPlayCircle}/> Record
          </button>
          <button className="stop record" onClick={this.onClickStopRecord}>
            <FontAwesomeIcon icon={faStopCircle} /> Stop Recording
          </button>
        </div>
        <MyPiano/>
      </div>
    )
  }
}

export default App
