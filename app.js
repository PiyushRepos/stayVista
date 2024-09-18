if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const path = require("path");
const connectToDB = require("./connectDB.js");
const PORT = 8080;
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listingRoute = require("./routes/listings.routes.js");
const reviewRoute = require("./routes/reviews.routes.js");
const userRoute = require("./routes/users.routes.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./model/user.model.js");

// Middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const store = MongoStore.create({
  mongoUrl: process.env.ATLASDB_URL,
  crypto: {
    secret: "mysupersecret",
    touchAfter: 24 * 3600,
  },
});
store.on("error", (err) => {
  console.log("Error in mongo session store", err);
});

const sessionOptions = {
  store,
  secret: "mysupersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Database connection
connectToDB(process.env.ATLASDB_URL)
  .then(() => {
    console.log("mongoDB connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.use("/listings", listingRoute);
app.use("/listings/:id/review", reviewRoute);
app.use("/", userRoute);

app.all("*", (req, res, next) => {
  res.render("404.ejs", { who: "404" });
});

// Error Handling
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "<h1>Something Went Wrong!</h1>" } = err;
  // const { path } = req;
  // console.log(req)
  // req.flash("error", message);
  res.status(statusCode).render('error.ejs', message);
});

app.listen(PORT, () => {
  console.log(`Server Listening on http://localhost:${PORT}`);
});
