import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js"; 
import config from "./config/config.js";  
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import cors from "cors";



const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true,
}));


app.use("/api/auth", authRouter);

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

export default app; 