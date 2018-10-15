
const { createApolloFetch } = require('apollo-fetch');
const apolloFetch = createApolloFetch({ uri:'https://api.graph.cool/simple/v1/cjaxht0s52dbg01421uxhdzxv' });

apolloFetch.use(({ request, options }, next) => {
  if (!options.headers) {
    options.headers = {};  // Create the headers object if needed. 
  }
  options.headers['authorization'] = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MTIwMzYyNTYsImNsaWVudElkIjoiY2o2dTg3eGo4MG11ajAxMTB6Y3Zud3V5ciJ9.e-64yVqF2D5M6BNujT2Ci9c4gocnLE2xibqMAk1IFCc';
 
  next();
});


var getCaseType = (id) => {
    return new Promise((resolve, reject) => {
        apolloFetch({
            query: `query allCaseTypes {
                        allCaseTypes {
                            id
                            type
                        }
                    }`,
            variables: { 
                            id:id,			
                        }
        })
        .then((res) => {
            console.log(JSON.stringify(res)+ "id");
            resolve(res.data.allCaseTypes);
        })
        .catch((err) => {
            reject(err);
        });
    });
};

getCaseType()
.then((casetypes)=>{
	var deleteCaseTypedata=[]
	casetypes.forEach((casetype)=>{
		var deleteCaseType=(casetype)= new Promise((resolve, reject) => {
				apolloFetch({
					query: `mutation deleteCaseType($id:ID!){
                                deleteCaseType(id:$id) {
                                    id
                                    type
                                }
                            }`,
					variables: { 
                                    id:casetype.id									
							   },
				}).then(res => {
					resolve(res.data.deleteCaseType.id)
				})
				.catch((err)=>{
					reject(err);
				});
		})
		deleteCaseTypedata.push(deleteCaseType)
	})
	Promise.all(deleteCaseTypedata)
	.then(()=>{
		console.log("Done")
	})
	.catch((err)=>{
		console.log(JSON.stringify(err));
	})
})



