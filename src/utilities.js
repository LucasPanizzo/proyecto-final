import {dirname} from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcrypt'
import  jwt  from 'jsonwebtoken'


export const __dirname = dirname(fileURLToPath(import.meta.url))

export const cryptedPassword = async(password)=>{
    return bcrypt.hash(password,10)
}

export const comparePasswords = async(password,passwordBD)=>{
    return bcrypt.compare(password,passwordBD)
}

export const generateToken = (user) =>{
    const token = jwt.sign({user},"secretJWT",{expiresIn:"1h"});
    return token
};