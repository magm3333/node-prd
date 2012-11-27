 [![eGluBI.com.ar](http://troyanx.com/eglubi/eglu/img/banner_up.png)](http://eglubi.com.ar)

# node-prd (by magm) - eGluBI.com.ar 

http://troyanx.com/eglubi/eglu/img/banner_up.png
 [magm's blog](http://blog.magm.com.ar)

 [egluBI web](http://www.eglubi.com.ar)


- [Español](#a1)
- [English](#a2)

***********************************
***********************************
***********************************

<a name="a1"/>
# Documentación en Español

## Instalación

    npm install node-prd


## Qué es esto? 
node-prd es un módulo node.js que permite ejecutar reportes Pentaho (PRD) desde una plicación node.js.


## Prerequisitos

- Java Development Kit (JDK) 1.6 o posterior
- Pentaho Report Designer 3.9 o 4.0
- Linux, Windows (no disponible aún) o MacOS (no disponible aún)
- Variable de entorno PRD_HOME apuntando a la carpeta de PRD


## Cómo se utiliza?
Es muy simple, primero se configura y luego se ejecuta el reporte.
    //Carga del módulo
    var nodePrd=require('node-prd');
    var path=require('path');

    // Configuración de la instancia:
    // primer parámetro: json con información para procesar el reporte
    // segundo parámetro: configuración de entorno 
    var nPrd=nodePrd.createInstance(
        { //Información para procesar el reporte
            reportBundlePath: "/home/mariano/report.prpt",
            outputFilePath: path.resolve("./out/report"),
            outputType: "pdf",
            params: [
                {name : "minId", value : 4, type:"Integer"},
                {name : "title", value : 'Titulo: '+ new Date(), type : "String"},
                {name : "subtitle1", value : 'Sub titulo 1', type : "String"},
                {name : "subtitle2", value : 'Sub titulo 2', type : "String"}
            ]
        },
        { // Configuración de entorno
            prdHomePath : '/home/mariano/pentaho/prd4',
            tmpParentFolder : '.'
        }
    );

    // Versión del módulo 
    console.log('node-prd version: '+nPrd.getVersion());
    console.log('Running report...');

    nPrd.runReport(function(code){
        if(code==0)
            console.log("Report OK");
        else
            console.log("Report ERROR="+code);
    },false,true);

<a name="configurarReporte"/>
### Información para procesar el reporte

- reportBundlePath (obligatorio): es la localización del paquete que contiene el reporte PRD.
  Ejemplo: reportBundlePath: '/home/magm/report.prpt'
 
- outputFilePath (obligatorio): es la localización del archivo de salida, con o sin extensión (ver también: outputType)
  Ejemplo: outputFilePath:'/home/magm/report.pdf'


- outputType (obligatorio): es el formato de lsalida. Los valores posibles son: pdf, excel, excelXlsx, rtf o html.
  En caso de formato de salida html, se requiere un valor para: htmlFolder
  Ejemplo: outputType: 'pdf'


- htmlFolder (obligatorio en caso de que outputType=html): es el nombre que se utilizará para crear una carpeta a partir de la carpeta padre establecida en outputFilePath.
  En esta carpeta se colocan los archivos que componen la salida HTML. La página principal tendrá en nombre especificado en : outputFilePath  
  Se recomienda que esta carpeta pueda se servida desde la aplicación web.


- params (opcional): arreglo de objetos que representan los parámetros del reporte.
  Cada objeto contiene los siguientes atributos:
  - name: el nombre del parámetro definido en el reporte. Atención: el nombre es sensitivo a minúsculas/mayúsculas
  - value: el valor del parámetro
  - type: el tipo de datos del parámetro. Los valores posibles son: Integer, Long, Double, Float, Date y String por ahora.
    Los valores numéricos no van entrecomillados y el separador decimal debe ser un punto y no una coma, los valores Date deben tener formto  unix timestamp

### La configuración para procesar el reporte:
- puede cambiarse llamando al método setConfig(otherConfig) 
- u obtenerse con el método getConfig()

### Configuración de entorno
- prdHomePath (opcional): es path al home (carpeta en la cual está instalado) de Pentaho Report Designer. Si no se especifica, el módulo intentará obtener el valor de la variable de entorno llamada PRD_HOME. Una de las dos (el parámetro o la variable de entorno) se debe establecer. 
- tmpParentFolder (opcional): carpeta que contendrá la carpeta tmp. Si no se especifica, se utiliza el directorio actual (process.cwd()).

### Método runReport(cb, logOut, logErr)
Recibe tres parámetros:
- cb: función de retrollamada que será ejecutada cuando finalice la ejecución del reporte. Recibe como parámetro un número entero (code) que contiene el ERROR_LEVEL, si es igual 0 el reporte se ha generado, caso contrario hubo un error.
- logOut: valor booleano que indica si queremos ver la salida estándar.
- logErr: valor booleano que indica si queremos ver la salida de error.

### Reporte como Servicio (RaaS)
Para soportar alta concurrencia, node-prd implementa RaaS. Consta de 3 pasos:

1) Iniciar el servidor.

        nPrd.initRaaS(port, logOut, logErr);

- port: puerto del servidor RaaS
- logOut: valor booleano que indica si queremos ver la salida estándar.
- logErr: valor booleano que indica si queremos ver la salida de error.

2) [Configurar](#configurarReporte) y ejecutar reporte.

        nPrd.runRaaS(cb);

- cb: función de retrollamada que será ejecutada cuando finalice la ejecución del reporte. Recibe como parámetro un objeto JSON que contiene el código y el mensaje con información acerca del resultado de la ejecución. Formato: {code: nnnn, msg:'xxxxx'}, code=0 msg='OK'

3) Detener el servidor cuando no se requiera.

        nPrd.stopRaaS();

### Cambio de fuente de datos
Por defecto, cuando se ejecuta un reporte se utiliza la fuente de datos embebida en el reporte.

Para implementar una fuente de datos alternativa, en primer lugar, se debe agregar el atributo dataFactory.

dataFactory: es el atributo que define una fuente de datos alternativa.

Si se desea cambiar la fuente de datos, primero hay que seleccionar la correcta. 
Las opciones son: NamedStatic, Sql, XPath, Kettle y BandedMDX.

ara seleccionar el typo de fuente de datos, se debe insertar el atributo type dentro de dataFactory

type: el tipo de fuente de datos a implementar. Los valores posibles son: NamedStatic, Sql, XPath, Kettle y BandedMDX.


#### NamedStatic: los datos se envían desde la aplicación node en formato json.

  Ejemplo de configuración:

      "dataFactory" : {
          "type" : "NamedStatic",
          "columnNames" : ["idZona","Zona"],
          "columnTypes" : ["Integer","String"],
          "data" : [
              [1,"este"],
              [2,"oeste"],
              [3,"norte"],
              [4,"sur"]
           ]
      }

- columnNames: arreglo que contiene los nombres de las columnas. Hay que tener en cuenta que los nombres se definen exactamente como están definidos en el reporte. El número de columnas definido aquí, define el número de columnas en los datos.
- columnTypes: contiene los tipos de datos para cada una d elas columnas definidas en columnNames.
- data: arreglo bi-dimensional conteniendo los datos.

#### Sql: permite definir los datos de la conexión JDBC y la consulta SQL.

  Ejemplo de configuración:

      "dataFactory" : {
          "type" : "Sql",
          "jdbcConfig" : {
              "driver" : "com.mysql.jdbc.Driver",
              "url" : "jdbc:mysql://localhost:3306/practico",
              "user" : "root",
              "password" : "root"   
          },
          "query" : "SELECT idZona, Zona FROM Zonas WHERE idZona<=${minId}"
      }

- jdbcConfig: es un objeto json que contiene los 4 atributos necesarios para establecer una conexión JDBC
- query: consulta SQL que puede contener parámetros en la forma ${paramName}.

### Requieres más controladores JDBC?
Si requieres un nuevo controlador JDBC para una fuente de datos, solo hayq que descargar el driver JDBC y colocarlo en la carpeta [PRD_HOME]/lib/jdbc.


## TODO
- Implementar: XPathDataFactory, KettleDataFactory y BandedMDXDataFactory
- Crear un sitio web de ejemplo con express/jade
- Hacer que funcione en Windows & Mac
- Agregar más tipos de parámetros (StringList, etc)
- Auto test
- Alguna idea o propuesta?

## Licencia

Copyleft 2012 Mariano García Mattío

node-prd es 100% GNU GPLv3 

*******************************
*******************************
*******************************

<a name="a2"/>

# English documentation

## Install

    npm install node-prd


## What is This? 
node-prd is a node.js module that allows to execute Pentaho Reports (PRD) from node.js application.


## Prerequisites

- Java Development Kit (JDK) 1.6 or later
- Pentaho Report Designer 3.9 or 4.0
- Linux, Windows (not yet available) or MacOS (not yet available)
- Environment variable PRD_HOME pointing to folder of PRD


## How to use
It is very simple, in first place set the configuration and later run the report.
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
            outputType: "pdf",
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
<a name="configureReport"/>
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
  - name: te name of prd report parameter. Attention: the name is case sensitive
  - value: the value of parameter
  - type: the data type of parameter. Possible values are: Integer, Long, Double, Float, Date and String for now.
    Numeric values are not quoted and decimal separator must be a point, not an comma, Date value must be unix      timestamp format

### The configuration to process report:
- Can be changed by calling setConfig(otherConfig)
- Or obtained with the method getConfig()

### Configuration environment 
- prdHomePath (optional): is the path to Pentaho Report Designer Home. If not specified, module try to use the environment variable named PRD_HOME. One of two (the parameter or the environment variable) must be set 
- tmpParentFolder (optional): folder containing the tmp folder. If not set, current directory (process.cwd()) is used.

### Method runReport (cb, logOut, logErr)
It takes three parameters:
- cb: callback function that will be executed when ends execution of the report. Receives as a parameter an integer (code) that contains the ERROR_LEVEL, if equals 0 the report has been generated, otherwise an error code.
- logOut: boolean value indicating if seen the standard output.
- logErr: boolean value indicating if seen the error output

### Report as a Service (RaaS)
To support high concurrency, node-prd implements RAAS. Consists of three steps:

1) Start the server.

        nPrd.initRaaS(port, logout, logErr);

- port: port number for RaaS Server
- logOut: boolean value indicating if seen the standard output.
- logErr: boolean value indicating if seen the error output

2) [Configure] (#configureReport) and run report.

        nPrd.runRaaS(cb);

- cb: callback function that will be executed when ends execution of the report. Receives as a parameter an JSON object that contains the code and message with information about execution result. Format: {code: nnnn, msg:'xxxxx'}, code=0 msg='OK'

3) Stop the server when not required.

       nPrd.stopRaaS();

### Change data sources
By default, when you run a report is used as the data source the embeded data source.

To implement an alternative data source, in the first place, must be added the attribute dataFactory.

dataFactory: is the attribute that defines an alternative data source.

If you want change data source, first must be select the correct. 
The options are: NamedStatic, Sql, XPath, Kettle and BandedMDX.

To select the type of data source, we must insert the type attribute within dataFactory

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

#### Sql: permite definir los datos de la conexión JDBC y la consulta SQL.

  Ejemplo de configuración:

      "dataFactory" : {
          "type" : "Sql",
          "jdbcConfig" : {
              "driver" : "com.mysql.jdbc.Driver",
              "url" : "jdbc:mysql://localhost:3306/practico",
              "user" : "root",
              "password" : "root"   
          },
          "query" : "SELECT idZona, Zona FROM Zonas WHERE idZona<=${minId}"
      }

- jdbcConfig: es un objeto json que contiene los 4 atributos necesarios para establecer una conexión JDBC.
- query: consulta SQL que puede contener parámetros en la forma ${paramName}.

### Need more JDBC Drivers?
If you need a new JDBC driver for one data source, simply download JDBC driver and put it in the folder [PRD_HOME]/lib/jdbc.


## TODO
- Implement: XPathDataFactory, KettleDataFactory and BandedMDXDataFactory
- Build an example web site with express/jade
- Make it work on Windows & Mac
- Add more parameter types (StringList, etc)
- Auto test
- Do you have any idea?

## License

Copyleft 2012 Mariano García Mattío

node-prd is 100% licensed GNU GPLv3 