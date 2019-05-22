const element = document.createElement('u')

export const trigger = (name, data) => {
    element.dispatchEvent(new CustomEvent(name, {detail: data}))
}

export const listen = (name, callback) => {
    const listener = (event) => {
        callback(event.detail, event)
    }
    element.addEventListener(name, listener)
    return () => {
        element.removeEventListener(name, listener)
    }
}

export const events = {
    START_RECORD: 'startRecord',
    STOP_RECORD: 'stopRecord',
    RECORD_STARTED: 'recordStarted',
    NEW_SONG_RECORDED: 'newSongRecorded',
    SONG_SAVED: 'songSaved',
    ERROR: 'error',
    START_REPRODUCTION: 'startReproduction',
    STOP_REPRODUCTION: 'stopReproduction',
    REPRODUCTION_STOPED: 'reproductionStoped',
    REPRODUCTION_STARTED: 'reproductionStarted'

}
