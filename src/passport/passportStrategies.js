import passport from "passport";
import config from "../config.js";
import { usersModels } from '../persistences/MongoDB/models/users.models.js'
import { Strategy as LocalStrategy } from "passport-local";
import { cryptedPassword,comparePasswords } from "../utilities.js";
import { Strategy as GithubStrategy } from "passport-github2";
import { addCartService } from "../services/carts.services.js"
import UsersDTO from "../persistences/DTOs/users.dto.js";

passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},async(req,email,password,done)=>{
    const user = await usersModels.findOne({email})
    if (user) {
        return done(null,false)
    } else {
        const userClean = new UsersDTO(req.body)
        const addedCart = await addCartService()
        const newPassword = await cryptedPassword(password)
        const cryptedUser = {...userClean,password:newPassword,userCart:addedCart._id}
        const newUser = await usersModels.create(cryptedUser)
        done(null,newUser)
    }
}))

passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback:true
},async(req,email,password,done)=>{
    try {
        if (email === config.ADMINMAIL && password === config.ADMINPASSWORD) {
            console.log('llega');
            const userAdmin = {
                _id:'admin_id',
                first_name: "Admin",
                last_name: "CoderHouse",
                email: email,
                rol: "Admin",
                userCart: '64385f342ae1be1ab440d62b'
            }
            return done(null, userAdmin)
        } else {
            console.log('no llega',config.ADMINMAIL,config.ADMINPASSWORD);
            const user = await usersModels.findOne({email:email})
            if (user) {
                const realPassword = await comparePasswords(password,user.password)
                if (realPassword) {
                    console.log(user);
                    return done(null,user)
                } else{
                    return done(null,false)
                }
            } else{
                return done(null,false)
                }
        }
    } catch (error) {
        console.log(error);
    }
}))

passport.use('github',new GithubStrategy({
    clientID: 'Iv1.e71eacd9d90eaee2',
    clientSecret: '9cb7305941acbe07da82f8e06f3f3539c50c747e',
    callbackURL: 'http://localhost:3030/api/users/github'
},async( accessToken, refreshToken, profile, done)=>{
    const user = await usersModels.findOne({email:profile._json.email})
    const addedCart = await addCartService()
    if(!user){
        const userData = {
            first_name:profile._json.name.split(" ")[0],
            last_name:profile._json.name.split(" ")[1] || " ",
            email:profile._json.email,
            password:" ",
            userCart: addedCart._id     
        }
 
        const newUser = await usersModels.create(userData);
        done(null,newUser)
    }else{
        done(null,user)
    }
    
}))

passport.serializeUser(function(user, done){
    done(null,user._id)
})

passport.deserializeUser(async function(id, done){
    const user = await usersModels.findById(id)
    done(null,user)
})
 
//Owned by: @LucasPanizzo

// App ID: 308231

// Client ID: Iv1.e71eacd9d90eaee2

// Secret: 9cb7305941acbe07da82f8e06f3f3539c50c747e