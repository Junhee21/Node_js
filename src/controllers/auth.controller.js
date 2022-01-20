const db = require("../../models");
const jwtHelper = require("../lib/jwtHelper");
const User = db.User

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signUp = async (req, res) => {
    const idUsedCheck = await User.findOne({where: {id: req.body.userId}})
    if (idUsedCheck) {
        return (res.json({success:false, message: "Aleady used id"}));
    }

    await User.create({
        id: req.body.userId,
        password: bcrypt.hashSync(req.body.password, 8)
    })
    .then(user => {
        const token = jwt.sign({id: user.id}, config.secret, {
            expiresIn: 86400 // 24hours
        });
        return (res.json({
            success: true,
            message: "complete Sign Up",
            user: user,
            accessToken: token,
        }));
    })
    .catch(err => {
        return (res.json({error: err}));
    })
}

exports.signIn = async (req, res) => {
    await User.findOne({where: {id: req.query.userId}})
    .then(user => {
        if (!user) {
            return (res.json({success: false, message: "User not found"}));
        }

        const pwIsValid = bcrypt.compareSync(
            req.query.password,
            user.password
        )
            
        if (!pwIsValid) {
            return (res.json({success: false, message: "Wrong password"}));
        }

        const token = jwt.sign({ id: user.id}, config.secret, {
            expiresIn: 86400 // 24hours
        })
        return (res.json({
            success: true,
            accessToken: token
        }))
    })
    .catch(err => {
        return (res.json({error: err}));
    })
}

exports.getUserId = async(req, res) => {
    await jwtHelper.decodeHelper(req.query.accessToken)
    .then (user => {
        return (res.json({user: user}));

    })
}