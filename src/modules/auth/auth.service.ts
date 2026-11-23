import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";


const loginUserIntoDB = async (payload : {email : string; password: string}) => {

    const { email,  password} = payload

    const user = await pool.query(`

        SELECT * FROM users WHERE email=$1

        `,[email]);
        // console.log(user.rows[0]);
if (user.rowCount === 0) {
    throw new Error("invalid credentials")
}

const matchPassword = await bcrypt.compare(password, user.rows[0].password)
if (!matchPassword) {
    throw new Error("invalid credentials")
}
console.log(user.rows[0].is_active);

if (!user.rows[0].is_active) {
    throw new Error("user is blocked")
}
const jwtPayload = {
id : user.rows[0].id,
name : user.rows[0].name,
email : user.rows[0].email,
role : user.rows[0].role
}

const accessToken = jwt.sign(jwtPayload, config.jwt_secret, {
    expiresIn: "1h",
})
const refreshToken = jwt.sign(jwtPayload, config.refresh_secret, {
    expiresIn: "10d",
})

return {accessToken, refreshToken, user : user.rows[0]};

}

const genaretAccessToken = async(token: string) => {
if (!token) {
    throw new Error("unauthorized access")
}
const decode = jwt.verify(token  as string, config.refresh_secret) as JwtPayload
console.log(decode);
const user = await pool.query(`

    SELECT * FROM users WHERE email=$1`,[decode.email])

console.log(user.rows[0]);
if (user.rowCount === 0) {
   throw new Error("user not found")
}
if (!user.rows[0].is_active) {
     throw new Error("forbidden")
}

const jwtPayload = {
id : user.rows[0].id,
name : user.rows[0].name,
email : user.rows[0].email,
role : user.rows[0].role
}

const accessToken = jwt.sign(jwtPayload, config.jwt_secret, {
    expiresIn: "1h",
})
return {accessToken};
}

export const authService = {
    loginUserIntoDB, genaretAccessToken
}
