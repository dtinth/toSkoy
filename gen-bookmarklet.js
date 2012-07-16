
var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;
var fs = require('fs');

var orig_code = fs.readFileSync('toskoy.js', 'utf-8') + ';(' + (function() {
  
  var fringe = [document.body]

  function walk() {
    var current = fringe.pop()
    if (!current) return false
    if (current.nodeType == 1) {
      for (var i = current.childNodes.length - 1; i >= 0; i --) {
        fringe.push(current.childNodes[i])
      }
    } else if (current.nodeType == 3) {
      current.nodeValue = current.nodeValue.toSkoy()
    }
    return true
  }

  function perform() {
    var start = new Date().getTime()
      , ret
    while (new Date().getTime() - start < 30 && (ret = walk())) {}
    if (ret) setTimeout(perform, 0)
  }
  perform()

}).toString() + ')()'

var ast = jsp.parse(orig_code) // parse code and get the initial AST
ast = pro.ast_mangle(ast) // get a new AST with mangled names
ast = pro.ast_squeeze(ast) // get an AST with compression optimizations
var final_code = pro.gen_code(ast, {beautify: false}) // compressed code here

var bookmarkletCode = ('void(function() {' + final_code + '}())')
fs.writeFileSync('bookmarklet.js', 'bookmarkletUrl = ' + JSON.stringify('javascript:' + encodeURIComponent(bookmarkletCode)), 'utf-8')



