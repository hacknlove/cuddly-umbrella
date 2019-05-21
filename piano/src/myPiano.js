import React from 'react'
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano'
import SoundfontProvider from './SoundfontProvider'


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

    startReproduction = (song) => {
        console.log(song)
        this.song = {
            events: song.events,
            index: 0
        }
        this.playNext()
    }
    stopReproduction = () => {
        this.song.pause = true
        this.song.index = 0
    }
    pauseReproduction = () => {
        this.song.pause = true
    }
    continueReproduction = () => {
        this.song.pause = false
        this.playNext()
    }
    playNext = () => {
        const current = this.nextSongStep()
        if (!current) {
            return
        }
        this.setState({
            activeNotes: current.activeNotes
        })
        current.duration && setTimeout(this.playNext, current.duration)
    }
    nextSongStep = () => {
        if (this.song.pause) {
            return {
                activeNotes: []
            }
        }
        return this.song.events[this.song.index++]
    }

    startRecord = () => {
        this.record = {
            events: [],
            lastEventTimestamp: Date.now(),
            currentEvent: {
                activeNotes: []
            }
        }
    }

    stopRecord = () => {
        if (!this.record) {
            return
        }
        this.finishCurrentEvent()
        console.log(this.record)

        return this.record.events
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

        this.newCurrentEvent([midiNumber, ...prevActiveNotes])
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
    }

    render () {
        return (
            <SoundfontProvider
                instrumentName='acoustic_grand_piano'
                audioContext={audioContext}
                hostname={soundfontHostname}
                render={({ isLoading, playNote, stopNote }) => (
                    <Piano
                        noteRange={this.noteRange}
                        width={300}
                        playNote={playNote}
                        stopNote={stopNote}
                        disabled={isLoading}
                        activeNotes={this.state.activeNotes}
                        keyboardShortcuts={this.keyboardShortcuts}
                        onPlayNoteInput={this.onPlayNoteInput}
                        onStopNoteInput={this.onStopNoteInput}
                    />
                )}
            />
        )
    }
}

export default MyPiano
