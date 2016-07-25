"use strict";

var rules = require('./featureList')

var mainEngine= require('./mainEngine.js');
var fs = require('fs');

var result = [];

// var mainExtract = require("./SourceCodeExtract/CodeExtractor/main.js");
// try{
//     var x = new mainExtract();
//     var input = [];
//     input = x.getExtract();
// } catch(e){
//          console.log(e);
// }
var codeExtractor = require('./SourceCodeExtract/CodeExtractor/codeExtractor');

codeExtractor.getAllSourceCode('/Users/patawat/Desktop/SourceCodeExtract/RosettaCode', (codeArray) => {
	var input = codeArray;

    for( var count = 0 ; count < input.length; count++ ){
        var engine = new mainEngine(String(input[count]));
        result.push(engine.getResult());
    }

    //console.log(result);
    convertToCSV(result);
});

// var input;
// try {
//    var input = require("./test.json");
// } catch(e){
//     console.log(e);
// }

function convertToCSV(result){
    var B = [];
    //var inputJSON = require("./rules.json");
    for(var count = 0 ; count < rules.length ; count++){
        B.push(rules[count]);
    }

    var A = [];
    A.push(B);

    for(var count = 0 ; count < result.length ; count++){
        var c = [];
        var map = result[count];
        if (map === undefined) {
            continue;
        }
        for(var count2 = 0 ; count2 < rules.length ; count2++){
            var map = result[count];
            //console.log(count);

            //console.log(map[rules[count2]]);
            c.push(map[rules[count2]]);
        }

        A.push(c);
    }

    var csvRows = [];
    for(var i=0, l = A.length ; i < l ; ++i){
        csvRows.push( A[i].join(',') ); // unquoted CSV row
    }

    var csvString = csvRows.join('\n');

    fs.writeFile('result.csv',  csvString , function (err) {
        if (err) return console.log(err);
    });
}

// for( var count = 0 ; count < input.length ; count++ ){
//     var engine = new mainEngine(input[count].message);
//     result.push(engine.getResult());
// }
//
// console.log(result);
// convertToCSV(result);
