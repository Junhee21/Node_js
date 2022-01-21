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

require('./src/routes/form.routes')(app);
app.get('/healthcheck', function(req, res){
	res.writeHead(200, { "Content-Type": "text/html" });
	res.write("Health Check Page");
	res.end();
});
