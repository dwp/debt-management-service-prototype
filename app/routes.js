const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

// SET Breadcrumbs - useful for relative templates
router.use('/', (req, res, next) => {
    res.locals.currentURL = req.originalUrl; //current screen
    res.locals.prevURL = req.get('Referrer'); // previous screen
    console.log('\nprevious page:: ' + res.locals.prevURL + '\ncurrent page: ' + res.locals.currentURL );
    // console.log('previous page:: ' + res.locals.prevURL + '\ncurrent page: ' + req.url + ' ' + res.locals.currentURL );
    
    if (!req.session.data.breadcrumbs) {
        req.session.data.breadcrumbs = [];
    }

    // console.log('\nsession data:\n' + JSON.stringify(req.session.data, null, 2)) + '\n\n';

    next();
});

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

// =========== Routes ===================

// get person summary
router.get('/multiple-advances-2/person/:personId/debt-summary', function (req, res, next) {

    // reset breadcrumbs as this is current start
    // req.session.data.breadcrumbs = {};

    // add summary to breadcrumbs
    // req.session.data.breadcrumbs.debtSummary = {
    //     text: 'Debt Summary', 
    //     url: '/multiple-advances-1/debt-summary' };

    res.render('multiple-advances-2/debt-summary.html', {
        Person: req.person
    });
})

//myArray.filter(x => x.id === '45').map(x => x.debts);

// get debt details
router.get('/multiple-advances-2/person/:personId/debt-details/:debtId', function (req, res, next) {

    res.render('multiple-advances-2/debt-details.html', {
        Person: req.person,
        Debt: req.debt,
        Repayments: req.repayments
    });
})

// get repayment details
router.get('/multiple-advances-2/person/:personId/repayment-details/:repaymentId', function (req, res, next) {

    res.render('multiple-advances-2/repayment-details.html', {
        Person: req.person,
        Repayment: req.repayment,
        Debts: req.debts
    });
})

module.exports = router
