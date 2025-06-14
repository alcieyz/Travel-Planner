const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Groq = require('groq-sdk');
require('dotenv').config();

const app = express();
app.use(bodyParser.json()); //Parse JSON body
app.use(cors());
app.use(express.json());
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

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
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
app.delete('/Settings/:username', (req, res) => {
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

//Get all trips for a specific user
app.get('/MyTrips', (req, res) => {
    const {username} = req.query;
    const query = `SELECT id, name, description, DATE_FORMAT(start, '%Y-%m-%d') as start, DATE_FORMAT(end, '%Y-%m-%d') as end FROM trips WHERE username = ?`;

    db.query(query, [username], (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching trips');
        }
        res.json(results);
    });
});

//Add a new trip
app.post('/MyTrips', (req, res) => {
    const {name, description, start, end, username} = req.body;

    const query = `INSERT INTO trips (name, description, start, end, username) VALUES (?, ?, ?, ?, ?)`;

    db.query(query, [name, description, start, end, username], (err, results) => {
        if (err) {
            return res.status(500).send('Error adding trip');
        }

        res.status(201).json({id: results.insertId});
    });
});

//Update existing trip
app.put('/MyTrips', (req, res) => {
    const {id, name, description, start, end, username} = req.body;

    const query = 'UPDATE trips SET name = ?, description = ?, start = ?, end = ? WHERE id = ? AND username = ?';

    db.query(query, [name, description, start, end, id, username], (err, results) => {
        if (err) {
            return res.status(500).send('Error updating trip');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Trip not found');
        }
        res.status(200).json({message: 'Trip updated successfully!'});
    });
});

//Delete a trip
app.delete('/MyTrips/:id', (req, res) => {
    const tripId = req.params.id; //or const {id} = req.params;, and change query to [id]

    const query = 'DELETE FROM trips WHERE id = ?';

    db.query(query, [tripId], (err, results) => {
        if (err) {
            return res.status(500).send('Error deleting trip');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Trip not found');
        }
        res.status(200).json({message: 'Trip deleted successfully'});
    });
});

//Profile Name route
app.post('/Profile/Name', (req, res) => {
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
app.post('/Profile/Avatar', upload.single('avatar'), (req, res) => {
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

//Get all events for a specific user
app.get('/MySchedule', (req, res) => {
    const {username, tripId} = req.query;
    const query = 'SELECT * FROM calendar_events WHERE username = ? AND trip_id = ?';

    db.query(query, [username, tripId], (err, results) => {
        if (err) {
            console.error('Error fetching events:', err);
            return res.status(500).json({ error: 'Failed to fetch events', details: err.message});
        }
        const formattedResults = results.map(event => ({
            ...event,
            start: event.start,
            end: event.end
        }));
        res.json(formattedResults);
    });
});

//Add a new event
app.post('/MySchedule', (req, res) => {
    const {username, title, description, start, end, color, tripId} = req.body;
    const query = `INSERT INTO calendar_events (username, title, description, start, end, color, trip_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
        /* ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        description = VALUES(description),
        start = VALUES(start),
        end = VALUES(end),
        color = VALUES(color)
    `; */

    db.query(query, [username, title, description, start, end, color, tripId], (err, results) => {
        if (err) {
            console.error('Error saving event:', err);
            return res.status(500).json({error: 'Failed to save event', details: err.message});
        }
        res.json({id: results.insertId, username, title, description, start, end, color, tripId});
    });
});

//Update calendar_events;
app.put('/MySchedule/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, start, end, color } = req.body;
    const query = `
        UPDATE calendar_events
        SET title = ?, description = ?, start = ?, end = ?, color = ?
        WHERE id = ?
    `;
    db.query(query, [title, description, start, end, color, id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id, title, description, start, end, color});
    });
});

app.delete('/MySchedule/:id', (req, res) => {
    const {id} = req.params;
    const query = 'DELETE FROM calendar_events WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({error: err.message});
        res.json({message: 'Event deleted successfully', id:id});
    });
});

app.get('/MyMap', (req, res) => {
    const {username, tripId} = req.query;
    const query = `SELECT id, lat, lng, name FROM map_markers WHERE username = ? AND trip_id = ?`;

    db.query(query, [username, tripId], (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching markers');
        }

        res.json(results);
    });
});

app.post('/MyMap', (req, res) => {
    const {username, lat, lng, name, trip_id} = req.body;
    const query = 'INSERT INTO map_markers (username, lat, lng, name, trip_id) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [username, lat, lng, name, trip_id], (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({error: 'You already have a marker at this location'});
            }
            console.error('Database error:', err);
            return res.status(500).json({error: 'Failed to save marker'});
        }
        res.json({message: 'Marker saved successfully'});
    });
});

app.delete('/MyMap/:id', (req, res) => {
    const {id} = req.params;
    const {username} = req.body;
    const query = 'DELETE FROM map_markers WHERE id = ?';
    db.query(query, [id, username], (err, results) => {
        if (err) {
            return res.status(500).send('Error deleting marker');
        }
        res.send('Marker deleted successfully');
    });
});

