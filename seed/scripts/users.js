// Imports
const { faker } = require('@faker-js/faker');

const generateUsers = async () => {
    const devUser = {
        firstName: 'Test',
        lastName: 'Test',
        username: 'test',
        email: 'test@test.com',
        password: 'password',
        confirmPassword: 'password',
    };

    let users = [];

    for (let i = 0; i < 10; i++) {
        let password = faker.internet.password();
        users.push({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: password,
            confirmPassword: password,
        })
    }

    users.push(devUser);

    return users;
};

// Exports
module.exports = {
    generateUsers
};