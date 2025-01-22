var http = require('http');
var dt = require('./myfirstmodule');
var url = require('url');
var fs = require('fs');
var uc = require('upper-case');
var events = require('events');
var formidable = require('formidable');
var nodemailer = require('nodemailer');

//Random stuff
http.createServer(function (req, res)
{
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("The date and time are currently: " + dt.myDateTime());

    res.write('ehehehee ^w^');

    //res.write(req.url);
    res.write(uc.upperCase("hi im not yelling at you"));

    var q1 = url.parse(req.url, true).query;
    var txt = q1.size + " " + q1.color + " " + q1.cat;
    //http://localhost:8080/?size=biiig&color=pink&cat=cat
    res.write(" " + txt);

    res.end();
}).listen(8080);

//URL stuff
http.createServer(function (req, res) {
    var q2 = url.parse(req.url, true);
    var filename = "." + q2.pathname;
    fs.readFile(filename, function(err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
        }
        //http://localhost:8081/cats.html
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
}).listen(8081);

/*
var adr = 'http://localhost:8080/default.htm?year=2017&month=february';
var q = url.parse(adr, true);

console.log(q.host); //returns 'localhost:8080'
console.log(q.pathname); //returns 'default.htm'
console.log(q.search); //returns '?year=2017&month=february'

var qdata = q.query; //returns an object: { year: 2017, month: 'february' }
console.log(qdata.month); //returns 'february'
*/

//File stuff
http.createServer(function (req, res)
{
    fs.readFile('demofile1.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
}).listen(8082);

/*
//appends specified content to a file, if the file does not exist, the file will be created
fs.appendFile('mynewfile1.txt', 'Hello content!', function (err) {
    if (err) throw err;
    console.log('Saved!');
});

//takes a "flag" as the second argument, if the flag is "w" for "writing", the specified file is opened for writing. If the file does not exist, an empty file is created
fs.open('mynewfile2.txt', 'w', function (err, file) {
    if (err) throw err;
    console.log('Saved!');
});

//replaces the specified file and content if it exists. If the file does not exist, a new file, containing the specified content, will be created
fs.writeFile('mynewfile3.txt', 'Hello content!', function (err) {
    if (err) throw err;
    console.log('Saved!');
});

//deletes the specified file
fs.unlink('mynewfile1.txt', function (err) {
    if (err) throw err;
    console.log('File deleted!');
});

//rename arg1 to arg2
fs.rename('mynewfile1.txt', 'myrenamedfile.txt', function (err) {
    if (err) throw err;
    console.log('File Renamed!');
});
*/

//Events stuff
/*
var rs = fs.createReadStream('./demofile.txt');
rs.on('open', function () {
    console.log('The file is open');
});
*/
/*
var eventEmitter = new events.EventEmitter();

//Create an event handler:
var myEventHandler = function () {
    console.log('I hear a scream!');
}
//Assign the event handler to an event:
eventEmitter.on('scream', myEventHandler);
//Fire the 'scream' event:
eventEmitter.emit('scream');
*/

//Upload Files
http.createServer(function (req, res) {
    if (req.url == '/fileupload') 
    {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.error('Error parsing the form:', err);
                res.write('Error parsing the form.');
                res.end();
                return;
            }

            console.log('Files', files);

            var uploadedFile = files.filetoupload[0];
            if (!uploadedFile) {
                res.write('No file uploaded.');
                res.end();
                return;
            }

            var oldpath = uploadedFile.filepath;
            var newpath = 'C:\\Users\\eliss\\OneDrive\\Documents\\Website\\client\\src\\assets\\' + uploadedFile.originalFilename;
            fs.rename(oldpath, newpath, function (err) {
                if (err) {
                  console.error('Error moving file:', err);
                  res.write('Error moving the file.');
                  res.end();
                  return;
                }
                res.write('File uploaded and moved!');
                res.end();
              });
        });
    }
    else
    {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="filetoupload"><br>');
        res.write('<input type="submit">');
        res.write('</form>');
        return res.end();
    }
}).listen(8083);


//Email stuff
/*
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'alluka.zoldyckmkz@gmail.com',
        pass: 'yourpassword'
    }
});

var mailOptions = {
    from: 'alluka.zoldyckmkz@gmail.com',
    to: 'email1@yahoo.com, email2@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
    or
    html: '<h1>Welcome</h1><p>That was easy!</p>'
};

transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    }
    else{
        console.log('Email sent: ' + info.response);
    }
});
*/