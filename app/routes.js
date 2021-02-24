const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

// SET Breadcrumbs - useful for relative templates
router.use('/', (req, res, next) => {
    res.locals.currentURL = req.originalUrl; //current screen
    res.locals.prevURL = req.get('Referrer'); // previous screen
    console.log('\nprevious page:: ' + res.locals.prevURL + '\ncurrent page: ' + res.locals.currentURL );
    // console.log('previous page:: ' + res.locals.prevURL + '\ncurrent page: ' + req.url + ' ' + res.locals.currentURL );
    

    if (!req.session.data['breadcrumbs']) {
        req.session.data['breadcrumbs'] = {};
    } 

    next();
});

router.get('/multiple-advances-1/debt-summary', function (req, res, next) {

    // reset breadcrumbs as this is current start
    req.session.data.breadcrumbs = {};

    // add summary to breadcrumbs
    req.session.data.breadcrumbs.debtSummary = {
        text: 'Debt Summary', 
        url: '/multiple-advances-1/debt-summary' };

    console.log('\nsession data:\n' + JSON.stringify(req.session.data, null, 2)) + '\n\n';
    next();
})

router.get('/multiple-advances-1/debt-details/:debtId', function (req, res, next)  {

    // if already visited the debt details page, remove it from breadcrumbs
    if ( 'debtDetails' in req.session.data.breadcrumbs) {
        delete req.session.data.breadcrumbs.debtDetails
    } 

    // add debt details to breadcrumbs
    req.session.data.breadcrumbs.debtDetails = { 
        text: 'Debt Details', 
        url: '/multiple-advances-1/debt-details/',
        id: req.params.debtId };

    console.log('\nsession data:\n' + JSON.stringify(req.session.data, null, 2)) + '\n\n';

    res.render('multiple-advances-1/debt-details');
})

router.get('/multiple-advances-1/repayment-details/:repaymentId', function (req, res, next) {

    // if already visited the repayemt details page, remove it from breadcrumbs
    if ( 'repaymentDetails' in req.session.data.breadcrumbs) {
        delete req.session.data.breadcrumbs.repaymentDetails
    } 
    // add repayment details to breadcrumbs
    req.session.data.breadcrumbs.repaymentDetails = { 
        text: 'Repayment Details', 
        url: '/multiple-advances-1/repayment-details/',
        id: req.params.repaymentId };

    console.log('\nsession data:\n' + JSON.stringify(req.session.data, null, 2)) + '\n\n';
    res.render('multiple-advances-1/repayment-details');
})

module.exports = router
