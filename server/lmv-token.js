//
// Copyright (c) Autodesk, Inc. All rights reserved 
//
// Node.js server workflow 
// by Cyrille Fauvel - Autodesk Developer Network (ADN)
// January 2015
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted, 
// provided that the above copyright notice appears in all copies and 
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting 
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS. 
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC. 
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
//
var express =require ('express') ;
var ForgeOauth2 =require ('forge-apis') ;
var config =require ('./credentials') ;

var router =express.Router () ;

// This is the downgraded access_token for the viewer (should be read-only)
router.get ('/token', function (req, res) {
    var credentials =config.clone ('data:read') ;
    credentials.client_id =req.query.key ;
    credentials.client_secret =req.query.secret ;
    refreshToken (credentials, res) ;
}) ;

// This is the full access access_token for the application to process/translate files
router.post ('/token', function (req, res) {
	var credentials =config.clone () ;
	credentials.client_id =req.body.key ;
	credentials.client_secret =req.body.secret ;
	refreshToken (credentials, res) ;
}) ;

var refreshToken =function (credentials, res) {

	var autoRefresh = true; // or false

	var oAuth2TwoLegged = new ForgeOauth2.AuthClientTwoLegged		(credentials.client_id, credentials.client_secret, 
		credentials.scope, autoRefresh);

oAuth2TwoLegged.authenticate().then(function(response){
    // The `credentials` object contains an access_token that is being used to call the endpoints.
    // In addition, this object is applied globally on the oAuth2TwoLegged client that you should use when calling secure endpoints.
	res.json (response) ;
 })
		.catch (function (error) {
			if ( error.statusCode )
				return (res.status (error.statusCode).end (error.statusMessage)) ;
			res.status (500).end () ;
		})
	;
} ;

module.exports =router ;
