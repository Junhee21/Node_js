const http = require('http');
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors());
app.use('/static', express.static('public'));

app.listen(port, () => console.log(`Server up and running on port ${port}.`));

const db = require("./models");
const Form = db.Form
const FormQuestion = db.FormQuestion
const FormQuestionOption = db.FormQuestionOption
const FormQuestionResult = db.FormQuestionResult

app.get('/healthCheck', function(req, res){
	res.writeHead(200, { "Content-Type": "text/html" });
	res.write("Health Check Page");
	res.end();
});

app.post("/form/create", async (req, res) => {
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
})

app.post("/form/submit", async (req, res) => {
  await req.body.map((obj) => {
    if (obj.questionId != 0) {
      FormQuestionResult.create({
        FormQuestionId: obj.questionId,
        id: obj.resultId,
        content: obj.result
      })
    }
  })
})

app.get("/form/all", async (req, res) => {
  const Forms = await Form.findAll({
    include: [{
      model: FormQuestion,
      include: FormQuestionOption
    }]
  })
  res.json({ Forms: Forms })
})

app.get("/form/result", async (req, res) => {
  const form = await Form.findOne({
    where: { id: req.query.formId },
    include: [{
      model: FormQuestion,
      include: [{
        model: FormQuestionOption
      },{
        model: FormQuestionResult
      }]
    }]
  })
  res.json({ form: form })
})