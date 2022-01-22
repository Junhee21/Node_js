const db = require("../../models");
const jwtHelper = require("../lib/jwtHelper");
const User = db.User
const Form = db.Form
const FormQuestion = db.FormQuestion
const FormQuestionOption = db.FormQuestionOption
const FormQuestionResult = db.FormQuestionResult

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
        const token = jwt.sign({id: user.id}, secret, {
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

        const token = jwt.sign({ id: user.id}, secret, {
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

exports.deleteUser = async(req, res) => {
    const decoded = await jwtHelper.decodeHelper(req.body.accessToken);
    const userId = decoded.userId;
    await User.destroy({where: {id: userId}});

    const forms = await Form.findAll({
        where: {UserId: userId},
        include: [{
            model: FormQuestion,
            include: [{
                model: FormQuestionOption
            }, {
                model: FormQuestionResult
            }]
        }]

    })
    await forms.map(form => {
        Form.destroy({where: {id: form.id}});
        form.FormQuestions.map(question => {
            FormQuestion.destroy({where: {id: question.id}});
            question.FormQuestionOptions.map(option => {
                FormQuestionOption.destroy({where: {id: option.id}});
            });
            question.FormQuestionResults.map(result => {
                FormQuestionResult.destroy({where: {id: result.id}});
            })
        })
    })
    return (res.json({message: "success"}));
}

// exports.test = async(req, res) => {
//     const user = await User.findAll();
//     const form = await Form.findAll();
//     const formQuestion = await FormQuestion.findAll();
//     const formQuestionOption = await FormQuestionOption.findAll();
//     const formQuestionResult = await FormQuestionResult.findAll();
//     return res.json({
//         User: user,
//         Form: form,
//         FormQuestion: formQuestion,
//         FormQuestionOption: formQuestionOption,
//         FormQuestionResult: formQuestionResult
//     })
// }