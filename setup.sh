cd /
if [[ ! -d "data" ]]; then
  sudo mkdir data
fi

cd data
if [[ ! -d "coda" ]]; then
  sudo mkdir coda
fi

cd coda
if [[ ! -d "inout" ]]; then
  sudo mkdir inout
fi
if [[ ! -d "src" ]]; then
	sudo mkdir src
fi
