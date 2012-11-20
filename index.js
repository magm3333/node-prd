var PRDReport=require('./lib/PRDReport');

exports.createInstance = function(config, otherConfig) {
	return new PRDReport(config, otherConfig);
};
