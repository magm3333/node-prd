# node-prd (by magm) 
 [magm's blog](http://blog.magm.com.ar)

 [egluBI web](http://www.eglubi.com.ar)


## Install

    npm install (not yet)


## What is This? extra config
node-prd is a node.js module that allows to execute Pentaho Reports (PRD) from node.js application.


## Prerequisites

- Java Development Kit (JDK) 1.6 or later
- Pentaho Report Designer 3.9 or 4.0


## How to use
    //Load module
    var nodePrd=require('node-prd');
    var path=require('path');
    // Configure module intance:
    // first parameter: json with information to process report
    // second parameter: configuration environment 
    var nPrd=nodePrd.createInstance(
   { //Information to process report
     reportBundlePath: "/home/mariano/report.prpt",
     outputFilePath: path.resolve("./out/report"),
     outputType: "excel",
     htmlFolder:"salidaHtml",
     params: [
      {name : "minId", value : 4, type:"Integer"},
      {name : "title", value : 'Title: '+ new Date(), type : "String"},
      {name : "subtitle1", value : 'Sub title 1', type : "String"},
      {name : "subtitle2", value : 'Sub title 2', type : "String"}
    ]
   },
   { // Configuration environment
    prdHomePath : '/home/mariano/pentaho/prd4',
    scriptsFolder : '../',
    tmpParentFolder : '.'
   }
    );
    // Show module version 
    console.log('node-prd version: '+nPrd.getVersion());
    console.log('Running report...');
    nPrd.runReport(function(code){
  if(code==0)
    console.log("Report OK");
  else
    console.log("Report ERROR="+code);
    },false,true);

### Information to process report

- reportBundlePath (mandatory): is the location of PRD defintion bundle.
  Example: reportBundlePath: '/home/magm/report.prpt'
 
- outputFilePath (mandatory): is the location of output file, with or without extension (see also: outputType)
  Example: outputFilePath:'/home/magm/report.pdf'


- outputType (mandatory): is the output render type. The possible values ​​are: pdf, excel, excelXlsx, rtf or html.
  In case of html output, need to set the value for: htmlFolder
  Example: outputType: 'pdf'


- htmlFolder (mandatory in case outputType=html): is the name that will be used to create a folder from the parent folder set in outputFilePath.
  In this folder will place all the files that compose the HTML output. The home page will have the name specified in: outputFilePath  
  Is recommended that a folder can then serve from the web application


- params (optional): array of objects that represent report parameters.
  Each object contains the following attributes:
  - name: is the prd report attribute name. Attention: the name is case sensitive
  - value: the value of parameter
  - type: the data type of parameter. Possible values are: Integer, Long, Double, Float, Date and String for now.
    Numeric values are not quoted and decimal separator must be a point, not an comma, Date value must be unix      timestamp format

### Configuration environment 
- prdHomePath (optional): is the path to Pentaho Report Designer Home. If not specified, module try to use the environment variable named PRD_HOME. One of two (the parameter or the environment variable) must be set 
- scriptsFolder (optional): is the path to folder containing the execution scripts (ejecutar.sh, ejecutar.bat, ejecutarmac.sh). If not set, current directory (process.cwd()) is used.
- tmpParentFolder (optional): folder containing the tmp folder. If not set, current directory (process.cwd()) is used.

## License

Copyleft 2012 Mariano García Mattío

node-prd is 100% licensed GNU GPLv3 