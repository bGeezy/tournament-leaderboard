'use strict';

module.exports = function Leaderboard (input) {
  /*input should be an array of game results, adding to *this for readablity
  letter L is used as this and Leaderboard are confusing and verbose 
  */
  var L = {};

  L.input = arguments[0];

  L.create = function() {
    this.stream = '';
    this.teams = [];
    this.scores = [];
    this.points = [];
    this.board = [] ;
    this.map = [];
    L.populateMasterLists();
    L.convertScoresToPoints();
    L.mapRankingPointsToTeam();
    L.createLeaderboardModel();
    L.formatOutputStream();
    return L.stream;
  }

  //Helper methods tha don't necessarily need to be included on similated class
  L.parseTeams = function (a,b){
    return  [ a.substring(0, a.lastIndexOf(' ')), b.substring(0, b.lastIndexOf(' ')) ];
  }

  L.parseScores = function (a,b){
    return  [ a.substring(a.lastIndexOf(' ')) , b.substring(b.lastIndexOf(' ')) ];
  } 
  //Standard sort function for rearranging by index
  L.applySortOrderToBoard = function(first, second) {
    //Sort by points first
    if (first[1] < second[1]) {
      return 1;
    }else if (first[1] > second[1]) {
      return -1;
    }
    //Otherwise Snakes and FC Awesome wind up out of order
    if (first[0] > second[0]) {
      return 1;
    }else if (first[0] < second[0]) {
      return -1;
    }
    //Final Use case
    return 0;
    
  };

  //Parse string of each match and populate parallel master lists
  L.populateMasterLists = function (){
    for (var  g= 0; g < L.input.length; g++) {
      var split = L.input[g].split(',').map(str => str.trim());
      var points = L.parseScores( split[0], split[1] );
      var names = L.parseTeams( split[0], split[1] );

      //Add each team and score in order to corresponding lists
      L.teams.push( names[0], names[1] );
      L.scores.push( points[0], points[1]);
    }
  };

  //Map scoreboard points to leaderboard points no way around this
  L.convertScoresToPoints = function () {
    for (var i = 0; i < L.teams.length; i+=2) {
      if (L.scores[i] > L.scores[i + 1]) { 
        L.points.push([L.teams[i], 3]);
        L.points.push([L.teams[i + 1], 0]);
      } else if (L.scores[i] < L.scores[i + 1]) {
        L.points.push([L.teams[i + 1], 3]);
        L.points.push([L.teams[i], 0]);
      } else {
        L.points.push([L.teams[i], 1]);
        L.points.push([L.teams[i + 1], 1]);
      } 
    }
  };

  //Relate leaderboard points to de-duped teams, some teams may play more matches
  L.mapRankingPointsToTeam = function () {
    for (var i = 0; i < L.points.length; i++) {
      var team = L.points[i][0];
      var points = L.points[i][1];
      var initial = 0;
      
      if (L.map[team]) initial = L.map[team];

      L.map[team] = initial + points;
    }
  };

  //Prepare a leaderboard model prior to stringifying data for output stream
  L.createLeaderboardModel = function () {
    var data = L.map;
    for (var key in L.map) {
      L.board.push([key, L.map[key]]);
    }
    L.board = L.board.sort(L.applySortOrderToBoard);
  };

  //Combine key value pairs on model with readable text for console
  L.formatOutputStream = function() {
    for (var i = 0; i < L.board.length; i++) {
      var team = L.board[i][0];
      var points = L.board[i][1];
      var rank = i + 1;
      var pts = points===1 ? 'pts' : ' pt';
      var brk = i!==L.board.length-1 ? '\n' : ''; 
      L.stream += i +1+ '. ' + team + ', ' + points + pts + '\n';
    }
  }

  //Exposing a public member to instantate on dataset > Singleton
  console.log(L.create())
}






