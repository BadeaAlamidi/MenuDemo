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
	switch(extensionName)
	{
		case '.js':contentType='text/javascript'; break;
		case '.css':contentType='text/css'; break;
		case '.json':contentType='application/json'; break;
		case '.png':contentType='image/png'; break;
		case '.jpg':contentType='image/jpg'; break;
		case '.mp3':contentType="audio/mp3";break;
		
	}
	fs.readFile(
		filePath,
		(err, content)=>{
			if (err) {
				if (err.code=='ENOENT'){
					fs.readFile(
						path.join(__dirname,'public pages of a website','not found page.html'),
							(err,content)=> {
								if (err) throw err; 
								res.writeHead(200,{'Content-Type': contentType});
								res.end(content,'utf8');
							}
					);
				} else {
					res.writeHead(500); res.end(`server error: ${err}`);
				}
			} else {
				res.writeHead(200,{'Pragma': 'public', 'Cache-Control': 'public, max-age=2592000', 'Content-Type': contentType});
				res.end(content);
			}
		}
	);
});
// const PORT = process.env.PORT || 5000;
const PORT = {host:'0.0.0.0', port: 5000};
server.listen(PORT, ()=> console.log(`Server running on port ${PORT.port} `));