var express = require('express');
var app = express();
var port = 5000;

var fs = require('fs');

var test=[{	class:"is-done",text:"aaa"} ,
	{class:"none",text:"b"}
	];//the var should store class and text

app.use(express.static(__dirname + '/public'));//include the /public folder
app.listen(port);
console.log("listening") //server excute success





list = JSON.stringify(test);//transfer the var test to the JSON format
fs.writeFile('todo.json', list, function (err) {
  if (err) throw err; //if err shows err
  console.log('saved!'); //log saved!
});

