const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

// SET Breadcrumbs - useful for relative templates
router.use('/', (req, res, next) => {
    res.locals.currentURL = req.originalUrl; //current screen
    res.locals.prevURL = req.get('Referrer'); // previous screen
    console.log('previous page:: ' + res.locals.prevURL + '\ncurrent page: ' + req.url + ' ' + res.locals.currentURL );
    next();
    // if (!req.session.data['breadcrumbs']) {
    //     req.session.data['breadcrumbs'] = [];
    // }
    
    // req.session.data['breadcrumbs'].push({'title': 'page title', 'url': res.locals.prevURL});
});

module.exports = router
