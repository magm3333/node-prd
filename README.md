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
- tmpParentFolder (optional): folder containing the tmp folder. If not set, current directory (process.cwd()) is used.


### Change data sources
By default, when you run a report is used as the data source the embeded data source.

To implement an alternative data source, in the first place, must be added the attribute dataFactory.

dataFactory: is the attribute that defines an alternative data source.

If you want change data source, first must be select the correct. 
The options are: NamedStatic, Sql, XPath, Kettle and BandedMDX.

To select the type of data source, we must insert the type attribute within DataFactory

type: the type of data source to implement. Possible values are: NamedStatic, Sql, XPath, Kettle and BandedMDX.


#### NamedStatic: data are sent from the node application in json format.

  Example of configuration:
      "dataFactory" : {
          "type" : "NamedStatic",
          "columnNames" : ["idZona","Zona"],
          "columnTypes" : ["Integer","String"],
          "data" : [
              [1,"east"],
              [2,"west"],
              [3,"north"],
              [4,"south"]
           ]
      }

- columnNames: Array that contains the names of the columns. Please note that the names are defined exactly as defined in the report. The number of defined columns here, define the number of columns in the data.
- columnTypes: contains data type for each of columns defined in columnNames.
- data: a two-dimensional array containing data.

### Need more JDBC Drivers?
If you need a new JDBC driver for one data source, simply download JDBC driver and put it in the folder [PRD_HOME]/lib/jdbc.

## Caution: 
The module run a JVM for each call to runReport() method


## TODO
- Implement: SQLReportDataFactory, XPathDataFactory, KettleDataFactory and BandedMDXDataFactory
- Build an example web site with express/jade
- Add Report as a Service featrure (RaaS) to solve the problem of multiple instances of JVM and allow more concurrency
- Make it work on Windows & Mac
- Do you have any idea?

## License

Copyleft 2012 Mariano García Mattío

node-prd is 100% licensed GNU GPLv3 