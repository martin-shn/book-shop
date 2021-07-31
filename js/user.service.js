'use strict';
const USERSDB = 'usersDB';

function _createUsers() {
    var gUsers = [
        {
            id: 'u101',
            username: 'puki',
            password: 'secret',
            lastloginTime: 1601899998864,
            isAdmin: false,
        },
        {
            id: 'u102',
            username: 'muki',
            password: '1234',
            lastloginTime: 1601890998864,
            isAdmin: false,
        },
        {
            id: 'u103',
            username: 'martin',
            password: '1111',
            lastloginTime: 1627470008864,
            isAdmin: true,
        },
    ];
    return gUsers;
}

function _saveUsers(gUsers) {
    saveToStorage(USERSDB, gUsers);
}

function _loadUsers() {
    return loadFromStorage(USERSDB);
}

function getUserId() {
    return loadFromStorage('loggedInUser').id;
}

function getLoggedInUserId() {
    return loadFromStorage('loggedInUser').id;
}

function getUsersToShow() {
    return sortBy(document.querySelector('.sort-users-admin').value);
}

function doLogin(username, password) {
    var currUserIdx = gUsers.findIndex(function (user) {
        return user.username === username;
    });

    if (currUserIdx < 0) {
        showEl(loginMsg);
        return null;
    }

    if (gUsers[currUserIdx].password !== password) {
        showEl(loginMsg);
        return null;
    }
    gUsers[currUserIdx].lastloginTime = new Date();
    saveToStorage('loggedInUser', gUsers[currUserIdx]);
    saveToStorage(USERSDB, gUsers);
    return gUsers[currUserIdx];
}
