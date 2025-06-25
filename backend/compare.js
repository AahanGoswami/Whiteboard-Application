const http=require ('http');
//const fs=require('fs');

const validHTMLPage=`
<!DOCTYPE html>
<html>
<head>
    <title>My Node.js Server</title>
</head>
    <body>
        <h1>Welcome to Node.js </h1>
        <p> Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.</p>
    </body>
</html>
`;

const server=http.createServer((req,res)=>{
    if (req.url=='/'){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(`${validHTMLPage}`);
        res.end();

    }
    else if (req.url ==='/home') {
        res.write('Welcome to the Home Page');
        res.end();
    }
    else if (req.url ==='/about') {
        res.write ('Welcome to the About Page');
        res.end();
    }
    else {
        res.write('Page Not Found');
        res.end();
    }
});

server.listen(3031,()=>{
    console.log("Server is listening on port 3031");

});