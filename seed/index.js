// Imports
const { generateUsers } = require('./scripts/users');
const logger = require('../utils/logger.util');
const { User } = require('../models/user');

// Seed mongodb
const seedDb = async () => {
    try {
        // Clean up database
        await User.deleteMany({});

        // Generate fake users
        const users = await generateUsers();

        // Seed db
        await User.create(users).then((res) => {
            console.log('Users added to db...')
            return res;
        });

    } catch (error) {
        logger.error(error);
    }
};

// Exports
module.exports = {
    seedDb
};