const db = require("../models");
const Form = db.Form
const FormQuestion = db.FormQuestion
const FormQuestionOption = db.FormQuestionOption
const FormQuestionResult = db.FormQuestionResult

exports.create = async (req, res) => {
    await Form.create({
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

exports.getAll = async (req, res) => {
    console.log("hi")
    const Forms = await Form.findAll({
        include: [{
            model: FormQuestion,
            include: FormQuestionOption
        }]
    })
    return res.json({ Forms: Forms });
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