//Get all budget entries for a specific user
app.get('/MyBudget', (req, res) => {
    const {username, tripId} = req.query;
    const query = `SELECT id, title, amount, description, category FROM budget_entries WHERE username = ? AND trip_id = ? ORDER BY category ASC, id ASC`;

    db.query(query, [username, tripId], (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching budget entries');
        }
        const groupedEntries = results.reduce((acc, entry) => {
            if (!acc[entry.category]) {
                acc[entry.category] = [];
            }
            acc[entry.category].push(entry);
            return acc;
        }, {});
        res.json(groupedEntries);
    });
});

//Get all budget entry categories for a specific user
app.get('/MyBudget/GetUserCategories', (req, res) => {
    const {username, tripId} = req.query;
    const query = `SELECT DISTINCT category FROM budget_entries WHERE username = ? AND trip_id = ? AND category != 'Uncategorized' AND category != 'Attractions' AND category != 'Food' AND category != 'Stay' AND category != 'Other'`;

    db.query(query, [username, tripId], (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching notes');
        }
        const categories = results.map((row) => row.category);
        res.json(categories);
    });
});

//Add a new budget entry
app.post('/MyBudget', (req, res) => {
    const {title, amount, description, username, category = 'Uncategorized', tripId} = req.body;

    const query = `INSERT INTO budget_entries (title, amount, description, username, category, trip_id) VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(query, [title, amount, description, username, category, tripId], (err, results) => {
        if (err) {
            return res.status(500).send('Error adding entry');
        }

        res.status(201).json({id: results.insertId});
    });
});

//Update existing budget entry
app.put('/MyBudget', (req, res) => {
    const {id, title, amount, description, username, category} = req.body;

    const query = 'UPDATE budget_entries SET title = ?, amount = ?, description = ?, category = ? WHERE id = ? AND username = ?';

    db.query(query, [title, amount, description, category, id, username], (err, results) => {
        if (err) {
            return res.status(500).send('Error updating entry');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Entry not found');
        }
        res.status(200).json({message: 'Entry updated successfully!'});
    });
});

//Delete a budget entry
app.delete('/MyBudget/:id', (req, res) => {
    const entryId = req.params.id; //or const {id} = req.params;, and change wuery to [id]

    const query = 'DELETE FROM budget_entries WHERE id = ?';

    db.query(query, [entryId], (err, results) => {
        if (err) {
            return res.status(500).send('Error deleting entry');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Entry not found');
        }
        res.status(200).json({message: 'Entry deleted successfully'});
    });
});

app.post('/MyBudget/Budget', (req, res) => {
    const {budget, tripId} = req.body;

    const query = 'UPDATE trips SET budget = ? WHERE id = ?';

    db.query(query, [budget, tripId], (err, results) => {
        if (err) {
            return res.status(500).send('Error updating total budget');
        }

        if (results.affectedRows == 0) {
            return res.status(404).send('Total budget not updated');
        }
        res.status(200).json({message: 'Total budget updated successfully!', user: {budget}});
    });
});

app.get('/MyBudget/GetUserBudget', (req, res) => {
    const {tripId} = req.query;
    const query = 'SELECT budget FROM trips WHERE id = ?';

    db.query(query, [tripId], (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching total budget');
        }
        const budget = results[0].budget;
        res.json({budget});
    });
});

//Get all notes for a specific user
app.get('/MyNotes', (req, res) => {
    const {username, tripId} = req.query;
    const query = `SELECT id, title, content, category FROM notes WHERE username = ? AND trip_id = ? ORDER BY category ASC, id ASC`;

    db.query(query, [username, tripId], (err, results) => {
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

//Get all note categories for a specific user
app.get('/MyNotes/GetUserCategories', (req, res) => {
    const {username, tripId} = req.query;
    const query = `SELECT DISTINCT category FROM notes WHERE username = ? AND trip_id = ? AND category != 'Uncategorized' AND category != 'Attractions' AND category != 'Food' AND category != 'Stay' AND category != 'Other'`;

    db.query(query, [username, tripId], (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching notes');
        }
        const categories = results.map((row) => row.category);
        res.json(categories);
    });
});

//Add a new note
app.post('/MyNotes', (req, res) => {
    const {title, content, username, category = 'Uncategorized', tripId} = req.body;

    const query = `INSERT INTO notes (title, content, username, category, trip_id) VALUES (?, ?, ?, ?, ?)`;

    db.query(query, [title, content, username, category, tripId], (err, results) => {
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
    const noteId = req.params.id; //or const {id} = req.params;, and change query to [id]

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

app.post('/api/travel-suggestions', async (req, res) => {
    const {destination, type, number, details} = req.body;

    if (!destination) {
        return res.status(400).json({ error: 'Please provide a destination.'});
    }

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: `Generate top ${number} ${type} suggestions for traveling to ${destination}. ${details}` ,
                },
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 1,
            max_completion_tokens: 1000,
            top_p: 1,
            stream: false, // Disable streaming for simplicity
            stop: null,
        });

        let suggestions = chatCompletion.choices[0]?.message?.content;

        if (chatCompletion.choices[0]?.finish_reason === 'length') {
            suggestions = 'Oh no! You gave Lily too much to do. Please reduce the desired number of results or the details of your request.'
        }

        res.json({ suggestions });
    } catch (error) {
        console.error('Error fetching travel suggestions:', error);
        res.status(500).json({ error: 'Failed to fetch travel suggestions.' });
    }
});

//Start the server on port 5000
app.listen(5000, () => {
    console.log('Server running at http://localhost:5000'); //Log success message when server is up
});