const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET

const handleSignin = (req, res, knex) => {
    const {  username, password } = req.body;
    return new Promise((resolve, reject) => {
        knex.select("name", "hash").from("login")
        .where({
            name: username
        })
        .then(data => {
            const isVaild = bcrypt.compareSync(password, data[0].hash);
            console.log("Password is currect?", isVaild);
            if (isVaild) {
                knex.select("*").from("admins")
                    .where({
                        name: username
                    })
                    .then(admin => resolve(admin[0]))
                    .catch(error => reject("unable to signin"))
            } else {
                reject("wrong password")
            }
        })
        .catch(error => reject("not vaild name"))
    })
}

const getAdminByToken = (req, res, knex) => {
    const { authorization } = req.headers;
    let decode;
    try {
        decode = jwt.verify(authorization, SECRET);
    } catch(error) {
        console.log("Fail!!!!");
        console.log(error);
    }
    knex.select("*").from("admins")
    .where({
        name: decode.name
    })
    .then(admin => res.send(admin[0]))
    .catch(err => console.log("unable to signin"))
}

const createSessions = (userData) => {
    // JWT Token
    const { name, permission } = userData;
    const token = signToken(name, permission)
    return { success: "true", user: userData, token: token }
}

const signToken = (name, permission) => {
    const payload = { name, permission };
    return jwt.sign(payload, SECRET, { expiresIn: "1 days"});
}

const signinAuthentication = (req, res, knex, bcrypt) => {
    const { authorization } = req.headers;
    return authorization ? getAdminByToken(req, res, knex) 
    : 
    handleSignin(req, res, knex, bcrypt)
        .then((data) => {
            return data.id && data.name ? createSessions(data) : console.log(data)
        })
        .then((session) => res.send(session))
        .catch((error) => {
            console.log(error);
            res.status(400).send(error)
        })
}

module.exports = {
    signinAuthentication: signinAuthentication,
}