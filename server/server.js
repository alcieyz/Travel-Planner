const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(bodyParser.json()); //Parse JSON body
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, '../client/uploads'))); //Serve static files from the uploads directory

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../client/uploads')); //Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`); //Ensure unique filenames
    },
});
const upload = multer({ storage });

//Connect to MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER, //Your MySQL username
    password: process.env.DB_PASSWORD, //Your MySQL password
    database: process.env.DB_NAME, //Your database name
})

//Connect to MySQL server
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL');
});

//Signup route
app.post('/SignUp', (req, res) => {
    const { username, password } = req.body; //Extract inputs from request body

    //SQL query to check if the username already exists
    const checkQuery = 'SELECT * FROM users WHERE username = ?';

    db.query(checkQuery, [username], (err, results) => {
        if (err) {
            return res.status(500).send('Error checking user existence'); //Server error 
        }

        if (results.length > 0) {
            //If username already exists, return an error message
            return res.status(400).send('Username already exists');
        }

        const query = 'INSERT INTO users (username, password) VALUES (?, ?)';

        //Execute the query with the user data
        db.query(query, [username, password], (err) => {
            if (err) {
                return res.status(500).send('Error signing up'); //Database error
            }
            res.status(201).json({ message: 'Sign Up successful', user: {username} });
        });
    });
});

//Login route to authenticate an existing user
app.post('/LogIn', (req, res) => {
    const {username, password} = req.body; //Extract inputs from request body

    //SQL query tp fetch the user based on inputs
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

    //Execute the query with the provided inputs
    db.query(query, [username, password], (err, results) => {
        if (err) {
            return res.status(500).send ('Error logging in'); //Send error if there is problem logging in
        }

        if (results.length > 0) { //If user exists
            const user = results[0]; //Get the first user from the result (assuming single result)

            const responseUser = {
                username: user.username,
                name: user.name || null,
                avatar: user.avatar || '/uploads/default-avatar.png',
            };

            res.json({ message: 'Login successful', user: responseUser }); //Return user data
        } else {
            res.status(401).send('Invalid username or password'); //Return error if no user matches
        }
    });
});

//Delete Account
app.delete('/Dashboard/Settings/:username', (req, res) => {
    const username = req.params.username;

    const getOldAvatarQuery = 'SELECT avatar FROM users WHERE username = ?';

    db.query(getOldAvatarQuery, [username], (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching user data');
        }

        const oldAvatar = results[0]?.avatar;

        if (oldAvatar && oldAvatar !== '/uploads/TP_person_icon.png') {
            const fullOldAvatarPath = path.join(__dirname, '..', 'client', oldAvatar);
            fs.unlink(fullOldAvatarPath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error(`Error deleting old avatar: ${unlinkErr.message}`);
                }
            });
        }
    });

    const query = 'DELETE FROM users WHERE username = ?';

    db.query(query, [username], (err, results) => {
        if (err) {
            return res.status(500).send('Error deleting account');
        }
        if (results.affectedRows ===0) {
            return res.status(404).send('Account not found');
        }
        res.status(200).json({message: 'Account deleted successfully'});
    });
});

//Profile Name route
app.post('/Dashboard/Profile/Name', (req, res) => {
    const {name, username} = req.body; 

    const query = 'UPDATE users SET name = ? WHERE username = ?';

    db.query(query, [name, username], (err, results) => {
        if (err) {
            return res.status(500).send ('Error updating name');
        }
        
        if (results.affectedRows === 0) {
            return res.status(404).send('Name not updated');
        }
        res.status(200).json({message: 'Name updated successfully!', user: {name}});
    });
});

//Profile Avatar route
app.post('/Dashboard/Profile/Avatar', upload.single('avatar'), (req, res) => {
    const {username} = req.body;

    const avatarPath = `/uploads/${req.file.filename}`;

    const getOldAvatarQuery = 'SELECT avatar FROM users WHERE username = ?';

    db.query(getOldAvatarQuery, [username], (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching user data');
        }

        const oldAvatar = results[0]?.avatar;

        if (oldAvatar && oldAvatar !== '/uploads/TP_person_icon.png') {
            const fullOldAvatarPath = path.join(__dirname, '..', 'client', oldAvatar);
            fs.unlink(fullOldAvatarPath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error(`Error deleting old avatar: ${unlinkErr.message}`);
                }
            });
        }

        const updateAvatarQuery = 'UPDATE users SET avatar = ? WHERE username = ?';

        db.query(updateAvatarQuery, [avatarPath, username], (updateErr, updateResults) => {
            if (updateErr) {
                return res.status(500).send('Error updating avatar');
            }

            if (updateResults.affectedRows === 0) {
                return res.status(404).send('Avatar not updated');
            }
            res.status(200).json({message: 'Avatar updated successfully!', user: {avatarPath} });
        });
    });
});

//Get all notes for a specific user
app.get('/MyNotes', (req, res) => {
    const {username} = req.query;
    const query = `SELECT id, title, content, category FROM notes WHERE username = ? ORDER BY category ASC, id ASC`;

    db.query(query, [username], (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching notes');
        }
        const groupedNotes = results.reduce((acc, note) => {
            if (!acc[note.category]) {
                acc[note.category] = [];
            }
            acc[note.category].push(note);
            return acc;
        }, {});
        res.json(groupedNotes);
    });
});

//Add a new note
app.post('/MyNotes', (req, res) => {
    const {title, content, username, category = 'Uncategorized'} = req.body;

    const query = `INSERT INTO notes (title, content, username, category) VALUES (?, ?, ?, ?)`;

    db.query(query, [title, content, username, category], (err, results) => {
        if (err) {
            return res.status(500).send('Error adding note');
        }

        res.status(201).json({id: results.insertId});
    });
});

//Update existing note
app.put('/MyNotes', (req, res) => {
    const {id, title, content, username, category} = req.body;

    const query = 'UPDATE notes SET title = ?, content = ?, category = ? WHERE id = ? AND username = ?';

    db.query(query, [title, content, category, id, username], (err, results) => {
        if (err) {
            return res.status(500).send('Error updating note');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Note not found');
        }
        res.status(200).json({message: 'Note updated successfully!'});
    });
});

//Delete a note
app.delete('/MyNotes/:id', (req, res) => {
    const noteId = req.params.id; //or const {id} = req.params;, and change wuery to [id]

    const query = 'DELETE FROM notes WHERE id = ?';

    db.query(query, [noteId], (err, results) => {
        if (err) {
            return res.status(500).send('Error deleting note');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Note not found');
        }
        res.status(200).json({message: 'Note deleted successfully'});
    });
});

//Start the server on port 5000
app.listen(5000, () => {
    console.log('Server running at http://localhost:5000'); //Log success message when server is up
});