// will return an "AsyncIterator" which is used by the GraphQL Server to push the event data to the client
// they are wrapped in an object and need to be provided as the value for a Subscribe field.
// You also have to provide another field called resolve that actaully returns the data from the date emitted by the AsyncIterator

// creates the subscription resolver
function newLinkSubscribe(parent, args, context, info) {
    return context.prisma.$subscribe.link({ mutation_in: ['CREATED'] }).node();
}

function newVoteSubscribe(parent, args, context, info) {
    return context.prisma.$subscribe.votes({ mutation_in: ['CREATED'] }).node();
}

// creates the subscribe object, subscribe must be the Subscription resolver resolve will return it's payload
const newLink = {
    subscribe: newLinkSubscribe,
    resolve: payload => {
        return payload
    }
}

const newVote = {
    subscribe: newVoteSubscribe,
    resolve: payload => {
        return payload
    }
}

module.exports = { newLink, newVote }