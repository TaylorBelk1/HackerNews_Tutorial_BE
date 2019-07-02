async function feed(parent, args, context, info) {
    //if no filter args are passed where will remain empty and filter will not be implemented
    const where = args.filter ? {
        OR: [
            { description_contains: args.filter },
            { url_contains: args.filter }
        ],
    } : {}

    const links = await context.prisma.links({
        where, //filters based on the string passed in
        skip: args.skip, //starting pagination index
        first: args.first, // ending pagination index
        orderBy: args.orderBy // takes in the user's argument (of type of the enum we declared)
    })

    const count = await context.prisma.linksConnection({
        where,
    }).aggregate().count();

    return {
        links,
        count
    }
}

module.exports = {
    feed
}