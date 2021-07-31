'use strict';
const loginMsg = document.querySelector('.login-msg');

var gUsers;

function init() {
    gUsers = _loadUsers();
    if (!gUsers) {
        gUsers = _createUsers();
        _saveUsers(gUsers);
    }
    console.table(gUsers); //dor dev porpuses only!!!
}

function login() {
    var username = document.querySelector('[name="username"]').value;
    var password = document.querySelector('[name="password"]').value;

    if (doLogin(username, password)) {
        //all ok - move on

        window.location.assign('member.html');
    } else return;
}

function checkEnter(ev) {
    if (ev.keyCode === 13) {
        login();
    }
}

function showEl(el) {
    el.style.visibility = 'visible';
    document.querySelector('[name="username"]').value = '';
    document.querySelector('[name="password"]').value = '';
    document.querySelector('[name="username"]').focus();
    setTimeout(hideEl, 2000, el);
}
function hideEl(el) {
    el.style.visibility = 'hidden';
}

function onClearStorage() {
    clearStorage();
    window.location.reload();
}

function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.assign('index.html');
}
