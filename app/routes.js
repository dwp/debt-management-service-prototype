const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

// SET Breadcrumbs - useful for relative templates
router.use('/', (req, res, next) => {
    res.locals.currentURL = req.originalUrl; //current screen
    res.locals.prevURL = req.get('Referrer'); // previous screen
    console.log('\nprevious page: ' + res.locals.prevURL + '\ncurrent page: ' + res.locals.currentURL );
    // console.log('previous page:: ' + res.locals.prevURL + '\ncurrent page: ' + req.url + ' ' + res.locals.currentURL );

    // console.log('\nsession data:\n' + JSON.stringify(req.session.data, null, 2)) + '\n\n';
    // if (!req.breadcrumbs) {
    //     req.breadcrumbs = [];
    // }

    if (!req.session.data['breadcrumbs']) {
        req.session.data['breadcrumbs'] = {};
    } 

    console.log('/ \n' + req.session.data['breadcrumbs']);

    next();
});

// =========== Set scenario and version for templates ===================

// get the scenario
router.param('scenario', function (req, res, next, scenario) {
    
    if (scenario) {
        req.scenario = scenario
        next()
    } else {
        next(new Error('failed to set scenario'))
    }
})

//get the scenario version
router.param('versionId', function (req, res, next, versionId) {

    if (versionId) {
        req.versionId = versionId
        next()
    } else {
        next(new Error('failed to set scenario version'))
    }
})

// =========== Get details based on router params ===================

// get the person details from the session data and attach it to the request object
router.param('personId', function (req, res, next, personId) {
    
    const person = req.session.data.people.find( ({ id }) => id == personId );

    if (person) {
        req.person = person
        next()
    } else {
        next(new Error('failed to load person'))
    }
})

// get debt details and associated repayments
router.param('debtId', function (req, res, next, debtId) {
    
    const debt = req.person.debts.find( ({ id }) => id == debtId )
    
    if (debt) {
        const repayments = []

        for (const i in req.person.repayments) {
            const repayment = req.person.repayments[i]

            // get repayment data only related to this debt
            repayment.allocations.filter(allocation => {
                
                if ( allocation.debtId == debt.id ) {
                    repayments.push({
                        'id': repayment.id,
                        'date': repayment.date,
                        'method': repayment.method, 
                        'amount': allocation.amount});
                }
            })

        }

        req.debt = debt
        req.repayments = repayments
        next()
    } else {
        next(new Error('failed to load debt'))
    }
})

// get repayment details and associated debts
router.param('repaymentId', function (req, res, next, repaymentId) {
    
    const repayment = req.person.repayments.find( ({ id }) => id == repaymentId )
    const debts = []

    if (repayment) {

        // get debt data only related to this repayment
        for (const i in repayment.allocations) {
            const allocation = repayment.allocations[i]
            
            req.person.debts.filter(debt => {
                
                if ( debt.id == allocation.debtId ) {
                    debts.push({
                        'id': debt.id,
                        'title': debt.title,
                        'amount': allocation.amount});
                }
            })
        }

        req.repayment = repayment
        req.debts = debts
        next()
    } else {
        next(new Error('failed to load debt'))
    }
})

// =========== Multiple Advances v1 Routes ===================

// get person summary
router.get('/multiple-advances-v1/person/:personId', function (req, res, next) {

    // reset breadcrumbs as this is current start
    req.session.data.breadcrumbs = {};

    // add summary to breadcrumbs
    req.session.data.breadcrumbs.debtSummary = {
        text: 'Debt Summary', 
        url: req.originalUrl };

    res.render('multiple-advances-v1/debt-summary.html', {
        Person: req.person,
        Breadcrumbs: req.session.data.breadcrumbs
    });
})

//myArray.filter(x => x.id === '45').map(x => x.debts);

