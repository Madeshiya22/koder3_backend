import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js"; 
import postRouter from "./routes/post.routes.js";
import userRouter from "./routes/user.routes.js";
import profileRouter from "./routes/profile.routes.js";
import socialRouter from "./routes/social.routes.js";
import {config} from "./config/config.js";  
import chatRouter from "./routes/chat.routes.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import cors from "cors";



const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true})); // needed to read form-data from any req
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true,
}));
app.use(passport.initialize());


app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);
app.use("/api/profiles", profileRouter);
app.use("/api/chats", chatRouter);
app.use("/api", socialRouter);

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