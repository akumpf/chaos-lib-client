// Used under LGPL, same as LAME.
// Thanks to akrennmair -> https://github.com/akrennmair/speech-to-server/blob/master/encoder.js

importScripts('./libmp3lame.js');

var mp3codec; 
self.onmessage = function(e) {
  var mp3data;
  switch (e.data.cmd) {
  case 'init':
    e.data.config = e.data.config||{};
    mp3codec = Lame.init();
    Lame.set_mode(mp3codec, e.data.config.mode || Lame.JOINT_STEREO);
    Lame.set_num_channels(mp3codec, e.data.config.channels || 2);
    Lame.set_out_samplerate(mp3codec, e.data.config.samplerate || 44100);
    Lame.set_bitrate(mp3codec, e.data.config.bitrate || 128);
    Lame.init_params(mp3codec);
    break;
  case 'encode':
    mp3data = Lame.encode_buffer_ieee_float(mp3codec, e.data.buf1, e.data.buf2||e.data.buf1);
    self.postMessage({cmd: 'data', bufSize: mp3data.data.length});
    break; 
  case 'finish':
    mp3data = Lame.encode_flush(mp3codec);
    self.postMessage({cmd: 'end', bufSize: mp3data.data.length, buf: mp3data.data});
    Lame.close(mp3codec);
    mp3codec = null;
    break;
  }
};
