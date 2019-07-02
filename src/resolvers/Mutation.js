const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');


// CREATE THE USER
async function signup(parent, args, context, info) {
    //create a hashed password and pass it to createUser on the prisma db
    //then sign with jwt token
    const password = await bcrypt.hash(args.password, 10)
    const user = await context.prisma.createUser({ ...args, password })
    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return { token, user }
}


// LOGIN TO EXISTING USER
async function login(parent, args, context, info) {
    const user = await context.prisma.user({ email: args.email });
    if(!user) {
        throw new Error('No such user found');
    }

    const valid = await bcrypt.compare(args.password, user.password)
    if(!valid) {
        throw new Error('Invalid Password');
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET);
    return{ token, user }
}


// POST
function post(parent, args, context, info) {
    //pulls userId from jwt so we can know who is posting, then creates link using that userID
    const userId = getUserId(context);
    return context.prisma.createLink({
        url: args.url,
        description: args.description,
        postedBy: { connect: { id: userId } }
    })
}

async function vote(parent, args, context, info) {
    // pulls user off of jwt
    const userId = getUserId(context);
    // checks to see if the user has voted on the link before
    const linkExists = await context.prisma.$exists.vote({
        user: { id: userId },
        link: { id: args.linkId }
    })
    // if so, throw an error
    if(linkExists) {
        throw new Error(`Already Voted for link: ${args.linkId}`)
    }
    // if not, create a new vote
    return context.prisma.createVote({
        user: { connect: { id: userId } },
        link: { connect: { id: args.linkId } }
    })
}


module.exports = {
    signup, login, post, vote
}