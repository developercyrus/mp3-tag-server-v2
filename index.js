var id3  = require('node-id3');
var fs   = require('fs');
var find = require('find');
var path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

var resDir = process.env.MUSIC;
var results = []
var public = path.join(__dirname, 'public');


function scan(dir) {
  find.file(dir, function (files) {
    for (let i = 0; i < files.length; i++) {
      if (files[i].toLowerCase().endsWith("mp3")) {
        fs.readFile( files[i], function ( err, data ) {
          if (!err) {
            try {
              id3.read(data, function(err, tags) {
                if (err) {
                  console.log(err);
                }
                else {
                  var obj = new Object();
                  obj.id = i;
                  obj.filename = files[i];
                  if (Object.keys( tags ).length > 0) {
                    obj.tags = tags;
                    if (tags.hasOwnProperty("unsynchronisedLyrics") && tags.unsynchronisedLyrics.text) {
                      obj.lyricshort = tags.unsynchronisedLyrics.text.substring(0, 30) + '...';
                    }
                    else {
                      obj.lyricshort = null;
                    }

                    if (tags.hasOwnProperty("year") && tags.year) {
                      obj.year = tags.year;
                    }
                    else if (tags.hasOwnProperty("recordingTime") && tags.recordingTime) {
                      obj.year = tags.recordingTime;
                    }
                    else {
                      obj.year = null
                    }
                  }
                  else {
                    obj.tags = null;
                  }

                  results.push(obj);
                  if (tags.hasOwnProperty("image") && tags.image.imageBuffer) {
                    //console.log(obj);
                    tags.image.imageBuffer = null;
                  }
                  else {
                    //console.log(JSON.stringify(obj, null, 2));
                  }
                }
              });
            }
            catch(e) {
              console.log(e);
            }
          }
          else {
            console.log(err);
          }
        });
      }
    }
  });
}

// https://stackoverflow.com/a/3230748
// generic comparison function
function cmp(x, y){
    return x > y ? 1 : x < y ? -1 : 0;
};

function sort() {
  results.sort(function(a, b){
    return cmp(
      [cmp(a.tags.artist, b.tags.artist),
       cmp(a.tags.album, b.tags.album),
       cmp(parseInt(a.tags.partOfSet), parseInt(b.tags.partOfSet)),
       cmp(a.tags.trackNumber, b.tags.trackNumber),
       cmp(a.tags.title, b.tags.title)],
      [cmp(b.tags.artist, a.tags.artist),
       cmp(b.tags.album, a.tags.album),
       cmp(parseInt(b.tags.partOfSet), parseInt(a.tags.partOfSet)),
       cmp(b.tags.trackNumber, a.tags.trackNumber),
       cmp(b.tags.title, a.tags.title)]
    );
  });
};

scan(resDir);

app.set('view engine', 'ejs');

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(public));

//app.get('/api', async (req, res) => {
app.get('/api', function (req, res) {
  sort();
  res.status(200).json({
    'results': results
  });
})

app.get('/api/:id', function (req, res) {
  r = [];
  for (let i = 0; i < results.length; i++) {
    if (results[i].id == req.params.id) {
      r.push(results[i]);
      break;
    }
  }
  res.status(200).json({
    'results': r,
  });
})

//app.get('/', async (req, res) => {
app.get('/', function (req, res) {
  res.sendFile(path.join(public, 'index.html'));
});

//app.get('/', async (req, res) => {
app.get('/view/:id', function (req, res) {
  res.render('index', {
    id: req.params.id,
  });
});


app.get("/audio/:id", (req, res) => {
  for (let i = 0; i < results.length; i++) {
    if (results[i].id == req.params.id) {
      f = results[i].filename;
      break;
    }
  }
  res.download(f);
});

app.listen(3005, () => {
  console.log(`listening at http://127.0.0.1:3005`);
})
