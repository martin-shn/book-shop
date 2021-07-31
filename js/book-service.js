'use strict';
const DB = getUserId();
const ALLDB = 'booksDB';
const SORTBY = 'sortBy';

var gBooks;
var gPageIdx = 0;
var gPageSize = 5;

function _createBooks() {
    gBooks = [];
    for (var i = 0; i < 25; i++) {
        addBook(makeLorem(1), getRandomIntInclusive(0, 1000), `img/${i % 10}.jpg`, makeLorem(100));
    }
    _saveBooks();
}

function _saveBooks() {
    saveToStorage(DB, gBooks);
    if (isAdmin) _saveAllBooks(gBooks);
}
function _saveAllBooks(allBooksDb) {
    saveToStorage(ALLDB, allBooksDb);
}

function _saveSort(sortBy) {
    if (!sortBy) sortBy = 'idx';
    saveToStorage(SORTBY, sortBy);
}

function _getSortBy() {
    var sortBy = loadFromStorage(SORTBY);
    // if (!sortBy || sortBy === 'undefined') sortBy = 'name';
    return sortBy;
}

function getPageInfo() {
    return { pageIdx: gPageIdx, pageSize: gPageSize, totalBooks: gBooks.length };
}

function getBooks() {
    var books = isAdmin ? loadFromStorage(ALLDB) : loadFromStorage(DB);
    if (!books) _createBooks();
    else {
        gBooks = books;
    }
    // setSortBy(_getSortBy());
    return gBooks.slice(gPageIdx * gPageSize, gPageIdx * gPageSize + gPageSize);
}

function getBook(bookId) {
    return gBooks.find(function (book) {
        return bookId === book.id;
    });
}

function setCurrPage(page) {
    gPageIdx = page;
}

function removeBook(bookId) {
    var bookIdx = gBooks.findIndex(function (book) {
        return bookId === book.id;
    });
    var deletedIdx = bookIdx.idx;
    gBooks.forEach(function (book) {
        if (book.idx > deletedIdx) book.idx--;
    });
    gBooks.splice(bookIdx, 1);

    _saveBooks();
    if (getPageInfo().totalBooks % gPageSize === 0) {
        var totalPages = getPageInfo().totalBooks / gPageSize;
        if (gPageIdx === totalPages) gPageIdx--;
        updatePagesNav();
        gotoPage(gPageIdx);
    }
}

function addBook(bookName, bookPrice, bookImg, bookDesc, bookId) {
    if (bookId) {
        //update a book
        var bookIdx = gBooks.findIndex(function (book) {
            return bookId === book.id;
        });
        gBooks[bookIdx].name = bookName;
        gBooks[bookIdx].price = bookPrice;
        gBooks[bookIdx].imgUrl = bookImg;
        gBooks[bookIdx].desc = bookDesc;
    } else {
        //add a book
        gBooks.unshift({
            idx: 0,
            id: makeId(),
            name: bookName,
            price: bookPrice,
            desc: bookDesc,
            imgUrl: bookImg,
            rating: 0,
        });
        gBooks.forEach(function (book) {
            book.idx++;
        });
    }
    setSortBy(gSortBy);
    // _saveBooks();
    if (getPageInfo().totalBooks % gPageSize === 1) {
        updatePagesNav();
    }
    _saveBooks();
}

function setBookRatings(bookId, step) {
    var bookIdx = gBooks.findIndex(function (book) {
        return bookId === book.id;
    });
    if (
        (gBooks[bookIdx].rating === 0 && step === -1) ||
        (gBooks[bookIdx].rating === 10 && step === 1)
    )
        return;
    gBooks[bookIdx].rating += step;
    _saveBooks();
}

function setSortBy(sortBy) {
    switch (sortBy) {
        case 'idx':
            gBooks.sort(function (a, b) {
                return a.idx - b.idx;
            });
            break;
        case 'id':
            gBooks.sort(function (a, b) {
                if (a.id > b.id) return 1;
                if (b.id > a.id) return -1;
                return 0;
            });
            break;
        case 'name':
            gBooks.sort(function (a, b) {
                if (!a.name) return 1;
                if (!b.name) return -1;
                return a.name.localeCompare(b.name);
                // if (a.name > b.name) return 1;
                // if (b.name > a.name) return -1;
                // return 0;
            });
            break;
        case 'price':
            gBooks.sort(function (a, b) {
                return +b.price - +a.price;
            });
            break;
        case 'ratings':
            gBooks.sort(function (a, b) {
                return +b.rating - +a.rating;
            });
            break;
    }
    _saveBooks();
    if (isAdmin) _saveAllBooks(gBooks);
    _saveSort(sortBy);
}
