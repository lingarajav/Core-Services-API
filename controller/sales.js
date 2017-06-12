var mongoose = require('mongoose');
var express = require('express');

module.exports = (function() {
	'use strict';
    var sales = express.Router();
	var Schema = mongoose.Schema;

	var salesSchema = new Schema({
		custId : { type: Schema.ObjectId, ref: 'CustomerInfo' },
//		merchantId : { type: Schema.ObjectId, ref: 'MerchantInfo' },
		merchantId : String,
		POSInvNo : String,
//		productId : { type: Schema.ObjectId, ref: 'ProductInfo' },
		productId : String,
		date : Date,
		paidAmount : String
	},{ collection: 'SalesInfo' });

	var model = mongoose.model('SalesInfo', salesSchema);
	var coreSales;
    
	sales.post('/insert', function (request, response) {
    	var cusObj = {
    		custId : request.body.custId,
    		merchantId : request.body.merchantId,
    		POSInvNo : request.body.POSInvNo,
    		productId : request.body.productId,
    		date : request.body.date,
    		paidAmount : request.body.paidAmount
    	}

    	sales = new model(cusObj);

    	sales.save(function (err) {
    	  if (err)
    		  response.send({status:"error",message:err});
    	  else
    		  response.send({status:"success",_id:sales._id});
    	});    	
    });     
    
	return sales;

})();