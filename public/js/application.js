function RadioClient(){
  if (! (this instanceof arguments.callee)){
    return new arguments.callee(arguments);
  }
  var self = this;
  
  this.init = function(){
    self.setupBayeuxHandlers();
    self.getDJ();
  };
  
  this.setupBayeuxHandlers = function() {
    $.getJSON("/config", function (config) {
      self.client = new Faye.Client("http://" + window.location.hostname + ':' + config.port + '/faye', {
        timeout: 120
      });

      self.client.subscribe('/track', function (message) {
        var track = message.track;
        if (track == 'offline'){
          self.goOffline();
        }else{
          self.nextTrack(track);
        }
      });
    });
  };
  
  this.getDJ = function(){
    $.get('/dj', function(data) {
      if (data == ''){
        self.goOffline();
      }else{
        self.goOnline(data);
      }
    });
  };
  
  this.startPlayer = function(){
    $("#jplayer").jPlayer({
      ready: function () {
        $(this).jPlayer("setMedia", {
          mp3: "/stream.mp3",
          oga: "/stream.ogg"
        }).jPlayer("play");
      },
      swfPath: "/public",
      supplied: "mp3, oga"
    });
  };
  
  this.stopPlayer = function(){
    $("#jplayer").jPlayer("clearMedia");
  };
  
  this.goOnline = function(dj){
    $('#dj').html(dj);
    self.startPlayer();
  };
  
  this.goOffline = function(){
    $('#current_dj').hide();
    $('#current_track').html("A rádio está offline. Tente recarregar o navegador ou tente mais tarde.");
    self.stopPlayer();
  };
  
  this.nextTrack = function(track){
    // Don't show the next track immediately since the stream delay is about 15 seconds, so we don't want to spoil out 
    // what the next track is gonna be 15 seconds before it actually starts. It's ok to show it immediately if 
    // there was nothing playing (or if you just connected to the stream).
    var current = $('#track').html();
    var time = current == "" ? 1 : 20;
    setTimeout(function() {
      $('#track').html(track);
    }, time * 1000)
    console.log(track);
  };
  
  this.init();
}

$(function(){
  new RadioClient();
});
