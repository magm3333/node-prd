var nodePrd=require('../../node-prd');
var path=require('path');
var nPrd=nodePrd.createInstance(
	{	
		reportBundlePath: "/home/mariano/report.prpt",
		outputFilePath: path.resolve("./out/report"),
		outputType: "excelXlsx",
		htmlFolder:"salidaHtml",
		params: [
			{name : "minId", value : 4, type:"Integer"}
		]
	},
	{
		prdHomePath : '/home/mariano/pentaho/prd4',
		scriptsFolder : '../',
		tmpParentFolder : '.'
	}
);
console.log(nPrd.getVersion());
console.log('Running report...');
nPrd.runReport(function(code){
	if(code==0)
		console.log("Report OK");
	else
		console.log("Report ERROR="+code);
},false,true);
