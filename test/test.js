var nodePrd=require('../../node-prd');
var path=require('path');
var nPrd=nodePrd.createInstance(
	{	
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
	{
		prdHomePath : '/home/mariano/pentaho/prd4',
		scriptsFolder : '../',
		tmpParentFolder : '.'
	}
);
console.log('node-prd version: '+nPrd.getVersion());
console.log('Running report...');
nPrd.runReport(function(code){
	if(code==0)
		console.log("Report OK");
	else
		console.log("Report ERROR="+code);
},false,true);
