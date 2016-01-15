##Extra HTTPd setup
Alias /static "C:/xampp/htdocs/coda/static"

Alias /datafiles "C:/xampp/htdocs/coda/datafiles"

LoadModule wsgi_module modules/mod_wsgi.so

WSGIScriptAlias /coda/api "C:/xampp/htdocs/coda/api/api/wsgi.py"

WSGIPythonPath "C:/xampp/htdocs/coda/api"

WSGIPassAuthorization On

    <Directory "C:/xampp/htdocs/coda/api/api">
        <Files wsgi.py>
            Require all granted
        </Files>
    </Directory>

LoadModule xsendfile_module modules/mod_xsendfile.so

XSendFile On

XSendFilePath "C:/xampp/htdocs/coda/datafiles"
##Windows info
Make sure to download the windows mod_wsgi (32-bit) and place the .so file in the apache modules folder
Also make sure your python is 32-bit to match Apache

##Mac info
Download source (don't use macports) for mod_wsgi, and ./configure using paths to the correct versions of python and apache

##DB Setup
Assumes there is a mysql database running on localhost with user/pword coda/coda, and a database named coda where the user coda has permissions.  This can be configured in the api/api/mysql.cfg file.
Run python reset.py in the api folder to setup the database tables, and populate with some initial test data.  reset will also copy necessary files into coda/static and coda/filedata.  This process is destructive and will drop all tables and delete/overwrite files.