// Imports
const { User } = require('../../models/user');

const getUsersByQuery = async (searchQuery) => {
    const regex = new RegExp(searchQuery, 'i');

    const foundUsers = User.find({
        $or: [
            { username: { $regex: regex } },
            { email: { $regex: regex } },
        ]
    },
        'username'
    );

    return foundUsers;
}

// Exports
module.exports = {
    getUsersByQuery,
}