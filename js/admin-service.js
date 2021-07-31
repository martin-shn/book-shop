'use strict';

function generateAllDb() {
    var mergedBooksDB = [];
    // removeFromStorage(getLoggedInUserId());
    var users = _loadUsers();
    for (var i = 0; i < users.length; i++) {
        // if (users[i].id === getLoggedInUserId()) continue;
        var userBooks = loadFromStorage(users[i].id);
        if (userBooks) mergedBooksDB = merge(userBooks, mergedBooksDB, 'id');
    }
    i = 0;
    mergedBooksDB.forEach(function (book) {
        book.idx = ++i;
    });
    _saveAllBooks(mergedBooksDB);
}

function merge(a, b, evalKey) {
    var reduced = a.filter(function (aitem) {
        return !b.find(function (bitem) {
            return aitem[evalKey] === bitem[evalKey];
        });
    });
    return reduced.concat(b);
}
