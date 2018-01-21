# Create dockerfile

# get OS ubuntu to images
FROM ubuntu:xenial

RUN apt-get update
RUN apt-get -y upgrade

#install dependencies
RUN apt-get install -y git libc6 libgcc1 libgmp10 libgmpxx4ldbl libstdc++6 python python-yaml python-plastex texlive-latex-recommended texlive-fonts-recommended texlive-latex-extra texlive-lang-cyrillic tidy ghostscript make automake g++ libgmp3-dev libboost-system-dev python-pip

#RUN git clone https://github.com/Kattis/problemtools.git
RUN pip install git+https://github.com/kattis/problemtools

#install languages

RUN apt-get install -y default-jdk python3-pip


CMD ["/bin/bash"]
