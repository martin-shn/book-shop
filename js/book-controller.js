'use strict';

var gSortBy;

function onInit() {
    renderBooks();
    updatePagesNav();
    onSort(_getSortBy());
}

function updatePagesNav() {
    var books = getPageInfo().totalBooks;
    var booksPerPage = getPageInfo().pageSize;

    document.querySelector('.pages-nav').innerHTML = renderPagesNav(books, booksPerPage);
}

function gotoPage(page) {
    switch (page) {
        case 'first':
            page = 0;
            break;
        case 'prev':
            page = getPageInfo().pageIdx - 1;
            if (page < 0) page = 0;
            break;
        case 'next':
            page = getPageInfo().pageIdx + 1;
            if (page > Math.ceil(getPageInfo().totalBooks / getPageInfo().pageSize - 1))
                page = Math.ceil(getPageInfo().totalBooks / getPageInfo().pageSize - 1);
            break;
        case 'last':
            page = Math.ceil(getPageInfo().totalBooks / getPageInfo().pageSize - 1);
            break;
    }
    setCurrPage(page);
    renderBooks();
    var newElPage = document.querySelector(`[onclick="gotoPage(${page})"]`);
    document.querySelectorAll('i').forEach(function (el) {
        el.classList.remove('on-page');
    });
    newElPage.classList.add('on-page');
}

function renderBooks() {
    var books = getBooks();
    var htmlSTR = books
        .map(function (book) {
            return `<tr class="book-${book.id}">
        <td>${book.id}</td>
        <td>${book.name}</td>
        <td>${book.price}</td>
        <td><button class="read btn" onclick="onReadBook('${book.id}')">Read</button></td>
        <td><button class="update btn" onclick="onUpdateBook('${book.id}')">Update</button></td>
        <td><button class="delete btn" onclick="onRemoveBook('${book.id}')">Delete</button></td>
        <td onselectstart="return false;"><i class="material-icons-new outline-remove_circle" onclick="onRatings('${book.id}',-1)"></i>
        ${book.rating}
        <i class="material-icons-new outline-add_circle" onclick="onRatings('${book.id}',1)"></i></td>
        </tr>`;
        })
        .join('');

    document.querySelector('.books-table').innerHTML = htmlSTR;
}

function onRemoveBook(bookId) {
    removeBook(bookId);
    renderBooks();
}

function onCancelAddBook() {
    document.querySelector('.main-screen-modal').classList.remove('fade-in');
    document.querySelector('.main-screen-modal').classList.add('fade-out');
    setTimeout(function () {
        document.querySelector('.main-screen-modal').classList.remove('fade-out');
        document.querySelector('.main-screen-modal').style.display = 'none';
    }, 500);
}

function doShowAddBookModal() {
    document.querySelector('.modal h4').innerText = 'Add a new book';
    document.querySelector('.ok').innerText = 'Add this Book';
    document.querySelector('[name=book-name]').removeAttribute('bookId');

    document.querySelector('.main-screen-modal').style.display = 'block';
    document.querySelector('.main-screen-modal').classList.add('fade-in');
    document.querySelector('[name=book-name]').focus();
}

function onAddBook() {
    var bookName = document.querySelector('[name=book-name]').value;
    var bookPrice = document.querySelector('[name=book-price]').value;
    var bookImg = document.querySelector('[name=book-img]').value;
    var bookId = document.querySelector('[name=book-name]').getAttribute('bookId');
    document.querySelector('[name=book-name]').value = '';
    document.querySelector('[name=book-price]').value = '';
    document.querySelector('[name=book-img]').value = '';
    document.querySelector('[name=book-name]').focus();

    if (!bookName.trim() || !bookPrice.trim()) {
        document.querySelector('.wrong-input').style.visibility = 'visible';
        setTimeout(function () {
            document.querySelector('.wrong-input').style.visibility = 'hidden';
        }, 2000);
    } else {
        onCancelAddBook();
        addBook(bookName, bookPrice, bookImg, bookId);
        renderBooks();
    }
}

function onUpdateBook(bookId) {
    doShowAddBookModal();

    var currBook = getBook(bookId);
    document.querySelector('[name=book-name]').value = currBook.name;
    document.querySelector('[name=book-price]').value = currBook.price;
    document.querySelector('[name=book-img]').value = currBook.imgUrl;

    document.querySelector('.modal h4').innerText = 'Update a book';
    document.querySelector('.ok').innerText = 'Update Book';
    document.querySelector('[name=book-name]').setAttribute('bookId', bookId);
}

function onCloseReadBook() {
    document.querySelector('.read-screen-modal').classList.remove('fade-in');
    document.querySelector('.read-screen-modal').classList.add('fade-out');
    setTimeout(function () {
        document.querySelector('.read-screen-modal').classList.remove('fade-out');
        document.querySelector('.read-screen-modal').style.display = 'none';
    }, 500);
}

function onReadBook(bookId) {
    var currBook = getBook(bookId);
    var htmlSTR = `<label>ID: <span>${currBook.id}</span></label><br>
            <label>Book name: <span>${currBook.name}</span></label><br>
            <label>Book price: <span>${currBook.price}</span></label><br>
            <label>Ratings: <span>${currBook.rating}</span></label><br>
            <img class="book-img" src="${currBook.imgUrl}">
            <div class="book-ratings-in-modal">
            <label>Ratings:</label><br>
            <i class="material-icons-new outline-remove_circle" onclick="onRatings('${
                currBook.id
            }',-1)"></i>
            <span name="rating">${currBook.rating}</span>
            <i class="material-icons-new outline-add_circle" onclick="onRatings('${
                currBook.id
            }',1)"></i>
            </div>
            <hr>
            <p>${makeLorem()}</p>`;
    //remember: the description (lorem) is not saved in DB. will be generated each click!
    document.querySelector('.book-details').innerHTML = htmlSTR;
    document.querySelector('.read-screen-modal').style.display = 'block';
    document.querySelector('.read-screen-modal').classList.add('fade-in');
}

function onRatings(bookId, step) {
    setBookRatings(bookId, step);
    renderBooks();
    var currRating = +document.querySelector('[name="rating"]').innerText;
    if ((currRating === 0 && step === -1) || (currRating === 10 && step === 1)) return;
    document.querySelector('[name="rating"]').innerText = currRating + step;
}

function onSort(sortBy) {
    if (gSortBy) {
        //remove old sort and set new sort
        document.querySelector('[data="' + gSortBy + '"]').classList.add('hidden');
    }
    //now set the new sort
    gSortBy = sortBy;
    document.querySelector('[data="' + gSortBy + '"]').classList.remove('hidden');
    setSortBy(sortBy);
    renderBooks();
}
