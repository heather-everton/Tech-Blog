const path = require('path');
const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const exphbs = require('express-handlebars'); //require npm package for express handlebars
const app = express();
const session = require('express-session');

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
  secret: 'Super secret secret',
  cookie: {maxAge: 6000},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
    // checkExpirationInterval: 1 * 30 * 1000,
    // expiration: 1 * 30 * 1000
  })
};

app.use(session(sess));
const helpers = require('./utils/helpers');
const hbs = exphbs.create({ helpers });
//set template engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});