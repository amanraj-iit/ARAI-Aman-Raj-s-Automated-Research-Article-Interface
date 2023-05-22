require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const Pages = require('./routes');
const cookieParser = require('cookie-parser');
const schedule = require('node-schedule');
const { movieMailer } = require('./controllers/helpers/movieMailer');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.set('view engine', 'ejs');
app.use(express.static('public'));


app.use('/', Pages);

app.use( (req, res) => {
    res.redirect('/')
} )

schedule.scheduleJob('0 9 * * *', movieMailer);

const PORT = process.env.PORT || 8080
mongoose.connect(process.env.DB_URL, { 
    useNewUrlParser: true,
    useUnifiedTopology: true, 
    useFindAndModify: false, 
    useCreateIndex: true
})
    .then(result => app.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`)))
    .catch(err => console.log(err.message))
