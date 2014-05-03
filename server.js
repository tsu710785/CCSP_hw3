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
	var buffer = JSON.stringify(req.body);
	var text = new String(fs.readFileSync('todo.json','utf8'));
	var temp = "";
	temp = "["+temp+buffer+",";
	for (i=1;i<text.length;i++){
		temp += text[i];
	}
	fs.writeFile('todo.json',temp,function(err, data){
		  if (err) throw err;
	})
});
//-------------------------update---------------
app.put('/items/:id', function(req, res){
	var buffer = req.body;
	var	str = fs.readFileSync('todo.json','utf8');
	var temp = JSON.parse(str);
	temp.forEach(function(val,inx){
		if(val.text===buffer.text){
			val.class = "is-done";
		};
	});
	fs.writeFile('todo.json',JSON.stringify(temp),function(err, data){
		if (err) throw err;
	});
});

//--------------- updata position
app.put('/items/:id/reposition/:new_position', function(req, res){
	var buffer = req.body;
	var	str = fs.readFileSync('todo.json','utf8');
	var temp = JSON.parse(str);
	var temparr;//swap
	var inx,move;
	//console.log(req.body[0],req.body[1]);
	inx = req.body[0];
	move = req.body[1];
	if(move<0){
		for(var i=0;i>move;i--){
			temparr = temp[inx+i];
			temp[inx+i] = temp[inx+i-1];
			temp[inx+i-1] = temparr;
		}
	}
	else{
		for(var i=0;i<move;i++){
			temparr = temp[inx+i];
			temp[inx+i] = temp[inx+i+1];
			temp[inx+i+1] = temparr;
		}
	}
	//console.log(temp);
	fs.writeFile('todo.json',JSON.stringify(temp),function(err, data){
		if (err) throw err;
	});

});


app.delete('/items/:id', function(req, res){
	var buffer = req.body;	
	var str = fs.readFileSync('todo.json','utf8');
	var temp = JSON.parse(str);
	temp.forEach(function(val,inx){
		if(val.text===buffer.text){
			temp.splice(inx, 1);
		};
	});
	fs.writeFile('todo.json',JSON.stringify(temp),function(err, data){
		if (err) throw err;
	});
});
