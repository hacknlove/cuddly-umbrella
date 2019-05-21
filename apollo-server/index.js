const { ApolloServer, gql } = require('apollo-server');

const songs = [];

const typeDefs = gql`
    type Event {
        activeNotes: [Int],
        duration: Int
    }

    type Song {
        id: ID!
        title: String
        events: [Event]
    }

    type Query {
        songs: [Song]
    }

    type Mutation {
        addSong(title: String, events: [String]): Song
    }
`

const resolvers = {
    Query: {
        songs: () => songs,
    },
    Mutation: {
        addSong: (_, { title, keysPlayed }) => {
            const newSong = {
                id: songs.length + 1,
                title,
                song,
            };
            songs.push(newSong);

            return newSong;
        }
    }
}

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`Apollo server running: ${url}`);
});
