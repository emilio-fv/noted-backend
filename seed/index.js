// Imports
const { generateUsers } = require('./scripts/users');
const logger = require('../utils/logger.util');
const { User } = require('../models/user');
const { Review } = require('../models/review');
const { generateReview } = require('./scripts/reviews');

// Seed mongodb
const seedDb = async () => {
    try {
        // Clean up database
        await User.deleteMany({});
        await Review.deleteMany({});

        // Generate fake users
        const userData = await generateUsers();

        // Seed db
        const users = await User.create(userData);

        let reviewData = [];

        for (let user of users) {
            const generatedReviews = await generateReview(user._id, user.username);
            reviewData.push(...generatedReviews);
        }

        for (let review of reviewData) {
            const reviewStats = new Map();
            reviewStats.set('lifetime', 1 );
            reviewStats.set('byYear', { 2024: 1 });

            await Review.create(review).then(async () => {
                await User.findByIdAndUpdate(review.author.userId, {
                    reviewStats: reviewStats
                })
            });
            // TODO update review stats

            // await createReview(review).then(async () => {
            //     const parsedDate = review.date.split('/');
            //     const year = parsedDate[2];
            //     await updateUsersReviewStats(review.author.userId, {
            //         type: 'add',
            //         year: year,
            //     })
            // })
        }

        return;
    } catch (error) {
        logger.error(error);
    }
};

// Exports
module.exports = {
    seedDb
};