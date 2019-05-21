import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlayCircle, faStopCircle, faPlay, faStop, faPause } from '@fortawesome/free-solid-svg-icons'

import 'react-piano/dist/styles.css'
import './App.scss'

import MyPiano from './myPiano'
import SongList from './SongList'
class App extends React.Component {
  constructor (props) {
    super(props)
    this.myPiano = React.createRef()
  }

  state = {
    status: 'STOP'
  }

  recordedSong

  onClickStartRecord = () => {
    this.myPiano.current.startRecord()
    this.setState({
      status: 'RECORDING'
    })
  }
  onClickStopRecord = () => {
    const song = {
      song: this.myPiano.current.stopRecord()
    }
    song.title = window.prompt('Set a title for your song (let it empty if you want to not save it)')

    if (!song.title) {
      return
    }

    console.log(this.recordedSong)
    this.setState({
      status: 'STOP'
    })
  }

  onClickStartReproduction = () => {
    this.setState({
      status: 'PLAYING'
    })
    this.myPiano.current.startReproduction({events: this.recordedSong})
  }
  onClickStopReproduction = () => {
    this.setState({
      status: 'STOP'
    })
    this.myPiano.current.stopReproduction()
  }
  onClickPauseReproduction = () => {
    this.setState({
      status: 'PAUSED'
    })
    this.myPiano.current.pauseReproduction()
  }

  render () {
    return (
      <div>
        <div id="buttons" className={this.state.status}>
          <button className="start record" onClick={this.onClickStartRecord}><FontAwesomeIcon icon={faPlayCircle}/> Record </button>
          <button className="stop record" onClick={this.onClickStopRecord}><FontAwesomeIcon icon={faStopCircle} /> Stop</button>
          <button className="start reproduction" onClick={this.onClickStartReproduction}><FontAwesomeIcon icon={faPlay} /> Play</button>
          <button className="pause reproduction" onClick={this.onClickPauseReproduction}><FontAwesomeIcon icon={faPause} /> Pause</button>
          <button className="stop reproduction" onClick={this.onClickStopReproduction}><FontAwesomeIcon icon={faStop} /> Stop</button>
        </div>
        <MyPiano
          ref={this.myPiano}
        />

        <SongList />

      </div>
    )
  }
}

export default App
