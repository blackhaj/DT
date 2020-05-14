const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const apiController = require('./controllers/apiController');
const userController = require('./controllers/userController');
const cookieController = require('./controllers/cookieController');
const queryController = require('./controllers/queryController');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// WEBPACK BUILD
app.use("/build", express.static(path.resolve(__dirname, "../build")));

app.get('/verify', userController.authenticate, (req, res) => {
  res.status(200).redirect('/authorize');
});

// separate authorization route to prevent spotify code from being retained in 'home' url
app.get(
  '/authorize',
  userController.authorize,
  cookieController.setCookie,
  (req, res) => res.redirect('/home'),
);

app.get(
  '/home',
  cookieController.checkCookie,
  userController.getUserData,
  (req, res) =>
    res
      .status(200)
      .sendFile(path.resolve(__dirname, '..', 'index.html')),
);

app.get(
  '/api/:city&:country',
  apiController.setQuery,
  apiController.getCountryData,
  apiController.getWeatherData,
  apiController.getSpotifyData,
  (req, res, next) => {
    return next();
  },
  (req, res) => res.status(200).send(res.locals.data),
);

// app.get('/api/user',
//   userController.getUserData,
//   (req, res) => res.status(200).send(res.locals.user));

app.post(
  '/api/toggleFav/:city&:country&:email',
  queryController.addFav,
  queryController.getFavs,
  (req, res) => {
    res.status(200).send(res.locals.user.favsArray);
  },
);

app.get(
  '/api/user',
  userController.getUserData,
  queryController.createOrFindUser,
  queryController.getFavs,
  (req, res) => res.status(200).send(res.locals.user),
);


if (process.env.NODE_ENV === "production") {
  app.use("/build", express.static(path.join(__dirname, "../build")));
  app.get('/*', (req, res) => {
    console.log(__dirname)
    res.sendFile(path.join(__dirname, '../index.html'));
  });
}


// global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { error: 'An error occurred' },
  };
  const errObj = { ...defaultErr, err };
  res.status(errObj.status).send(errObj);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
