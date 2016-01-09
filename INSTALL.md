## Server Configuration
The Coda server runs on an Ubuntu 14.04 Server machine.

### LAMP stack
The following shall setup the server from a raw Ubuntu 14.04 Server installation.

```bash 
sudo apt-get update
sudo apt-get install python-pip apache2 libapache2-mod-wsgi
sudo apt-get install mysql-server libapache2-mod-auth-mysql php5-mysql
sudo mysql_install_db
sudo /usr/bin/mysql_secure_installation
sudo apt-get install php5 libapache2-mod-php5 php5-mcrypt
sudo service apache2 restart
```

## Judge Configuration

### Install lrun
Coda judge is currently built upon lrun. 
Download the [lrun-1.1.4 release](https://github.com/quark-zju/lrun/archive/v1.1.4.tar.gz)

```bash
sudo apt-get install build-essential
sudo apt-get install rake
tar -zxf lrun-1.1.4.tar.gz
cd lrun-1.1.4
sudo groupadd lrun
sudo make install
sudo usermod -a -G lrun {username}
```

lrun requires the current user to be in the lrun group to run.

## Install MySQLdb
```bash
sudo apt-get install python-mysqldb
```

## Install Django
```bash
pip install django
pip install djangorestframework
```

## Build the Front-end
```bash
npm install
gulp
```
The front-end uses angular route with HTML5. To support direct URL access of sub-routes, the server needs to be configured to
redirect request to index.html. For details see the angular route [FAQ](https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-configure-your-server-to-work-with-html5mode).

A sample configuration is show below.
```
<VirtualHost *:443>
  <Directory C:/xampp/htdocs/coda>
      RewriteEngine on

      # Don't rewrite files or directories
      RewriteCond %{REQUEST_FILENAME} -f [OR]
      RewriteCond %{REQUEST_FILENAME} -d
      RewriteRule ^ - [L]

      # Rewrite everything else to index.html to allow html5 state links
      RewriteRule ^ index.html [L]
  </Directory>
</VirtualHost>

<VirtualHost *:80>
  <Directory C:/xampp/htdocs/coda>
      # Redirect all http requests to https
      RewriteEngine on
      RewriteCond %{HTTPS} off
      RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI}
  </Directory>
</VirtualHost>
```
