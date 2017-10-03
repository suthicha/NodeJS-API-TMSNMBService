var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

var settings = require('./settings');
var httpMsg = require('./core/httpMsg');
var user = require('./controller/user');
var invoice = require('./controller/invoice');

app.set('secert', settings.secert);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// basic route (http://localhost:<port>)
app.get('/', function(req, resp) {
    resp.send('The API is at the http://localhost:' + settings.webPort + '/api');
});

var apiRoute = express.Router();
apiRoute.post('/authenticate', function(req, resp) {
    user.authenticate(req, resp);
});


// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
apiRoute.use(function(req, resp, next) {

	var token = req.body.token || req.param('token') || req.headers['x-access-token'];
	
	if (token){
		// verifies secret and checks exp
		jwt.verify(token, app.get('secert'), function(err, decoded) {
			if (err) {
				return resp.json({ auth: { authenticated: false, message: 'Failed to authenticate token.'} });
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});
	}
	else {
		// if there is no token
			// return an error
			return resp.status(403).send({
				success: false,
				message: 'No token provided.'
			});
	}
});

// ---------------------------------------------------------
// route middleware to shipment api.
// ---------------------------------------------------------
apiRoute.get('/invoices', function(req, resp) {
	invoice.getList(req, resp);
}) 

apiRoute.get('/invoice/:id', function(req, resp) {
	invoice.get(req, resp, req.params.id);
})

apiRoute.delete('/invoice/:id', function(req, resp) {
	invoice.delete(req, resp, req.params.id);
})


apiRoute.get('/', function(req, resp) {
    httpMsg.showHome(req, resp);
});

app.use('/tmsapi', apiRoute);
app.listen(settings.webPort);
console.log('Service started at http://localhost:' + settings.webPort);
