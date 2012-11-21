#!/bin/sh

TMP_CLASSPATH=$CLASSPATH
BASEDIR=`dirname $0`
cd $BASEDIR
cd ../../
DIR_NODE_PRD=`pwd`


if [ -n "$PRD_HOME" ] && [ -d "$PRD_HOME" ] && [ -r "$PRD_HOME" ]; then
    DIR="$PRD_HOME"
elif [ -n "$2" ] && [ -d "$2" ] && [ -r "$2" ]; then
	DIR="$2"
fi

if [ -n "$DIR" ]; then
	TMP_CLASSPATH=$TMP_CLASSPATH:$DIR_NODE_PRD/javalib
	for i in `find $DIR_NODE_PRD/javalib -type f -name "*.jar"` 
		do TMP_CLASSPATH=$TMP_CLASSPATH:$i
	done
	for i in `find $DIR/lib -type f -name "*.jar"` 
		do TMP_CLASSPATH=$TMP_CLASSPATH:$i
	done
	for i in `find $DIR/lib -type f -name "*.zip"` 
		do TMP_CLASSPATH=$TMP_CLASSPATH:$i
	done
	for i in `find $DIR/lib/jdbc -type f -name "*.jar"` 
		do TMP_CLASSPATH=$TMP_CLASSPATH:$i
	done
	for i in `find $DIR/lib/jdbc -type f -name "*.zip"` 
		do TMP_CLASSPATH=$TMP_CLASSPATH:$i
	done
fi

java -classpath $TMP_CLASSPATH$ ar.com.magm.nodeprd.Main $1

RETURN=$? 
if [ "$RETURN"=="0" ]; then
	echo "OK ($RETURN)"
else
	echo "ERROR ($RETURN)"
fi

exit $RETURN
