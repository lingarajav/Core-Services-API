var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/core');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

var commonCtrl = require('./controller/common.js');
var coreCustomer = require('./controller/customer');
var coreAppointment = require('./controller/appointment');
var coreSalesInfo = require('./controller/sales');
var corePaymentInfo = require('./controller/payment');
var falloutAppointment = require('./controller/fallout');

var port = process.env.PORT || 4000;

app.post('/core/api/login', function(request, response){ 
	commonCtrl.login(request, response);
});

app.post('/core/api/signup', function(request, response){
	commonCtrl.signUp(request, response);
});

app.use('/core/api/customer', coreCustomer);
app.use('/core/api/appointment', coreAppointment);
app.use('/core/api/sales', coreSalesInfo);
app.use('/core/api/payment', corePaymentInfo);
app.use('/core/api/fallout', falloutAppointment);


app.listen(port);

console.log('Server connected at ' , port);
