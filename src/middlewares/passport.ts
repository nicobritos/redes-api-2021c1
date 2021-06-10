import passport = require('passport');
import {Strategy} from 'passport-local';
import {Unauthorized} from '../exceptions/Unauthorized';
import {JwtToken} from '@models/JwtToken';
import {UserService} from '../interfaces/services/UserService';
import container from '../inversify.config';
import TYPES from '../types';

const JwtCookieComboStrategy = require('passport-jwt-cookiecombo');

passport.use(new Strategy(
    {
        passwordField: 'password',
        session: false,
        usernameField: 'email',
    },
    function (email, password, cb) {
        let userService: UserService = container.get(TYPES.Services.UserService);
        return userService.authenticate(email, password)
            .then(authenticatedUser => {
                if (!authenticatedUser) {
                    return cb(new Unauthorized(), null, {message: 'Incorrect email or password.'});
                }

                return cb(null, authenticatedUser, {message: 'Logged in successfully'});
            })
            .catch(err => cb(err));
    }
));

passport.use(new JwtCookieComboStrategy(
    {
        secretOrPublicKey: 'your_jwt_secret'
    },
    function (jwtPayload: JwtToken, cb) {
        if (jwtPayload.sub) {
            return cb(null, jwtPayload.payload.user);
        } else {
            return cb(new Error('No sub in jwt'));
        }
    }
));
