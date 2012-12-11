@echo off
cls
set accion=
set ejecutable=java
set BASEDIR=%~dp0
CD /D %~dp0

set TMP_CLASSPATH=%CLASSPATH%

cd ../../
set DIR_NODE_PRD=%CD%
set DIR1=%2


if exist "%PRD_HOME%" (
	set DIR1="%PRD_HOME%"
)

if exist "%DIR1%" (
	echo DEBUG: using "%DIR1%" as PRD_HOME

	set TMP_CLASSPATH=%TMP_CLASSPATH%;%DIR_NODE_PRD%\javalib
	echo DEBUG: NODE_PRD_HOME=%DIR_NODE_PRD%

	for %%i in ("%DIR_NODE_PRD%\javalib\*.jar") do call :setter %%i

	for %%i in ("%DIR1%\lib\*.jar") do call :setter %%i

	for %%i in ("%DIR1%\lib\*.zip") do call :setter %%i

	for %%i in ("%DIR1%\lib\jdbc\*.jar") do call :setter %%i

	for %%i in ("%DIR1%\lib\jdbc\*.zip") do call :setter %%i

	goto startJVM
)

echo ERROR: PRD_HOME not set!
goto end


:setter
::echo DEBUG: -- setter %~1
set TMP_CLASSPATH=%TMP_CLASSPATH%;%~1
goto :eof

:startJVM
::echo DEBUG: CLASS_path=%TMP_CLASSPATH%

java -classpath %TMP_CLASSPATH% ar.com.magm.nodeprd.Main %1

echo ERROR_LEVEL=%ERRORLEVEL%

:end