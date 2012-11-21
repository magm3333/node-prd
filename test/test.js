var nodePrd=require('../../node-prd');
var path=require('path');

var nPrd=nodePrd.createInstance(
	{	
		reportBundlePath:  path.resolve(__dirname+'/report.prpt'),
		outputFilePath: path.resolve(__dirname+'/out/report'),
		outputType: 'excelXlsx',
		params: [
			{name : 'title', value : 'node-prd test', type  : 'String'},
			{name : 'subtitle1', value : 'NamedStatic Data Factory', type : 'String'},
			{name : 'subtitle2', value :  'Time: '+ new Date(), type : 'String'}
		],
		dataFactory : {
			type : 'NamedStatic',
			columnNames : ['idZona','Zona'],
			columnTypes : ['Integer','String'],
			data : [
				[1,'east'],
				[2,'west'],
				[3,'north'],
				[4,'south']
			]
		}
	},
	{
		prdHomePath : '/home/mariano/pentaho/prd4',
		tmpParentFolder : '.'
	}
);
console.log('node-prd version: '+nPrd.getVersion());
console.log('Running test report...');
nPrd.runReport(function(code){
	if(code==0)
		console.log('Report OK');
	else
		console.log('Report ERROR='+code);
},false,true);
