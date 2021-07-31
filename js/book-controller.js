'use strict';
const currency = '&#8362;'; //₪
var gSortBy,
    isModalOn = false,
    isAdmin = false;

function onInit() {
    //verify the user is legit
    var loggedInUser = loadFromStorage('loggedInUser');
    if (!loggedInUser) logout();

    var gUsers = loadFromStorage('usersDB');
    var currUser = gUsers.find(function (user) {
        return user.id === loggedInUser.id;
    });
    if (!currUser) {
        window.location.assign('index.html');
        return;
    }
    // document.querySelector('.username').innerText = currUser.username;
    if (currUser.isAdmin) {
        isAdmin = true;
        document.querySelector('.admin-btn').style.display = 'inline-block';
        if (!loadFromStorage(ALLDB)) generateAllDb();
        document.querySelector('[name="action-col"]').colSpan = '3';
    }

    renderBooks();
    updatePagesNav();
    onSort(_getSortBy());
}

function updatePagesNav() {
    var books = getPageInfo().totalBooks;
    var booksPerPage = getPageInfo().pageSize;

    document.querySelector('.pages-nav').innerHTML = renderPagesNav(books, booksPerPage);
    gotoPage(getPageInfo().pageIdx);
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
    for (var i = 0; i < newElPage.parentElement.children.length; i++) {
        newElPage.parentElement.children[i].classList.remove('on-page');
    }

    // document.querySelectorAll('i').forEach(function (el) {
    //     el.classList.remove('on-page');
    // });
    newElPage.classList.add('on-page');
}

function renderBooks() {
    var books = getBooks();

    var htmlSTR = books
        .map(function (book) {
            var htmlSTR = `<tr class="book-${book.id}">
        <td class="narrow">${book.idx}</td>
        <td class="narrow">${book.id}</td>
        <td>${book.name}</td>
        <td class="narrow">${book.price} ${currency}</td>
        <td><button class="read btn" onclick="onReadBook('${book.id}')">Read</button></td>`;

            if (isAdmin)
                htmlSTR += `<td><button class="update btn" onclick="onUpdateBook('${book.id}')">Update</button></td>
        <td><button class="delete btn" onclick="onRemoveBook('${book.id}')">Delete</button></td>`;

            htmlSTR += `<td class="narrow" onselectstart="return false;"><i class="material-icons-new outline-remove_circle" onclick="onRatings('${book.id}',-1,this)"></i>
        <div name="rating">${book.rating}</div>
        <i class="material-icons-new outline-add_circle" onclick="onRatings('${book.id}',1,this)"></i></td>
        </tr>`;
            return htmlSTR;
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
    isModalOn = false;
}

function doShowAddBookModal(title, btnText) {
    document.querySelector('.modal h4').innerText = title;
    document.querySelector('.ok').innerText = btnText;

    document.querySelector('.main-screen-modal').style.display = 'block';
    document.querySelector('.main-screen-modal').classList.add('fade-in');
    document.querySelector('[name=book-name]').focus();
}

function onAddBook() {
    if (!isModalOn) {
        //add a new book - clear the form
        document.querySelector('[name=book-name]').value = '';
        document.querySelector('[name=book-price]').value = '';
        document.querySelector('[name=book-img]').value = '';
        document.querySelector('[name=book-desc]').value = '';
        document.querySelector('[name=book-name]').focus();

        doShowAddBookModal('Add a new book', 'Add this Book');
        isModalOn = true;
    } else {
        //get all details from opened form. if new - will be added by service. if exist - will be updated by service.
        isModalOn = false;
        var bookName = document.querySelector('[name=book-name]').value;
        var bookPrice = document.querySelector('[name=book-price]').value;
        var bookImg = document.querySelector('[name=book-img]').value;
        var bookDesc = document.querySelector('[name=book-desc]').value;
        var bookId = document.querySelector('[name=book-name]').getAttribute('bookId');

        if (!bookName.trim() || !bookPrice.trim()) {
            document.querySelector('.wrong-input').style.visibility = 'visible';
            setTimeout(function () {
                document.querySelector('.wrong-input').style.visibility = 'hidden';
            }, 2000);
        } else {
            onCancelAddBook();
            addBook(bookName, bookPrice, bookImg, bookDesc, bookId);
            renderBooks();
        }
        document.querySelector('[name=book-name]').removeAttribute('bookId');
    }
}

function onUpdateBook(bookId) {
    var currBook = getBook(bookId);
    document.querySelector('[name=book-name]').value = currBook.name;
    document.querySelector('[name=book-price]').value = currBook.price;
    document.querySelector('[name=book-desc]').value = currBook.desc;
    document.querySelector('[name=book-img]').value = currBook.imgUrl;

    document.querySelector('[name=book-name]').setAttribute('bookId', bookId);
    doShowAddBookModal('Update a book', 'Update Book');
    isModalOn = true;
}

function onCloseReadBook() {
    isModalOn = false;
    document.querySelector('.read-screen-modal').classList.remove('fade-in');
    document.querySelector('.read-screen-modal').classList.add('fade-out');
    setTimeout(function () {
        document.querySelector('.read-screen-modal').classList.remove('fade-out');
        document.querySelector('.read-screen-modal').style.display = 'none';
    }, 500);
    renderBooks();
}

function onReadBook(bookId) {
    var currBook = getBook(bookId);
    var htmlSTR = `<label>ID: <span>${currBook.id}</span></label><br>
            <label>Book name: <span>${currBook.name}</span></label><br>
            <label>Book price: <span>${currBook.price} ${currency}</span></label><br>
            <img class="book-img" src="${currBook.imgUrl}">
            <div class="book-ratings-in-modal">
            <label>Ratings:</label><br>
            <i class="material-icons-new outline-remove_circle" onclick="onRatings('${currBook.id}',-1,this)"></i>
            <div name="rating">${currBook.rating}</div>
            <i class="material-icons-new outline-add_circle" onclick="onRatings('${currBook.id}',1,this)"></i>
            </div>
            <hr>
            <p>${currBook.desc}</p>`;
    //remember: the description (lorem) is not saved in DB. will be generated each click!
    document.querySelector('.book-details').innerHTML = htmlSTR;
    document.querySelector('.read-screen-modal').style.display = 'block';
    document.querySelector('.read-screen-modal').classList.add('fade-in');
    isModalOn = true;
}

function onRatings(bookId, step, el) {
    setBookRatings(bookId, step);
    renderBooks();
    var currRating;
    if (step === 1) {
        var elRating = el.previousSibling.previousSibling;
        currRating = +elRating.innerText;
        if ((currRating === 0 && step === -1) || (currRating === 10 && step === 1)) return;
        elRating.innerText = currRating + step;
    } else {
        var elRating = el.nextSibling.nextSibling;
        currRating = +elRating.innerText;
        if ((currRating === 0 && step === -1) || (currRating === 10 && step === 1)) return;
        elRating.innerText = currRating + step;
    }
}

function onSort(sortBy) {
    if (gSortBy) {
        //remove old sort and set new sort
        document.querySelector('[data="' + gSortBy + '"]').classList.add('hidden');
    }
    //now set the new sort
    gSortBy = sortBy;
    if (gSortBy) document.querySelector('[data="' + gSortBy + '"]').classList.remove('hidden');
    setSortBy(sortBy);
    renderBooks();
}
