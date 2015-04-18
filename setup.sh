#-----------------------------------------------------
#  
#  Folder structure of coda
#  /data
#    /coda
#      /inout         ... problem inout files
#      /src           ... user src code
#      /ce            ... compilation error messages
#      /checker       ... checker src and executable
#  /sandbox           ... compile and run user program
#  
#-----------------------------------------------------      

cd /

# create /sandbox
if [[ ! -d "sandbox" ]]; then
  sudo mkdir sandbox
  sudo chmod 777 sandbox
fi

# create /data folder

if [[ ! -d "data" ]]; then
  sudo mkdir data
fi


# create /data/coda folder structure
cd data
if [[ ! -d "coda" ]]; then
  sudo mkdir coda
fi
cd coda

# create inout, src and snapshot
if [[ ! -d "inout" ]]; then
  sudo mkdir inout
fi
if [[ ! -d "src" ]]; then
	sudo mkdir src
fi
if [[ ! -d "ce" ]]; then
	sudo mkdir ce
fi
if [[ ! -d "checker" ]]; then
	sudo mkdir checker
fi

