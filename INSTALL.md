## Server Configuration
The Coda server runs on an Ubuntu 14.04 Server machine.

### LAMP stack
The following shall setup the server from a raw Ubuntu 14.04 Server installation.

```bash 
sudo apt-get update
sudo apt-get install apache2
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