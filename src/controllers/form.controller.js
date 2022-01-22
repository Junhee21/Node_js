const db = require("../../models");
const jwtHelper = require("../lib/jwtHelper");
const Form = db.Form
const FormQuestion = db.FormQuestion
const FormQuestionOption = db.FormQuestionOption
const FormQuestionResult = db.FormQuestionResult

exports.create = async (req, res) => {
    await jwtHelper.decodeHelper(req.body.accessToken)
    .then (user => {
        const userId = user.userId;
        Form.create({
            UserId: userId,
            id: req.body.uuid,
            title: req.body.title,
            info: req.body.info,
        })
        req.body.questions.map((obj) => {
            FormQuestion.create({
                FormId: req.body.uuid,  
                id: obj.uuid,
                title: obj.title,
                questionType: obj.questionType,
            })
            obj.options.map((objObj) => {
                FormQuestionOption.create({
                    FormQuestionId: obj.uuid,
                    id: objObj.uuid,
                    option: objObj.option,
                })
            })
        })
        return(res.json({message: "success"}));
    })
}

exports.getMyList = async (req, res) => {
    const decoded = await jwtHelper.decodeHelper(req.query.accessToken);
    const userId = decoded.userId;
    const forms = await Form.findAll({
        where: {UserId: userId},
        include: [{
            model: FormQuestion,
            include: FormQuestionOption
        }]

    })
    return (res.json({forms: forms }));
}

exports.getResult = async (req, res) => {
    const form = await Form.findOne({
        where: { id: req.query.formId },
        include: [{
            model: FormQuestion,
            include: [{
                model: FormQuestionOption
            }, {
                model: FormQuestionResult
            }]
        }]
    })
    return res.json({ form: form });
}

exports.getAll = async (req, res) => {
    const forms = await Form.findAll({
        include: [{
            model: FormQuestion,
            include: FormQuestionOption
        }]
    })
    return res.json({ forms: forms });
}

exports.submit = async (req, res) => {
    await req.body.map((obj) => {
        if (obj.questionId != 0) {
            FormQuestionResult.create({
                FormQuestionId: obj.questionId,
                id: obj.resultId,
                content: obj.result
            })
        }
    })
}

exports.deleteForm = async(req, res) => {
    const forms = await Form.findAll({
        where: {id: req.body.formId},
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