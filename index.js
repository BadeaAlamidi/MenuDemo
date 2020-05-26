//console.log('hello');
const http = require('http');
const path = require('path');
const fs = require('fs');
const server = http.createServer((req,res)=>{
//		if (req.url==='/')
//			{
//			 fs.readFile(path.join(__dirname,'public pages of a website','index.html'),(err,content)=>{ if (err) throw err; res.end(content);})
//			}
//		if (req.url==='/api/users')
//			{
//			 const users= [{name: 'Bob smith', age:40},{name: 'bobby smith', age:41}, {name:'baby smith', age: 42}];
//			 res.writeHead(200, {'Content-Type': 'application/json'});
//			 res.end(JSON.stringify(users));
//
//			}
let filePath = path.join(__dirname, 'public pages of a website', req.url==='/'?'index.html':req.url);
let extensionName = path.extname(filePath);
let contentType = 'text/html';
fs.readFile(
filePath, (err, content)=>{
				if (err) {
					   if (err.code=='ENOENT')
					   fs.readFile(
							path.join(__dirname,'public pages of a website','not found page.html'),(err,content)=> {
																		if (err) throw err; 
																		res.writeHead(200,{'Content-Type': 'text/html'});
																		res.end(content,'utf8');
																		}
							);
					   else {res.writeHead(500); res.end(`server error: ${err}`);}
			  		 } 
				else {
					res.writeHead(200,{'Content-Type': 'text/html'});
					res.end(content);
					}
			  }
	    );



});
const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));