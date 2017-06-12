var mongoose = require('mongoose');
var express = require('express');

module.exports = (function() {
	'use strict';
    var payment = express.Router();
	var Schema = mongoose.Schema;

	var paymentSchema = new Schema({
		POSPaymentId : String,
		amount : String,
		cardHolderName : String,
		date : Date,
		POSInvNo : String
	},{ collection: 'PaymentInfo' });

	var model = mongoose.model('PaymentInfo', paymentSchema);
	var coreSales;
    
	payment.post('/insert', function (request, response) {
    	var cusObj = {
    		POSPaymentId : request.body.POSPaymentId,
    		amount : request.body.amount,
    		cardHolderName : request.body.cardHolderName,
    		date : request.body.date,
    		POSInvNo : request.body.POSInvNo
    	}

    	payment = new model(cusObj);

    	payment.save(function (err) {
    	  if (err)
    		  response.send({status:"error",message:err});
    	  else
    		  response.send({status:"success",_id:payment._id});
    	});    	
    });     
    
	return payment;

})();