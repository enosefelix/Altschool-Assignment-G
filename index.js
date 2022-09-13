var { getBooks, addBook, updateBook, deleteBook } = require('./public/books');
var { getUsers, getAllUsers, createUser, authenticateUser } = require('./public/users');

// functionality for books
module.exports = function listener(req, res) {
    // books functioanlity

    url = req.url;
    method = req.method;
    if (url === '/books' && method === 'POST') {
        addBook(req, res)
    }
    else if (url === '/books' && method === 'PUT') {
        updateBook(req, res)
    }
    else if (url === '/books' && method === 'DELETE') {
        deleteBook(req, res)
    }

    // // users functionality

    if (url === '/users' && method === 'POST') {
        authenticateUser(req, res)
            .then(() => {
                getBooks(req, res);
            }).catch((e) => {
                res.writeHead(400)
                res.end('An error occured', e)
            });
    }
    if (url === '/users' && method === 'GET') {
            getAllUsers(req, res);
    }
    else if (url === '/users/create' && method === 'POST') {
        createUser(req, res)
    }
}