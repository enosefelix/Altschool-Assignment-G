var fs = require('fs')
var path = require('path')
var books = path.join(__dirname, 'db', 'books.json');
let database = require('./db/books.json');

function getBooks(req, res) {
    fs.readFile(books, 'utf8', (e, data) => {
        if (e) {
            console.log(e);
            res.writeHead(404);
            res.end('An error occured', e)
        }
        res.end(data)
    })
}

var addBook = function (req, res) {
    var body = [];

    req.on('data', (chunk) => {
        body.push(chunk);
    });

    req.on('end', () => {
        fs.readFile(books, 'utf8', (e, data) => {
            if (e) {
                console.log(e);
                res.writeHead(400)
                res.end('An error occured')
            }
            var parsedBody = Buffer.concat(body).toString();
            var newBook = JSON.parse(parsedBody);

            // adding an ID
            var lastBook = database[database.length - 1];
            var lastBookId = lastBook.id;
            newBook.id = parseInt(lastBookId) + 1;

            database.push(newBook);

            //saving to db
            fs.writeFile(books, JSON.stringify(database), (err) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end(JSON.stringify({
                        message: 'Internal Server Error. Could not save book to database.'
                    }));
                }

                res.end(JSON.stringify(newBook));
            });
        })

    });
}

var updateBook = function (req, res) {
    var body = [];

    req.on('data', (chunk) => {
        body.push(chunk);
    });

    req.on('end', () => {
        fs.readFile(books, 'utf8', (e, data) => {
            var parsedBook = Buffer.concat(body).toString();
            var book = JSON.parse(parsedBook);
            var bookId = book.id;
            if (e) {
                console.log(e);
                res.writeHead(400)
                res.end('An error occured')
            }
            // console.log(book);


            // finding an ID
            parsedData = JSON.parse(data)
            var findId = parsedData.findIndex(database => database.id === bookId)

            if (findId === -1) {
                res.writeHead(404);
                res.end('Book not Found')
                return;
            }

            // update function
            var updatedBook = { ...parsedData[findId], ...book };
            parsedData[findId] = updatedBook;

            //saving to db
            fs.writeFile(books, JSON.stringify(parsedData), (err) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end(JSON.stringify({
                        message: 'Internal Server Error. Could not save book to database.'
                    }));
                }
                res.writeHead(200)
                res.end('Book Updated Successfully');
            });
        })

    });
}

var deleteBook = function (req, res) {
    var body = [];

    req.on('data', (chunk) => {
        body.push(chunk);
    });

    req.on('end', () => {
        fs.readFile(books, 'utf8', (e, data) => {
            var parsedBook = Buffer.concat(body).toString();
            var book = JSON.parse(parsedBook);
            var bookId = book.id;
            if (e) {
                console.log(e);
                res.writeHead(400)
                res.end('An error occured')
            }
            // console.log(book);


            // finding an ID
            parsedData = JSON.parse(data)
            var findId = parsedData.findIndex(database => database.id === bookId)

            if (findId === -1) {
                res.writeHead(404);
                res.end('Book not Found')
                return;
            }

            // delete function
            parsedData.splice(findId, 1);
            console.log(parsedData);

            //saving to db
            fs.writeFile(books, JSON.stringify(parsedData), (err) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end(JSON.stringify({
                        message: 'Internal Server Error. Could not save book to database.'
                    }));
                }
                res.writeHead(200)
                res.end('Book Deleted Successfully');
            });
        })

    });
}


module.exports = {
    getBooks,
    addBook,
    updateBook,
    deleteBook
}