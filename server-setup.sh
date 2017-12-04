apt-get install git
git config --global user.name "Trackr Production"
git config --global user.email "production@trackrattendance.com"
sudo apt-get update
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo apt-key fingerprint 0EBFCD88
// 9DC8 5822 9FC7 DD38 854A E2D8 8D81 803C 0EBF CD88
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
sudo apt-get update
sudo apt-get install docker-ce
curl -L https://github.com/docker/compose/releases/download/1.17.1/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
sudo usermod -aG docker ${USER}
// log out & back in for changes to take into effect
git clone https://github.com/trackr-attendance/web.git
cd web
docker build -t trackr-attendance-web .
docker-compose up -d