// get debt details
router.get('/multiple-advances-v1/person/:personId/debt-details/:debtId', function (req, res, next) {
 
    // if already visited the debt details page, remove it from breadcrumbs
    if ( 'debtDetails' in req.session.data.breadcrumbs) {
        delete req.session.data.breadcrumbs.debtDetails
    } 

    // add debt details to breadcrumbs
    req.session.data.breadcrumbs.debtDetails = { 
        text: req.debt.title, 
        url: req.originalUrl };

    res.render('multiple-advances-v1/debt-details.html', {
        Person: req.person,
        Debt: req.debt,
        Repayments: req.repayments,
        Breadcrumbs: req.session.data.breadcrumbs
    });
})

// get repayment details
router.get('/multiple-advances-v1/person/:personId/repayment-details/:repaymentId', function (req, res, next) {

    // if already visited the repayemt details page, remove it from breadcrumbs
    if ( 'repaymentDetails' in req.session.data.breadcrumbs) {
        delete req.session.data.breadcrumbs.repaymentDetails
    } 
    // add repayment details to breadcrumbs
    req.session.data.breadcrumbs.repaymentDetails = { 
        text: req.repayment.method + ' - ' + req.repayment.date, 
        url: req.originalUrl };

    res.render('multiple-advances-v1/repayment-details.html', {
        Person: req.person,
        Repayment: req.repayment,
        Debts: req.debts,
        Breadcrumbs: req.session.data.breadcrumbs
    });
})

// =========== Dynamic Routes ===================

// get person summary
router.get('/scenario/:scenario/v/:versionId/person/:personId', function (req, res, next) {

    // set path for the senario's templates
    req.scenarioPath = req.scenario + '-v' + req.versionId + '/'

    // reset breadcrumbs as this is current start
    req.session.data.breadcrumbs = {};

    // add summary to breadcrumbs
    req.session.data.breadcrumbs.debtSummary = {
        text: 'Debt Summary', 
        url: res.locals.currentURL };

        

    res.render( req.scenarioPath + 'debt-summary.html', {
        Person: req.person,
        Breadcrumbs: req.session.data.breadcrumbs,
        ScenarioPath: req.scenarioPath
    });
})

//myArray.filter(x => x.id === '45').map(x => x.debts);

// get debt details
router.get('/scenario/:scenario/v/:versionId/person/:personId/debt-details/:debtId', function (req, res, next) {
 

    // set path for the senario's templates
    req.scenarioPath = req.scenario + '-v' + req.versionId + '/'

    // if already visited the debt details page, remove it from breadcrumbs
    if ( 'debtDetails' in req.session.data.breadcrumbs) {
        delete req.session.data.breadcrumbs.debtDetails
    } 

    // add debt details to breadcrumbs
    req.session.data.breadcrumbs.debtDetails = { 
        text: req.debt.title, 
        url: res.locals.currentURL };

    res.render( req.scenarioPath + 'debt-details.html', {
        Person: req.person,
        Debt: req.debt,
        Repayments: req.repayments,
        Breadcrumbs: req.session.data.breadcrumbs,
        ScenarioPath: req.scenarioPath
    });
})

// get repayment details
router.get('/scenario/:scenario/v/:versionId/person/:personId/repayment-details/:repaymentId', function (req, res, next) {

    // set path for the senario's templates
    req.scenarioPath = req.scenario + '-v' + req.versionId + '/'

    // if already visited the repayemt details page, remove it from breadcrumbs
    if ( 'repaymentDetails' in req.session.data.breadcrumbs) {
        delete req.session.data.breadcrumbs.repaymentDetails
    } 
    // add repayment details to breadcrumbs
    req.session.data.breadcrumbs.repaymentDetails = { 
        text: req.repayment.method + ' - ' + GetFormattedDate(req.repayment.datetime), 
        url: res.locals.currentURL };

    res.render( req.scenarioPath + 'repayment-details.html', {
        Person: req.person,
        Repayment: req.repayment,
        Debts: req.debts,
        Breadcrumbs: req.session.data.breadcrumbs,
        ScenarioPath: req.scenarioPath
    });
})

function GetFormattedDate(datetime) {
    const date = new Date(datetime);

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    return month + "/" + day + "/" + year;
}

module.exports = router
