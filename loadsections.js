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

var getSections=()=>{
	return new Promise((resolve,reject) => {
		var options = {
			delimiter : ',' , // optional
			quote     : '"' // optional
		};
		var file_data = fs.readFileSync('./sectiondata.csv', { encoding : 'utf8'});
		var result = csvjson.toObject(file_data, options);
		// console.log(JSON.stringify(result)+"result");
		resolve(result);
	})
}

getSections()
.then((sections)=>{
	var addSectiondata=[]
	sections.forEach((section)=>{
		var addSection=(section)= new Promise((resolve, reject) => {
				apolloFetch({
					query: `mutation createSectionsData ($serialNo: String,$sectionNumber:String,
                        $title:String,$type:String) 
                {
                      createSectionsData (serialNo: $serialNo,
                          sectionNumber: $sectionNumber,
                            title:$title,
                            type: $type) {
                                  serialNo,
                            sectionNumber,
                            title
                            type
                    }
        }`,
					variables: { 
                                    serialNo:section.Slno,
                                    sectionNumber:section.SectionNo,
                                    type:section.Type,
                                    title:section.Title
								},
				}).then(res => {
                    resolve(res.data.createSectionsData.id)
				})
				.catch((err)=>{
					reject(err);
				});
		})
		addSectiondata.push(addSection)
	})
	Promise.all(addSectiondata)
	.then(()=>{
        // console.log(JSON.stringify(addSectiondata)+"Done") 
        console.log("Done");       
	})
	.catch((err)=>{
		console.log(JSON.stringify(err));
	})
})



