var fs = require('fs');

var randomRGB = function randomRGB() {
  var colors = [
    [255, 209, 244],
    [220, 209, 255],
    [209, 255, 220],
    [244, 255, 209],
  ];
  var random = Math.floor(Math.random() * colors.length);
  return colors[random];
};

var randColor = function() {
  return new Buffer(randomRGB());
};

// Createsa BMP Version 2 (Microsoft Windows 2.x)
module.exports = function(width, height, fileName) {
  var rowPadding = new Buffer(width % 4).fill(0);

  //All versions of BMP format files begin with the following 14-byte 'File header'

  //FileType holds a 2-byte magic value used to identify the file type; it is
  //always 4D42h or "BM" in ASCII.
  var fileType = new Buffer('BM');

  // offset 2
  // FileSize is the total size of the BMP file in bytes and should agree with
  // the file size reported by the filesystem. This field only stores a useful
  // value when the bitmap data is compressed, and this value is usually zero
  // in uncompressed BMP files.
  var size = new Buffer([0,0,0,0]);

  //offset 6
  // Reserved1 and Reserved2 do not contain useful data and are usually set to
  // zero in a BMP header written to disk. These fields are instead used by an
  // application when the header is read into memory.
  var reserved1 = new Buffer([0,0]);
  var reserved2 = new Buffer([0,0]);

  //offset 10
  //pixel data offset (4 bytes)
  var pixelOffset = new Buffer([26, 0, 0, 0]);

  var winBmpHeader = Buffer.concat([
    fileType,
    size,
    reserved1,
    reserved2,
    pixelOffset
  ]);

  //Following the file header in v2.x BMP files is a second header called the
  //bitmap header. This header contains information specific to the bitmap
  //data. This header is 12 bytes in length.

  var bmpHeaderSize = new Buffer([12, 0, 0, 0]);
  var bmpWidth = new Buffer([width, 0]);
  var bmpHeight = new Buffer([height, 0]);
  var colorPlan = new Buffer([1, 0]);
  var bitsPerPix = new Buffer([24, 0]);

  var BitmapHeader = Buffer.concat([
    bmpHeaderSize,
    bmpWidth,
    bmpHeight,
    colorPlan,
    bitsPerPix
  ]);

  var finalBuf = Buffer.concat([winBmpHeader, BitmapHeader]);

  for (var i = 0; i <  height; i++) {
    for (var j = 0; j < width; j++) {
      finalBuf = Buffer.concat([finalBuf, randColor()]);
    }
    finalBuf = Buffer.concat([finalBuf, rowPadding]);
  }

  finalBuf = Buffer.concat([finalBuf, new Buffer([0])]);
  fs.writeFile(fileName, finalBuf, function() {
    console.log('finished!');
  });
};
