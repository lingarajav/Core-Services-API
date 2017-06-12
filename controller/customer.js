var mongoose = require('mongoose');
var express = require('express');
var Client = require('node-rest-client').Client;
var client = new Client();
var coreBaseUrl = "http://localhost:4000/core/api/";

module.exports = (function() {
	'use strict';
    var customer = express.Router();
    var Schema = mongoose.Schema;

	var customerSchema = new Schema({
		POSCustId : {type : String, default : null},
		title : String,
		firstName : {type : String, default : null},
		lastName : String,
		DOB : String,
		phoneNumber : String,
		email : String,
		cardHolderName : String,
		lastUpdateDate : {type : Date, default : new Date()},
		customerTypeId : { type: Schema.ObjectId, ref: 'CustomerType' },
		address1 : String,
		address2 : String,
		address3 : String,
		city : String,
		state : String,
		country : String,
		zip : String
	},{ collection: 'CustomerInfo' });

	var model = mongoose.model('CustomerInfo', customerSchema);
	var coreCustomer;
	
    customer.get('/get/all', function (request, response) {
    	model.find().exec(function(err, customers) {
      	  if (err) 
    		  response.send({status:"error",message:err});
    	  else 
    		  response.send(customers);
    	});   	
    });
    
    customer.get('/get/:cid', function (request, response) {
    	model.findOne({_id : mongoose.Types.ObjectId(request.param("cid"))}).exec(function(err, customer) {
      	  if (err) 
    		  response.send({status:"error",message:err});
    	  else     		
    		  response.send(customer);
    	});   	
    });	    
    
    
    customer.get('/get', function (request, response) {
    	model.findOne({email : request.query.email}).exec(function(err, customer) {
      	  if (err) 
    		  response.send({status:"error",message:err});
    	  else if (customer == null)
    		response.send({status:"success",message:"Customer not found"});
	  else    		
		response.send(customer);
    	});   	
    });
    
    customer.post('/insert', function (request, response) {
    	var cusObj = {
    		POSCustId : request.body.id,
    		firstName : request.body.firstName,
    		lastName : request.body.lastName,
    		DOB : request.body.DOB,
    		phoneNumber : request.body.phoneNumber,
    		email : request.body.email,
    		cardHolderName : request.body.cardHolderName,
    		address1 : request.body.address1,
    		address2 : request.body.address2,
    		address3 : request.body.address3,
    		city : request.body.city,
    		state : request.body.state,
    		country : request.body.country,
    		zip : request.body.zip    		
    	}

    	coreCustomer = new model(cusObj);

    	coreCustomer.save(function (err) {
    	  if (err) {
    		  console.log(err);
    		  response.send({status:"error",message:err});
    	  }
    	  else{ 
    		  console.log("success");
    		  response.send({status:"success",_id:coreCustomer._id});
    	  }
    	})    	
    });
    
    customer.post('/update', function (request, response) {    	
    	var reqQuery = {
    	    _id: mongoose.Types.ObjectId(request.body._id)
    	}
    	    	
    	var cusObj = {
    		POSCustId : request.body.id,
    		firstName : request.body.firstName,
    		lastName : request.body.lastName,
    		DOB : request.body.DOB,
    		phoneNumber : request.body.phoneNumber,
    		email : request.body.email
    	}

   	 	var options = { multi: false };
    	model.update(reqQuery, cusObj, options, function (err) {
       	  if (err) 
       		  response.send({status:"error",message:err});
       	  else 
       		  response.send({status:"success",id:request.body._id});
   	 	});   	
    });
    
    customer.post('/delete', function (request, response) {    	
    	var reqQuery = {
    	    _id: mongoose.Types.ObjectId(request.body._id)
    	}
    	    	
    	model.remove(reqQuery, function (err,res) {
       	  if (err) 
       		  response.send({status:"error",message:err});
       	  else 
       		  response.send({status:"success",id:request.body._id});
   	 	});   	
    });
    
    customer.post('/search', function (request, response) {
    	if (request.body.hasOwnProperty("customerData")) {
    		var searchQuery = {};
    		searchQuery.email = request.body.customerData.emailAddresses.elements[0].emailAddress;
        	model.find(searchQuery).exec(function(err, customers) {
        		if (customers.length == 1)
        			response.send(customers);
        		else
        			searchByCardholderName(request, response);
          	});    		   			    		
    	} else {
    		searchByCardholderName(request, response);    		
    	}    	
    });
    
    function searchByCardholderName (request, response) {
    	 if (request.body.paymentData.cardTransaction.hasOwnProperty("cardholderName")) {
     		var cardholderName = request.body.paymentData.cardTransaction.cardholderName;
     		var searchQuery = {};     		
     		searchQuery.cardHolderName = cardholderName;
         	model.find(searchQuery).exec(function(err, customers) {
         		if (customers.length == 1) {
         			response.send(customers);
         		} else {
         			var req = {
     					data : { "cardholderName" : cardholderName },
     					headers : {"Content-Type" : "application/json"}			
     				};
         			client.post(coreBaseUrl + 'appointment/search', req, function(data,res){
         				response.send(data);
         			});         			         			
         		}
         	});
     	}
    }
    
	return customer;

})();
