### Run by docker
```bash
sudo docker run \
 --name mp3-tag-server \
 -p 3005:3005 \
 --volume /home/peter/music:/music \
 developercyrus/mp3-tag-server
```

### Run by CLi
```bash
git clone https://github.com/developercyrus/mp3-tag-server-v2
npm install

export MUSIC=/home/peter/music
node index.js
```




