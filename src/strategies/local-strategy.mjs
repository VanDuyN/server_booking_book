import passport, { use } from 'passport';
import { Strategy  } from 'passport-local';
import {User} from '../mongoose/user.mjs'; // Adjust the path as necessary

passport.use(
    new Strategy((username, password, done) => {
        
    })
) 
passport.deserializeUser(async (id, done) => {
    const findUser =await User.findById(id);
    if (!findUser) {
        return done(new Error('User not found'));
    }
    return done(null, findUser);
});
export default passport.use(
    new Strategy((username, password, done) => {
        const findUser = User.findOne({ username });
        if (!findUser) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        if (findUser.password !== password) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, findUser);
            
    })
);
    