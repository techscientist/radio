function PlaylistClient (config) {
  if (! (this instanceof arguments.callee)){
    return new arguments.callee(arguments);
  }
  
  var self = this;
  
  self.config = config;
  
  self.playlists = Playlists; // defined in playlists.js
  
  this.init = function(){
    self.playlist = self.startPlaylist();
    self.playlist.shuffle(true, true);
    self.setupBayeuxHandlers();
    self.setupDOMHandlers();
  };
  
  
  this.startPlaylist = function(){
    return new jPlayerPlaylist({
            jPlayer: "#jplayer",
            cssSelectorAncestor: "#jp_container_1"
        }, self.playlists['rock'], {
            swfPath: "../",
            supplied: "mp3",
            wmode: "window",
            playlistOptions: {autoPlay:true}
        });
  };
  
  this.changePlaylist = function(playlist){
    self.playlist.setPlaylist(self.playlists[playlist]);
    self.playlist.shuffle(true, true);
  }
  
  this.setupBayeuxHandlers = function(){
    self.config.fayeClient.subscribe('/radio', function (message) {
      if (message.track != 'offline'){
        $('#current_dj').html(message.dj);
        $('#current_track').html(message.track);
        $('.online').hide();
        $('.offline').show();
      }
    });
  };
  
  this.setupDOMHandlers = function(){
    $('ul.genres li a').click(function() {
      self.changePlaylist($(this).data('genre'));
    });
  }
  
  this.init();
}

