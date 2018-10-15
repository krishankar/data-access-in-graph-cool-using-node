var csvjson = require('csvjson');
var fs=require("fs");

// var db=require("./db.js");

const { createApolloFetch } = require('apollo-fetch');
const apolloFetch = createApolloFetch({ uri:'https://api.graph.cool/simple/v1/cjaxht0s52dbg01421uxhdzxv' });

apolloFetch.use(({ request, options }, next) => {
  if (!options.headers) {
    options.headers = {};  // Create the headers object if needed. 
  }
  options.headers['authorization'] = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MTIwMzYyNTYsImNsaWVudElkIjoiY2o2dTg3eGo4MG11ajAxMTB6Y3Zud3V5ciJ9.e-64yVqF2D5M6BNujT2Ci9c4gocnLE2xibqMAk1IFCc';
 
  next();
});


var getDistrictUrl=()=>{
	return new Promise((resolve,reject) => {
		var options = {
			delimiter : ',' , // optional
			quote     : '"' // optional
		};
		var file_data = fs.readFileSync('./districtS3url.csv', { encoding : 'utf8'});
		var result = csvjson.toObject(file_data, options);
		//console.log(result);
		resolve(result);
	})
}

getDistrictUrl()
.then((urls)=>{
	var addDistrictUrl=[]
	urls.forEach((url)=>{
		var addurl=(url)= new Promise((resolve, reject) => {
				apolloFetch({
					query: `mutation createDistrictS3url ($s3Url: String!) 
					{
					  createDistrictS3url (s3Url: $s3Url) {
						  s3Url
						}
					} `,
					variables: { 
                        s3Url:url.s3Url
					},
				}).then(res => {
					resolve(res.data.createDistrictS3url.id)
				})
				.catch((err)=>{
					reject(err);
				});
		})
		addDistrictUrl.push(addurl)
	})
    Promise.all(addDistrictUrl)
	.then(()=>{
		console.log("Done")
	})
	.catch((err)=>{
		console.log(JSON.stringify(err));
	})
})



