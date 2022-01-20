const controllerForm = require("../controllers/form.controller");
const controllerAuth = require("../controllers/auth.controller");

module.exports = (app) => {
    app.post("/form/signup", async (req, res) => controllerAuth.signUp(req, res))
    app.get("/form/signin", async (req, res) => controllerAuth.signIn(req, res))
    app.get("/form/getuserid", async (req, res) => controllerAuth.getUserId(req, res))

    app.post("/form/create", async (req, res) => controllerForm.create(req, res));
    app.get("/form/getmylist", async (req, res) => controllerForm.getMyList(req, res));
    app.get("/form/getresult", async (req, res) => controllerForm.getResult(req, res));
    app.get("/form/getall", async (req, res) => controllerForm.getAll(req, res));
    app.post("/form/submit", async (req, res) => controllerForm.submit(req, res));
    // = app.get("form/result", controller.getResult) req, res 생략 가능
}