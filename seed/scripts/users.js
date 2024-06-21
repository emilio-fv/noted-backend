// Imports
const { faker } = require('@faker-js/faker');

const generateUsers = async () => {
    const devUser = {
        firstName: 'Test',
        lastName: 'Test',
        username: 'test',
        email: 'test@test.com',
        password: 'Password1$',
        confirmPassword: 'Password1$',
    };

    const devUser2 = {
        firstName: 'Test2',
        lastName: 'Test2',
        username: 'test2',
        email: 'test2@test.com',
        password: 'Password1$',
        confirmPassword: 'Password1$',
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
    users.push(devUser2);

    return users;
};

// Exports
module.exports = {
    generateUsers
};