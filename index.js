"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
let bookList = [];
let readerList = [];
app.use(express_1.default.json());
app.get('/books', (req, res) => {
    res.send(bookList);
});
app.post('/books', (req, res) => {
    const book = req.body;
    if (book.name && book.author) {
        const index = bookList.length;
        const bookWithIndex = Object.assign(Object.assign({}, book), { index: index + 1 });
        bookList[index] = bookWithIndex;
        res.status(201);
    }
    else {
        res.status(400);
    }
});
app.delete('/books', (req, res) => {
    const book = req.body;
    for (let i = 0; i < bookList.length; i++) {
        if (bookList[i].name === book.name &&
            bookList[i].author === book.author) {
            bookList.splice(i, 1);
            res.status(204);
        }
    }
});
app.put('/books', (req, res) => {
    const book = req.body;
    bookList[book.index - 1] = book;
    res.status(200);
});
//////////////////////////////////////////////////
app.get('/readers', (req, res) => {
    res.send(readerList);
});
app.post('/readers', (req, res) => {
    const reader = req.body;
    if (reader.name && reader.readerId) {
        reader.regDate = new Date();
        reader.deleted = false;
        reader.issuedBooksIds = [];
        readerList.push(reader);
        res.status(201);
    }
    else {
        res.status(400);
    }
});
app.delete('/readers', (req, res) => {
    const reader = req.body;
    for (let i = 0; i < readerList.length; i++) {
        if (readerList[i].name === reader.name &&
            readerList[i].readerId === reader.readerId) {
            readerList[i].deleted = true;
            res.status(204);
        }
    }
});
app.put('/readers', (req, res) => {
    const reader = req.body;
    for (let i = 0; i < readerList.length; i++) {
        if (reader.readerId === readerList[i].readerId) {
            readerList[i].name = reader.name;
            readerList[i].deleted = reader.deleted;
        }
    }
    res.status(200);
});
/////////////////////////////////////////////////
app.post('/getBook', (req, res) => {
    const bookRequest = req.body;
    for (let i = 0; i < readerList.length; i++) {
        if (bookRequest.readerId === readerList[i].readerId) {
            readerList[i].issuedBooksIds[readerList[i].issuedBooksIds.length] = (bookRequest.bookId);
        }
    }
    for (let j = 0; j < bookList.length; j++) {
        if (bookRequest.bookId === bookList[j].index) {
            bookList[j].readerId = bookRequest.readerId;
            const today = new Date();
            bookList[j].issueDate = today;
            let returnDate = new Date();
            returnDate.setMonth(returnDate.getMonth() + 1);
            bookList[j].returnDate = returnDate;
        }
    }
    res.status(201);
});
app.post('/returnBook', (req, res) => {
    const bookRequest = req.body;
    for (let i = 0; i < readerList.length; i++) {
        if (bookRequest.readerId === readerList[i].readerId) {
            for (let j = 0; j < readerList[i].issuedBooksIds.length; j++) {
                if (readerList[i].issuedBooksIds[j] = bookRequest.bookId) {
                    readerList[i].issuedBooksIds.splice(j, 1);
                }
            }
        }
    }
    for (let k = 0; k < bookList.length; k++) {
        if (bookRequest.bookId === bookList[k].index) {
            bookList[k].readerId = undefined;
            bookList[k].issueDate = undefined;
            bookList[k].returnDate = undefined;
        }
    }
});
app.listen(port, () => {
    console.log('Server is watching you masturbate from the ceiling');
});
