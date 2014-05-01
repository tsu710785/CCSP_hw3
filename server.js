var express = require('express');
var app = express();
var port = 5000;

var fs = require('fs');

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded());

app.use(express.bodyParser());

app.use(express.static(__dirname + '/public'));//include the /public folder

app.listen(port);
console.log("listening") //server excute success


app.get('/item', function(req, res){
	fs.readFile('todo.json',function(err,data){
		res.send(data);
	})
});
app.put('/items/:id',function(req,res){
	var buffer = JSON.stringify(req.body);
	fs.writeFile('todo.json',buffer,function(err, data){
		  if (err) throw err; //if err shows err
	})
})


