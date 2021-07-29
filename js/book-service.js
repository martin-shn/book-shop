'use strict';
const DB = 'booksDB';
const SORTBY = 'sortBy';

var gBooks;
var gPageIdx = 0;
var gPageSize = 5;

function _createBooks() {
    gBooks = [];
    for (var i = 0; i < gPageSize; i++) {
        gBooks.push({ id: makeId(), name: null, price: 0, imgUrl: null, rating: 0 });
    }
    _saveBooks();
}

function _saveBooks() {
    saveToStorage(DB, gBooks);
}

function _saveSort(sortBy) {
    saveToStorage(SORTBY, sortBy);
}

function _getSortBy() {
    return loadFromStorage(SORTBY);
}

function getPageInfo() {
    return { pageIdx: gPageIdx, pageSize: gPageSize, totalBooks: gBooks.length };
}

function getBooks() {
    var books = loadFromStorage(DB);
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
    gBooks.splice(bookIdx, 1);
    _saveBooks();
    if (getPageInfo().totalBooks % gPageSize === 0) {
        updatePagesNav();
        gotoPage(0);
    }
}

function addBook(bookName, bookPrice, bookImg, bookId) {
    if (bookId) {
        //update a book
        var bookIdx = gBooks.findIndex(function (book) {
            return bookId === book.id;
        });
        gBooks[bookIdx].name = bookName;
        gBooks[bookIdx].price = bookPrice;
        gBooks[bookIdx].imgUrl = bookImg;
    } else {
        //add a book
        gBooks.unshift({
            id: makeId(),
            name: bookName,
            price: bookPrice,
            imgUrl: bookImg,
            rating: 0,
        });
    }
    _saveBooks();
    if (getPageInfo().totalBooks % gPageSize === 1) {
        updatePagesNav();
    }
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
    _saveSort(gSortBy);
}
