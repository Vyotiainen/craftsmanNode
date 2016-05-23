'use strict';

var Percolator = require('percolator').Percolator;
var dbSession = require('../../src/backend/dbSession.js');

var port = 8080;
var Server = function(port) {
    var server = Percolator({'port':port, 'autoLink': false, "staticDir": __dirname+'/../frontend'});

    server.route('/api/keywords', 
        {
            GET: function(req, res) {
                dbSession.fetchAll('select id, value, categoryID from keyword Order by id', function(err, rows) {
                    if(err) {
                        console.log(err);
                        res.status.internalServerError(err);
                    } else {
                        res.collection(rows).send();
                    }
                });
            },
            
            POST: function(req, res) {
                req.onJson(function(err, newKeyword) {
                    if(err) {
                        console.log(err + " row 26");
                        res.status.internalServerError(err);
                    } else {
                        dbSession.query('insert into keyword (value, categoryID) values (?,?);', [newKeyword.value, newKeyword.categoryID], function(err) {
                            if(err) {
                                console.log(err + " row 31");
                                res.status.internalServerError(err);
                            } else {
                                res.object({'status':'ok'}).send();
                            }
                        });
                    }
                });
            }
        }
    ); 
    
    server.route('/api/keywords/categories',
        {
            GET: function(req,res) {
                dbSession.fetchAll('select id, name from category order by id', function(err, rows) {
                    if(err) {
                        console.log(err);
                        res.status.internalServerError(err);
                    } else {
                        res.collection(rows).send();
                    }
                });
            }
        }
    );
    
    server.route('/api/keywords/:id', 
        {
            POST: function(req, res) {
                var keywordId = req.uri.child();
                req.onJson(function(err, keyword) {
                    if(err) {
                        console.log(err);
                        res.status.internalServerError(err);
                    } else {
                        dbSession.query('update keyword set value = ?, categoryID = ? where keyword.id = ?;', [keyword.value, keyword.categoryID, keywordId], function(err) {
                            if(err) {
                                console.log(err);
                                res.status.internalServerError(err);
                            } else {
                                res.object({'status':'ok'}).send();
                            }
                        });
                    }
                });
            },
            
            DELETE: function(req, res) {
                var keywordId = req.uri.child();
                dbSession.query('delete from keyword where keyword.id = ?', [keywordId], function(err, result) {
                    if(err) {
                        console.log(err);
                        res.status.internalServerError(err);
                    } else {
                        res.object({'status':'ok'}).send();
                    }
                });
            }
        }
    );
    
    return server;
}

module.exports = {'Server': Server};