const DICT = {
    'locale':{en:'en-US', he:'he'},
    'options':{en:'USD',he:'ILS'},
    'btn-add':{en:'Add a book',he:'הוספת ספר חדש'},
    'btn-logout':{en:'Logout',he:'התנתק'},
    'tbl-ID':{en:'ID',he:'מקט'},
    'tbl-name':{en:'Name',he:'כותר'},
    'tbl-price':{en:'Price',he:'מחיר'},
    'tbl-actions':{en:'Actions',he:'פעולות'},
    'tbl-ratings':{en:'Ratings',he:'דירוג'},
    'btn-read':{en:'Read',he:'קרא'},
    'lbl-book-name':{en:'Book name:',he:'שם כותר:'},
    'lbl-book-price':{en:'Price:',he:'מחיר:'},
    'lbl-book-desc':{en:'Description:',he:'תיאור:'},
    'err-input':{en:'Wrong inputs... Try again!',he:'פרטים שגויים. נסה שנית!'},
    'btn-cancel':{en:'Cancel',he:'ביטול'},
    'btn-add-new':{en:'Add this book',he:'הוסף כותר זה למאגר'},
    'h4-details':{en:'Book details',he:'פרטי הכותר'},
    'btn-close':{en:'Close',he:'סגור'},
    'h4-add-new-book':{en:'Add a new book',he:'הוספת ספר חדש'},
    'lbl-img':{en:'Image URL:',he:'מיקום תמונה:'},
    'ph-book-name':{en:'Type book name here...',he:'הקלד שם כותר'},
    'ph-book-price':{en:'Price',he:'מחיר'},
    'ph-book-desc':{en:'Book description',he:'תיאור'},
    'ph-book-img':{en:'Type image URL or path',he:'נתיב לתמונה'},
    'btn-clear-storage':{en:'Clear all storage',he:'נקה את כל הרשומות מהזכרון'},
    'btn-update':{en:'Update',he:'עריכה'},
    'btn-remove':{en:'Delete',he:'מחק'},
    'h4-update':{en:'Update a book',he:'עריכת כותר'},
    'btn-save':{en:'Update Book',he:'שמור עדכון'},





};



function getDict(key){
    return DICT[key];
}