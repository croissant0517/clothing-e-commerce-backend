const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET

const requireAuthLevelOne = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        console.log("No Auth in headers!");
        return res.status(401).send("Unauthorized");
    } else if (authorization) {
        const adminPermissionLevel = checkAdminPermissionLevel(authorization);
        if (adminPermissionLevel  === 1) {
            console.log("Auth Pass!!");
            return next();
        } else if (adminPermissionLevel > 1) {
            console.log("No Permission!!");
            return res.status(400).send("No Permission!");
        }
    }
}

const requireAuthLevelTwo = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        console.log("No Auth in headers!");
        return res.status(401).send("Unauthorized");
    } else if (authorization) {
        const adminPermissionLevel = checkAdminPermissionLevel(authorization);
        if (adminPermissionLevel  >= 1) {
            console.log("Auth Pass!!");
            return next();
        } else if (!adminPermissionLevel) {
            console.log("No Permission!!");
            return res.status(400).send("No Permission!");
        }
    }
}

const checkAdminPermissionLevel = (authorization) => {
    let decode;
    try {
        decode = jwt.verify(authorization, SECRET);
        console.log("permission level", decode.permission);
        return decode.permission
    } catch(error) {
        console.log("Decode Auth Fail!!!!");
        console.log(error);
    }
}

module.exports = {
    requireAuthLevelTwo: requireAuthLevelTwo,
    requireAuthLevelOne: requireAuthLevelOne,
}