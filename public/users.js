var fs = require('fs')
var path = require('path')
var users = path.join(__dirname, 'db', 'users.json');
let database = require('./db/users.json');

function getUsers(req, res) {
    return new Promise((resolve, reject) => {
        fs.readFile(users, 'utf8', (e, data) => {
            if (e) {
                reject(e)
            }
            resolve(JSON.parse(data))
        })
    })
}

function getAllUsers(req, res) {
    fs.readFile(users, 'utf8', (e, data) => {
        if (e) {
            console.log(e);
            res.writeHead(404);
            res.end('An error occured', e)
        }
        res.end(data)
    })
}

var createUser = function (req, res) {
    var body = [];

    req.on('data', (chunk) => {
        body.push(chunk);
    });

    req.on('end', () => {
        fs.readFile(users, 'utf8', (e, data) => {
            if (e) {
                console.log(e);
                res.writeHead(400)
                res.end('An error occured')
            }
            var parsedBody = Buffer.concat(body).toString();
            var newUser = JSON.parse(parsedBody);
            // console.log(newBook);

            // adding an ID
            var lastUser = database[database.length - 1];
            console.log(lastUser)
            var lastUserId = lastUser.id;
            newUser.id = parseInt(lastUserId) + 1;

            database.push(newUser);

            //saving to db
            fs.writeFile(users, JSON.stringify(database), (err) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end(JSON.stringify({
                        message: 'Internal Server Error. Could not save book to database.'
                    }));
                }

                res.end(JSON.stringify(newUser));
            });
        })

    });
}

var authenticateUser = function (req, res) {
    return new Promise((resolve, reject) => {

        var body = [];

        req.on('data', (chunk) => {
            body.push(chunk);
        });

        req.on('end', async () => {
            var parsedBody = Buffer.concat(body).toString();
            if (!parsedBody) {
                reject('No username or password entered')
            }
            var loginDetails = JSON.parse(parsedBody)

            const users = await getUsers();
            const foundUser = users.find((user) => {
                return user.username === loginDetails.username;
            })
            console.log(foundUser)
            if (!foundUser) {
                reject('User not found...Signup')
            }
            if (foundUser.password !== loginDetails.password) {
                reject('Invalid Username or password')
            }
            resolve();
        });
    })

}




module.exports = {
    getUsers,
    getAllUsers,
    createUser,
    authenticateUser
}