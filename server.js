var express = require('express');
var app = express();
var port = 5000;

var fs = require('fs');

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded());

app.use(express.bodyParser());

app.use(express.static(__dirname + '/public'));//include the /public folder

app.listen(port);
console.log("listening"); //server excute success


app.get('/items', function(req, res){
	fs.readFile('todo.json',function(err,data){
		res.send(data);
	})

});
//-------------------------save version
/*app.put('/items/:id',function(req,res){
	var buffer = JSON.stringify(req.body);
	fs.writeFile('todo.json',buffer,function(err, data){
		  if (err) throw err;
	})
})*/
//-----------------------------
//-----------------------ADD
app.post('/items',function(req,res){ 
	var buffer = JSON.stringify(req.body),
		str = fs.readFileSync('todo.json','utf8'),
		temp = JSON.parse(str);

	temp.unshift(req.body);
	fs.writeFile('todo.json',JSON.stringify(temp),function(err, data){
		  if (err) throw err;
	})
});
//-------------------------update---------------
app.put('/items/:id', function(req, res){
	var updateID = req.params.id,
	 	buffer = req.body,
		str = fs.readFileSync('todo.json','utf8'),
		temp = JSON.parse(str);
	
	temp[updateID].class = "is-done";
	fs.writeFile('todo.json',JSON.stringify(temp),function(err, data){
		if (err) throw err;
	});
});

//--------------- updata position
app.put('/items/:id/reposition/:new_position', function(req, res){
	var buffer = req.body,
		str = fs.readFileSync('todo.json','utf8'),
		temp = JSON.parse(str),
		temparr = temp[req.params.id];
	
	temp.splice(req.params.id, 1);
	temp.splice(req.params.new_position , 0 , temparr);
	fs.writeFile('todo.json',JSON.stringify(temp),function(err, data){
		if (err) throw err;
	});
});


app.delete('/items/:id', function(req, res){
	var buffer = req.body,
		str = fs.readFileSync('todo.json','utf8'),
		temp = JSON.parse(str);

	temp.splice(req.params.id, 1);
	fs.writeFile('todo.json',JSON.stringify(temp),function(err, data){
		if (err) throw err;
	});
});


