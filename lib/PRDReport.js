module.exports = PRDReport;

function PRDReport(cfg, otherConfig) {
	this.config=cfg;
	this.prdHomePath=otherConfig.prdHomePath;
	this.scriptsFolder=otherConfig.scriptsFolder || process.cwd();
	this.tmpParentFolder=otherConfig.tmpParentFolder || process.cwd();
	var path=require('path');
	this.scriptsFolder=path.resolve(__dirname+"/scripts");
	this.tmpParentFolder=path.resolve(this.tmpParentFolder);
	this.configFile=this.getTempFilePath();
	this.isRaaSRunning=false;
	this.portRaaS=-1;

}


PRDReport.prototype.getVersion = function() {
	return require('path').resolve(__dirname+'/../package.json').version;
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
PRDReport.prototype.getExecutable=function(initName) {
	var osType=require('os').type().toString().toLowerCase();
	var execFile;
	if(osType=='linux')
		execFile=initName+'.sh';
	if(osType.substring(0,7)=='windows')
		execFile=initName+'.bat';
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
        		console.error(err);
    	} else {
    		var executable=prdR.getExecutable('execute');
    		if(logOut) {
    			console.info('Using '+prdR.configFile+' config file');
    			console.info('Executable '+executable);
    		}
    		execParams.push(prdR.configFile);
    		if (prdR.prdHomePath) {
    			execParams.push(prdR.prdHomePath);
    			if(logOut)
    				console.info('Using '+prdR.prdHomePath+' prd home path');
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
  					console.error("Error "+data.toString());
				});
			}

			nodePrd.on('exit', function (code) {
				cb(code);
			});
    	}
	}); 
};



PRDReport.prototype.initRaaS = function(port, logOut, logErr) {
	var execParams=[];
	var prdR=this;
    var executable=prdR.getExecutable('startRaaS');
    this.portRaaS=port;
    execParams.push(port);
    if (prdR.prdHomePath) {
    	execParams.push(prdR.prdHomePath);
    	if(logOut)
			console.info('Using '+prdR.prdHomePath+' prd home path');
    }
    if(logOut) {
    	console.info('Starting RaaS server ('+executable+')');
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
  			console.error("Error "+data.toString());
		});
	}
	var prdT=this;
	this.pingFn=setInterval(function() {
		var net = require('net');
		if (!this.pingSocket) {
			this.pingSocket = new net.Socket();
			this.pingSocket.setEncoding('utf8');
			try {
				this.pingSocket.connect(port, 'localhost', function() {
				});
				this.pingSocket.on('data',function(data){
					//console.log(data);
					if(data.code==0) {
						prdT.isRaaSRunning=true;
					}
				});
				this.pingSocket.on('error',function(e){
					console.error(e);
					prdT.isRaaSRunning=false;
					try {
						this.pingSocket.destroy();
					} catch (e) {}
					this.pingSocket=false;
				});
				this.pingSocket.on('close',function(){
					prdT.isRaaSRunning=false;
					try {
						this.pingSocket.destroy();
					} catch (e) {}
					this.pingSocket=false;
				});
			} catch(e) {
				console.error(e);
				this.pingSocket=false;
			}
		}
		if (this.pingSocket){
			this.pingSocket.write(JSON.stringify({command:"ping"})+'\n');
		}
	},1000);
};

PRDReport.prototype.stopRaaS = function() {
//	if (!this.isRaaSRunning)
//		return;
	try {
		var net = require('net');
		var socket = new net.Socket();
		socket.setEncoding('utf8');
		socket.connect(this.portRaaS, 'localhost', function() {
			console.info("Try to stop RaaS Server.");
			socket.write(JSON.stringify({command:"shutdown"})+'\n');
		});
		socket.on('error',function(e){
			console.error(e);
		});
		clearInterval(this.pingFn);
	} catch (e) {}
};

