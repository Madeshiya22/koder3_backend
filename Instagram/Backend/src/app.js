import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import postRouter from "./routes/post.auth.routes.js";
import cookieparser from "cookie-parser";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "./config/config.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieparser());
app.use(morgan("dev"));

app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
    callbackURL: config.CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
        console.log(profile);

        return done(null, profile);
    }
));

app.get('/', (req, res) => {
    res.send('Welcome to the Instagram API');
});

//routes
app.use("/auth", authRouter);
app.use("/posts", postRouter);

export default app;
