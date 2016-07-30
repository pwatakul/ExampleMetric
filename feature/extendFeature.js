"use strict";

var fs = require('fs');
var espree = require("espree");
/**
 * @constructor
 */
function extendFeature(text){
    this.text = text;
//try {
    this.ast = espree.parse(text);
// } catch (e) {
// }
}

extendFeature.prototype = {

    AvgParem : function(){
        var result = 0;
        var numOfFun = 0;
        var sumOfParems = 0;
        if(this.ast === undefined){
            return 0;
        }

        for (var i = 0; i < this.ast.body.length; i++) {
            if (this.ast.body[i].type === 'FunctionDeclaration' || this.ast.body[i].type === 'ArrowFunctionExpression' || this.ast.body[i].type === 'FunctionExpression') {
                //console.log(ast.body[0].params);
                sumOfParems += this.ast.body[i].params.length;
                numOfFun += 1;
            }
        }
        if (numOfFun === 0) {
            return 0;
        }
        return sumOfParems/numOfFun;
    },
    getAvgCharline : function(){
        var SourceCode = require("eslint").SourceCode;

        var code = this.text;
        if (code === undefined) {
            console.log("test");
        }
        // split code into an array
        var codeLines = SourceCode.splitLines(code);

        var lengthOfCode = 0;
        for (var count = 0; count < codeLines.length; count++) {
            lengthOfCode += codeLines[count].length;
            //console.log(codeLines[count]);

        }
        var result = lengthOfCode / codeLines.length;

        return result;
    },
    identifiers(){
        var result = countVar(this.ast);
        return result;
    },
    mostDepth(){

        // var result = 1;
        // for (var i = 0; i < this.ast.body.length; i++) {
        //     if (this.ast.body[i].consequent !== undefined) {
        //         if (result < this.countDepth(this.ast.body[i].consequent)+1) {
        //             result = this.countDepth(this.ast.body[i].consequent)+1;
        //         }
        //     }
        // }
        var result = countDepth(this.ast);
        return result;

    }


};
function countVar(ast){
    var result = 0;
    if (ast.body !== undefined) {
        for (var i = 0; i < ast.body.length; i++) {
            if (ast.body[i].consequent !== undefined) {
                result += countVar(ast.body[i].consequent);
            }
            else if(ast.body[i].body !== undefined){
                result += countVar(ast.body[i].body);
            }
            else if(ast.body[i].type === "VariableDeclaration" && ast.body[i].declarations !== undefined){
                result += ast.body[i].declarations.length;
            }
            else if (ast.body[i].type === "VariableDeclaration") {
                result += 1;
            }

            if (ast.body[i].alternate !== undefined && ast.body[i].alternate !== null) {

                result += countVar(ast.body[i].alternate);
            }
        }
    }else{
        if (ast.alternate !== undefined && ast.alternate !== null) {
            result += countVar(ast.alternate);
        }
        if(ast.consequent !== undefined && ast.consequent !== null){
            result += countVar(ast.consequent);
        }
    }

    return result;
}

function countDepth(ast){
    var result = 1;
    for (var i = 0; i < ast.body.length; i++) {
        if (ast.body[i].consequent !== undefined) {
            if (result < countDepth(ast.body[i].consequent)+1) {
                result = countDepth(ast.body[i].consequent)+1;
            }
        }
    }
    return result;
}

module.exports = extendFeature;
