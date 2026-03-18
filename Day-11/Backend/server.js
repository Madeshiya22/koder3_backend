import express from "express";
import  passport from "passport";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

dotenv.config();

const app = express();

app.use(passport.initialize());

passport.use(
  new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
        const user = {
            id: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
        };
        console.log(user);
        return done(null, user);
    }   
    )
);

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"],session: false }));

app.get("/api/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login", session: false }), (req, res) => {
    const token = jwt.sign({ user: req.user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
}
);


