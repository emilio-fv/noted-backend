const { faker } = require('@faker-js/faker');

const generateReview = async (userId, username) => {
    let reviews = [];

    const increments = 11; // 0, 0.5, 1, ..., 5 gives us 11 possible values
    const randomRating = Math.floor(Math.random() * increments);

    const randomDate = faker.date.past();
    const formattedDate = randomDate.toLocaleDateString('en-US');

    reviews.push({
        date: formattedDate,
        artist: 'Beyoncé',
        artistId: '6vWDO969PvNqNYHIOW5v0m',
        album: 'BEYONCÉ [Platinum Edition]',
        albumId: '6FJxoadUE4JNVwWHghBwnb',
        albumImages: [{
            url: '',
            height: 300,
            width: 300,
        }], 
        rating: randomRating * 0.5,
        reviewText: faker.lorem.sentences(2),
        favorite: false,
        author: {
            userId: userId,
            username: username,
        },
    });

    return reviews;
}

module.exports = {
    generateReview
}