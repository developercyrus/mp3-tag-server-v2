### Run by docker
```bash
sudo docker run \
 --name mp3-tag-server-v2 \
 -p 3005:3005 \
 --volume /home/peter/music:/music \
 developercyrus/mp3-tag-server-v2
```

### Run by CLi
```bash
git clone https://github.com/developercyrus/mp3-tag-server-v2
npm install

export MUSIC=/home/peter/music
node index.js
```




