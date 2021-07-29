'use strict';

function renderPagesNav(items, itemsPerPage) {
    var totalPages = Math.ceil(items / itemsPerPage);
    //<i class="material-icons-new outline-looks_6"></i>
    var htmlSTR = '';
    if (totalPages > 5) {
        for (var i = 0; i < totalPages; i++) {
            htmlSTR += `<span class="page-num-nav" onclick="gotoPage(${i})">${i + 1}</span>`;
        }
    } else {
        for (var i = 0; i < totalPages; i++) {
            switch (i) {
                case 0:
                    htmlSTR += `<i class="material-icons-new outline-looks_one on-page" onclick="gotoPage(0)"></i>`;
                    break;
                case 1:
                    htmlSTR += `<i class="material-icons-new outline-looks_two" onclick="gotoPage(1)"></i>`;
                    break;
                default:
                    htmlSTR += `<i class="material-icons-new outline-looks_${
                        i + 1
                    }" onclick="gotoPage(${i})"></i>`;
                    break;
            }
        }
    }
    return htmlSTR;
}

function makeId(length = 6) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

function makeLorem(size = 100) {
    var words = [
        'The sky',
        'above',
        'the port',
        'was',
        'the color of television',
        'tuned',
        'to',
        'a dead channel',
        '.',
        'All',
        'this happened',
        'more or less',
        '.',
        'I',
        'had',
        'the story',
        'bit by bit',
        'from various people',
        'and',
        'as generally',
        'happens',
        'in such cases',
        'each time',
        'it',
        'was',
        'a different story',
        '.',
        'It',
        'was',
        'a pleasure',
        'to',
        'burn',
    ];
    var txt = '';
    while (size > 0) {
        size--;
        txt += words[Math.floor(Math.random() * words.length)] + ' ';
    }
    return txt;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}
