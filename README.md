# React Piano Task

Build a small piano application that can play sounds, as well as store and retrieve sequences of played keys (songs).

## Implementation details

- I have focused on learn and understand the basics of React and Graphql, because I has never used them before.
- It may no be as clean as It should, or I can even be doind weirds things instead of the common react practices.
- I use a kiss and naîve event library, because I don't feel like learning redux, react, and graphql at the same time. It apperas to me that my code will end up very unclear and messy.
- For the piano sounds I use https://github.com/danigb/soundfont-player

## Minimum requirements

- Piano UI: (Every thing works out of the box with https://github.com/kevinsqi/react-piano)
    [x] Clickable black and white keys, which play a sound when clicked
    [x] Visual feedback on touching the keys
- Song storage & playback functionality:
    [x] Provide a button to start/stop recording a sequence of keys played on the Piano UI
    [x] Define a song title when storing a song on stop recording
    [x] Show a list of stored songs with title
    [x] Enable replaying stored songs with a small play button next to the title

## Optional features

[x] Enable **correct timing** of played keys for recording & playing songs
[x] Store and retrieve the songs from a **GraphQL** server instead of from a local storage (sample server given here: [Apollo Server](apollo-server))
