'use strict';

var Percolator = require('percolator').Percolator;
var dbSession = require('../../src/backend/dbSession.js');

var port = 8080;
var server = Percolator({'port':port, 'autoLink': false});

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
        }
    }
);

server.listen(function() {
    console.log('Server started, port', port);
});