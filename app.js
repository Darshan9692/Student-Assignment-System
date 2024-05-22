const express = require('express');
require('./src/config/connection');
const app = express();
require('dotenv').config();
const PORT = 3000;
const cookie = require('cookie-parser');
const cors = require('cors');
const createUser = require('./src/tables/users.js');
const createAssignment = require('./src/tables/assignments.js');
const createSubmission = require('./src/tables/submissions.js');
const auth = require('./src/services/auth.js');
const bodyParser = require('body-parser');


const authentication = require('./src/routes/authentication')
const assignment = require('./src/routes/assignments.js')
const submission = require('./src/routes/submissions.js')
const filter_sort = require('./src/routes/filter_and_sort.js')

const corsOptions = {
    origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify the allowed headers
    credentials: true, // Enable credentials (cookies, authorization headers, etc)
};

app.use(cors(corsOptions));
app.use(cookie());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());



//all api endpoints
app.use("/api", authentication);
app.use("/api", assignment);
app.use("/api", submission);
app.use("/api", filter_sort);


app.get("/", async (req, res) => {
    res.send("Good Morning!");

});

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
    createUser();
    createAssignment();
    createSubmission();
})

