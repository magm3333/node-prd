module.exports = PRDReport;

function PRDReport(cfg, otherConfig) {
	this.config=cfg;
	this.prdHomePath=otherConfig.prdHomePath;
	this.scriptsFolder=otherConfig.scriptsFolder || process.cwd();
	this.tmpParentFolder=otherConfig.tmpParentFolder || process.cwd();
	var path=require('path');
	this.scriptsFolder=path.resolve(this.scriptsFolder);
	this.tmpParentFolder=path.resolve(this.tmpParentFolder);

	this.configFile=this.getTempFilePath();
}

PRDReport.prototype.getVersion = function() {
	return "0.0.1-beta1";
};

PRDReport.prototype.getTempFilePath=function() {
	var fs = require('fs');
	var tmpPath=this.tmpParentFolder+'/tmp';
	if (!fs.existsSync(tmpPath)) {
    	fs.mkdirSync(tmpPath);
	}
	var fPath=tmpPath+'/node_prd_cfg_'+Math.ceil((new Date().getTime())*(100*Math.random()))+".json";
	return fPath;
};
PRDReport.prototype.getExecutable=function() {
	var osType=require('os').type().toString().toLowerCase();
	var execFile;
	if(osType=='linux')
		execFile='ejecutar.sh';
	if(osType.substring(0,7)=='windows')
		execFile='ejecutar.bat';
	var executable=this.scriptsFolder+'/'+execFile;
	return executable;
};

PRDReport.prototype.runReport = function(cb, logOut, logErr) {
	var configStr=JSON.stringify(this.config);
	var execParams=[];
	var prdR=this;
	require('fs').writeFile(prdR.configFile, configStr, function(err) {
    	if(err) {
    		if (logErr)
        		console.log(err);
    	} else {
    		var executable=prdR.getExecutable();
    		if(logOut) {
    			console.log('Using '+prdR.configFile+' config file');
    			console.log('Executable '+executable);
    		}
    		execParams.push(prdR.configFile);
    		if (prdR.prdHomePath) {
    			execParams.push(prdR.prdHomePath);
    			if(logOut)
    				console.log('Using '+prdR.prdHomePath+' prd home path');
    		}
        	var spawn = require('child_process').spawn,
    			nodePrd = spawn(executable, execParams);

    		if (logOut) {
    			nodePrd.stdout.on('data', function (data) {
  					console.log(data.toString());
				});
    		}
    		if(logErr) {
				nodePrd.stderr.on('data', function (data) {
  					console.log("Error "+data.toString());
				});
			}

			nodePrd.on('exit', function (code) {
				cb(code);
			});
    	}
	}); 
};

