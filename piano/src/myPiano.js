import React from 'react'
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano'
import SoundfontProvider from './SoundfontProvider'
import 'react-piano/dist/styles.css'
import './myPiano.scss'

import { trigger, listen, events } from './events'

const audioContext = new (window.AudioContext || window.webkitAudioContext)()
const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net'

class MyPiano extends React.Component {
    noteRange = {
        first: MidiNumbers.fromNote('c3'),
        last: MidiNumbers.fromNote('f4')
    }
    keyboardShortcuts = KeyboardShortcuts.create({
        firstNote: this.noteRange.first,
        lastNote: this.noteRange.last,
        keyboardConfig: KeyboardShortcuts.HOME_ROW
    })

    state = {
        activeNotes: []
    }

    componentDidMount = () => {
        this.unlistStartRecord = listen(events.START_RECORD, () => {
            this.startRecord()
        })
        this.unlistStopRecord = listen(events.STOP_RECORD, () => {
            this.stopRecord()
        })
        this.unlistStartReproduction = listen(events.START_REPRODUCTION, (song) => {
            this.startReproduction(song)
        })
        this.unlistStopReproduction = listen(events.STOP_REPRODUCTION, () => {
            this.stopReproduction()
        })
    }

    componentWillUnmount = () => {
        this.unlistStartRecord()
        this.unlistStopRecord()
        this.unlistStartReproduction()
        this.unlistStopReproduction()
    }

    startReproduction = (song) => {
        this.song = {
            events: song.events,
            index: 0
        }
        this.playNext()
        trigger(events.REPRODUCTION_STARTED, song)
    }
    stopReproduction = () => {
        delete this.song
        trigger(events.REPRODUCTION_STOPED)
    }
    playNext = () => {
        const current = this.nextSongStep()
        this.setState({
            activeNotes: current.activeNotes
        })
        if (current.duration) {
            setTimeout(this.playNext, current.duration)
        } else {
            this.stopReproduction()
        }
    }
    nextSongStep = () => {
        if (!this.song) {
            return {
                activeNotes: []
            }
        }
        return this.song.events[this.song.index++] || { activeNotes: [] }
    }

    startRecord = () => {
        this.record = {
            events: [],
            lastEventTimestamp: Date.now(),
            currentEvent: {
                activeNotes: []
            }
        }

        trigger(events.RECORD_STARTED)
    }

    stopRecord = () => {
        if (!this.record) {
            return
        }
        this.finishCurrentEvent()

        trigger(events.NEW_SONG_RECORDED, this.record.events)
    }

    finishCurrentEvent = () => {
        const currentEventTimestamp = Date.now()
        this.record.currentEvent.duration = currentEventTimestamp - this.record.lastEventTimestamp
        this.record.events.push(this.record.currentEvent)
        this.record.lastEventTimestamp = currentEventTimestamp
    }
    newCurrentEvent = (activeNotes) => {
        this.record.currentEvent = {
            activeNotes: Array.from(new Set(activeNotes))
        }
    }
    onPlayNoteInput = (midiNumber, { prevActiveNotes }) => {
        if (!this.record) {
            return
        }
        this.finishCurrentEvent()

        this.newCurrentEvent([midiNumber, ...prevActiveNotes.filter(e => e !== this.record.lastStop)])
        this.record.lastStop = undefined
    }
    onStopNoteInput = (midiNumber, { prevActiveNotes }) => {
        if (!this.record) {
            return
        }
        if (!prevActiveNotes.includes(midiNumber)) {
            return
        }
        this.finishCurrentEvent()

        this.newCurrentEvent(prevActiveNotes.filter(note => note !== midiNumber))

        // there is a but (maybe race condition) in prevActiveNoter. Sometimes, the currently stoped notes can appear in prevActiveNotes at onPlayNoteInput.
        // I use this to avoid that.
        this.record.lastStop = midiNumber
    }

    render () {
        return (
            <SoundfontProvider
                instrumentName='acoustic_grand_piano'
                audioContext={audioContext}
                hostname={soundfontHostname}
                render={({ isLoading, playNote, stopNote }) => (
                    <div id="piano">
                        <div className="piano">
                            <Piano
                                noteRange={this.noteRange}
                                playNote={playNote}
                                stopNote={stopNote}
                                disabled={isLoading}
                                activeNotes={this.state.activeNotes}
                                keyboardShortcuts={this.keyboardShortcuts}
                                onPlayNoteInput={this.onPlayNoteInput}
                                onStopNoteInput={this.onStopNoteInput}
                            />
                        </div>
                    </div>
                )}
            />
        )
    }
}

export default MyPiano
