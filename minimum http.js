const http = require('http');
http.createServer((req, res) =>{//when we get a request
				res.write('requested');
				res.end();
})
.listen(5000,()=>console.log('running'));