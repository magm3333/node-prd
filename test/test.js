var nodePrd=require('../../node-prd');
var path=require('path');
var fs = require('fs');

var prdHome=process.env.PRD_HOME;

var dirExists=function(path) {
	if (fs.existsSync(path)){
		st = fs.lstatSync(path);
		return st.isDirectory();
	} 
	return false;
}
var fileExists=function(path) {
	if (fs.existsSync(path)){
		st = fs.lstatSync(path);
		return st.isFile();
	} 
	return false;
}

if (!prdHome || prdHome=='') {
	console.warn('Environment variable PRD_HOME not set.');
	process.exit(1);
} else {
	try {
    	if (!dirExists(prdHome)) {
        	console.warn('Value of PRD_HOME not pointing to a directory');
        	console.warn('   Current PRD_HOME value: '+prdHome);
        	process.exit(1);
    	} else {
    		if (!fileExists(prdHome+'/set-pentaho-env.sh') ||
    			!fileExists(prdHome+'/set-pentaho-env.sh') || 
    			!dirExists(prdHome+'/lib') ||
    			!dirExists(prdHome+'/lib/jdbc')) {
        		console.warn('Value of PRD_HOME appears not to have a copy of PRD');
        		console.warn('   Current PRD_HOME value: '+prdHome);
        		process.exit(1);
    		}
    	}
	} catch (e) {
    	console.error(e);
	}

}

console.log('Current PRD_HOME value: '+prdHome);

var nPrd=nodePrd.createInstance(
	{	
		reportBundlePath:  path.resolve(__dirname+'/report.prpt'),
		outputFilePath: path.resolve(__dirname+'/out/report'),
		outputType: 'pdf',
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
		prdHomePath : prdHome,
		tmpParentFolder : '.'
	}
);
console.info('node-prd version: '+nPrd.getVersion());
console.info('Running test report...');
nPrd.runReport(function(code){
	if(code==0)
		console.info('Report OK');
	else
		console.error('Report ERROR='+code);
},true,true);
