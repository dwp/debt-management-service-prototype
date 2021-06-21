const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

// SET Breadcrumbs - useful for relative templates
router.use('/', (req, res, next) => {
    res.locals.currentURL = req.originalUrl; //current screen
    res.locals.prevURL = req.get('Referrer'); // previous screen
    // console.log('\nprevious page: ' + res.locals.prevURL + '\ncurrent page: ' + res.locals.currentURL );
    console.log('previous page:: ' + res.locals.prevURL + '\ncurrent page: ' + req.url + ' ' + res.locals.currentURL );

    //console.log('\nsession data:\n' + JSON.stringify(req.session.data, null, 2)) + '\n\n';
        
    // if (!req.breadcrumbs) {
    //     req.breadcrumbs = [];
    // }

    if (!req.session.data['breadcrumbs']) {
        req.session.data['breadcrumbs'] = {};
    } 

    if (!req.session.data['backLinks']) {
        req.session.data['backLinks'] = [];
    } 

    // console.log('\nBreadcrumbs:\n' + JSON.stringify(req.session.data.breadcrumbs, null, 2)) + '\n\n';
    

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
        person.totalRecoverableBalance = 0;
        person.totalRepaid = 0;

        // Get total original balance from reoverable debts
        for (const i in person.debts) {
            const debt = person.debts[i];
            debt.repaid = 0;

            // check if debt is recoverable
            if (debt.status == 'recover') {
                // add allocation to generate total repaid
                person.totalRecoverableBalance = person.totalRecoverableBalance + debt.originalBalance;
            }
        }

        // Get total repaid across all allocations of all repayments
        for (const i in person.repayments) {
            const repayment = person.repayments[i];

            for (const i in repayment.allocations) {
                const allocation = repayment.allocations[i];

                // find debt for this allocation and add the allocation to the repaid value
                const debt = person.debts.find(debt => debt.id === allocation.debtId);
                debt.repaid = debt.repaid + allocation.amount;

                // add allocation to generate total repaid
                person.totalRepaid = person.totalRepaid + allocation.amount;
            }
        }


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
        debt.repaid = 0; // 0 repaid value to prevent increments on refreshes
        const repayments = []

        for (const i in req.person.repayments) {
            const repayment = req.person.repayments[i]

            // get repayment data only related to this debt
            repayment.allocations.filter(allocation => {
                
                if ( allocation.debtId == debt.id ) {
                    repayments.push({
                        'id': repayment.id,
                        'datetime': repayment.datetime,
                        'method': repayment.method, 
                        'amount': allocation.amount});

                    // add allocation to generate total repaid if not previously calculated
                    debt.repaid = debt.repaid + allocation.amount;
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
        repayment.repaid = 0; // 0 repaid value to prevent increments on refreshes

        // get debt data only related to this repayment
        for (const i in repayment.allocations) {
            const allocation = repayment.allocations[i]
            
            req.person.debts.filter(debt => {
                
                if ( debt.id == allocation.debtId ) {
                    debts.push({
                        'id': debt.id,
                        'accountId': debt.accountId,
                        'title': debt.title,
                        'amount': allocation.amount});
                }
            })

            
            repayment.repaid = repayment.repaid + allocation.amount;
        }

        req.repayment = repayment
        req.debts = debts
        next()
    } else {
        next(new Error('failed to load repayment'))
    }
})

// get the person details from the session data and attach it to the request object
router.param('orderCode', function (req, res, next, orderCode) {
    
    const cardPayment = req.debt.cardPayments.find( ({ orderCode }) => orderCode == orderCode );

    if (cardPayment) {
        req.CardPayment = cardPayment
        next()
    } else {
        next(new Error('failed to load card payment'))
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

// back button
router.get('/back', function (req, res, next) {

    req.session.data.backLinks.pop()

    if (req.session.data.backLinks.length) {
        
        res.redirect(req.session.data.backLinks[req.session.data.backLinks.length - 1]);
        
    } else {
        res.redirect(req.session.data.breadcrumbs.debtSummary.url);
    }
})


// get person summary
router.get('/scenario/:scenario/v/:versionId/person/:personId', function (req, res, next) {

    // set path for the senario's templates
    req.scenarioPath = req.scenario + '-v' + req.versionId + '/'

    // reset breadcrumbs as this is current start
    req.session.data.breadcrumbs = {};
    req.session.data.backLinks = [];

    // add summary to breadcrumbs
    req.session.data.breadcrumbs.debtSummary = {
        text: 'Debt Summary', 
        url: res.locals.currentURL };

        addToList(req.session.data.backLinks, res.locals.currentURL);
    
    res.render( req.scenarioPath + 'debt-summary.html', {
        ScenarioPath: req.scenarioPath,
        Breadcrumbs: req.session.data.breadcrumbs,
        Person: req.person
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

        addToList(req.session.data.backLinks, res.locals.currentURL);
    
    res.render( req.scenarioPath + 'debt-details.html', {       
        ScenarioPath: req.scenarioPath,
        Breadcrumbs: req.session.data.breadcrumbs,
        Person: req.person,
        Debt: req.debt,
        Repayments: req.repayments
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

    addToList(req.session.data.backLinks, res.locals.currentURL);
    
    res.render( req.scenarioPath + 'repayment-details.html', {
        ScenarioPath: req.scenarioPath,
        Breadcrumbs: req.session.data.breadcrumbs,
        Person: req.person,
        Repayment: req.repayment,
        Debts: req.debts
    });
})

// step 1 for card payment - order number
router.get('/scenario/:scenario/v/:versionId/person/:personId/debt-details/:debtId/card-payment-order-code', function (req, res, next) {
 

    // set path for the senario's templates
    req.scenarioPath = req.scenario + '-v' + req.versionId + '/'

    addToList(req.session.data.backLinks, res.locals.currentURL);

    let cardPayment;

    console.log('======== initialise card payment');
    console.log(cardPayment);

    // Card process details
    if (!('cardPayments' in req.debt)) {
        req.debt.cardPayments = []
    } 
    
    if ( !req.debt.cardPayments.length || req.debt.cardPayments[req.debt.cardPayments.length - 1].paymentCompleted ){

        cardPayment = {
            'orderCode':    'DM11-' + 
                            req.person.nino.replace(/\s/g, '') + '-' + 
                            req.debt.accountId + '-' + 
                            GetFormattedDate(new Date(), '') + '-' + 
                            req.person.lastname.toUpperCase() + '-' + 
                            (req.debt.cardPayments.length + 1),
            'paymentSuccessful': null,
            'amount': null,
            'paymentCompleted': false
        };

        console.log('======== after assigned card payment');
        console.log(cardPayment);

        
        req.debt.cardPayments.push(cardPayment);
    } else {
        // get the last card payment created
        console.log('get the last card payment created');
        cardPayment = req.debt.cardPayments[req.debt.cardPayments.length - 1];
    } 

    req.cardPayment = cardPayment;

    console.log('======== last bit card payment');
        console.log(cardPayment);
    console.log(req.cardPayment);
    
    res.render( req.scenarioPath + 'card-payment-step-1.html', {
        ScenarioPath: req.scenarioPath,
        Breadcrumbs: req.session.data.breadcrumbs,
        Person: req.person,
        Debt: req.debt,
        CardPayment: req.cardPayment

    });
})

// step 2 for card payment - payment successful question
router.get('/scenario/:scenario/v/:versionId/person/:personId/debt-details/:debtId/card-payment-outcome/:orderCode', function (req, res, next) {
 

    // set path for the senario's templates
    req.scenarioPath = req.scenario + '-v' + req.versionId + '/'

    addToList(req.session.data.backLinks, res.locals.currentURL);

    res.render( req.scenarioPath + 'card-payment-step-2.html', {
        ScenarioPath: req.scenarioPath,
        Breadcrumbs: req.session.data.breadcrumbs,
        Person: req.person,
        Debt: req.debt,
        CardPayment: req.CardPayment
    });
})

// step 3 for card payment - payment amount question
router.get('/scenario/:scenario/v/:versionId/person/:personId/debt-details/:debtId/card-payment-amount/:orderCode', function (req, res, next) {
 

    // set path for the senario's templates
    req.scenarioPath = req.scenario + '-v' + req.versionId + '/'

    addToList(req.session.data.backLinks, res.locals.currentURL);


    // update data in json from step 2 whilst still in request, and remove the default value
    console.log('============== POST ============') ;
    console.log(req.session.data.cardPaymentForm);
    req.CardPayment.paymentSuccessful = ( req.session.data.cardPaymentForm.paymentSuccessful === 'true'? true : false );

    console.log(req.CardPayment);
    console.log('============== END POST ============') ;
   
    res.render( req.scenarioPath + 'card-payment-step-3.html', {
        ScenarioPath: req.scenarioPath,
        Breadcrumbs: req.session.data.breadcrumbs,
        Person: req.person,
        Debt: req.debt,
        CardPayment: req.cardPayment
    });
})

// Generic functions - not sure where to put this... will find a better place

function GetFormattedDate(datetime, separator = "/") {
    const date = new Date(datetime);

    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();

    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    return day + separator + month + separator + year;
}

// add to array only if last value is not equal to new value
function addToList(arr, item){

    const lastItem = arr[arr.length - 1];

    if (lastItem != item){
        arr.push(item)
    }
}

module.exports = router
