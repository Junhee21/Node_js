const controller = require("../controllers/form.controller");

module.exports = (app) => {
    app.post("/form/create", async (req, res) => controller.create(req, res));
    app.post("/form/submit", async (req, res) => controller.submit(req, res));
    app.get("/form/all", async (req, res) => controller.getAll(req, res));
    app.get("/form/result", async (req, res) => controller.getResult(req, res));
    // = app.get("form/result", controller.getResult) req, res 생략 가능
}