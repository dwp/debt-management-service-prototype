/*

Provide default values for user session data. These are automatically added
via the `autoStoreData` middleware. Values will only be added to the
session if a value doesn't already exist. This may be useful for testing
journeys where users are returning or logging in to an existing application.

============================================================================

Example usage:

"full-name": "Sarah Philips",

"options-chosen": [ "foo", "bar" ]

============================================================================

*/

module.exports = {

  // Insert values here

  "people": [
    {
      "id": 1,
      "scenario": "multiple-advances",
      "version": 1, 
      "name": "David Ross",
      "nino": "QQ 52 23 65 Z",
      "onBenefit": true,
      "benefits": [
        "Universal Credit"
      ],
      "activities": [
        {
          "id": 1,
          "title": "Budgeting Advance received",
          "date": "Mon, 18 Jan 2021 09:00",
          "content": "Claimant received £120 budgeting advance for the purchase of a new fridge."
        },
        {
          "id": 2,
          "title": "Incoming call to Debt Management",
          "date": "Tues, 27 Oct 2020 13:20",
          "content": "Claimant queried about balance remaining on advances."
        },
        {
          "id": 3,
          "title": "Universal Credit Advance (New Claims) received",
          "date": "Wed, 15 July 2020 09:00",
          "content": "Claimant received a second New Claims Advance for £300"
        },
        {
          "id": 4,
          "title": "Universal Credit Advance (New Claims) received",
          "date": "Mon, 6 July 2020 09:00",
          "content": "Claimant received a New Claims Advance for £240"
        }
      ],
      "debts": [
        {
          "id": 3,
          "title": "Budgeting Advance",
          "originalBalance": 120,
          "debtStart": "18/01/2020"
        },
        {
          "id": 2,
          "title": "Universal Credit Advance (New Claims) 2",
          "originalBalance": 300,
          "debtStart": "15/07/2020"
        },
        {
          "id": 1,
          "title": "Universal Credit Advance (New Claims) 1",
          "originalBalance": 240,
          "debtStart": "06/07/2020"
        }
      ],
      "repayments": [
        {
          "id": 1,
          "datetime": "12/02/2021",
          "method": "Universal Credit Deduction",
          "allocations": [
            {
              "debtId": 1,
              "amount": 20
            },
            {
              "debtId": 2,
              "amount": 25
            },
            {
              "debtId": 3,
              "amount": 10
            }
          ]
        },
        {
          "id": 2,
          "datetime": "12/01/2021",
          "method": "Universal Credit Deduction",
          "allocations": [
            {
              "debtId": 1,
              "amount": 20
            },
            {
              "debtId": 2,
              "amount": 25
            }
          ]
        },
        {
          "id": 3,
          "datetime": "12/12/2020",
          "method": "Universal Credit Deduction",
          "allocations": [
            {
              "debtId": 1,
              "amount": 20
            },
            {
              "debtId": 2,
              "amount": 25
            }
          ]
        },
        {
          "id": 4,
          "datetime": "12/11/2020",
          "method": "Universal Credit Deduction",
          "allocations": [
            {
              "debtId": 1,
              "amount": 20
            },
            {
              "debtId": 2,
              "amount": 25
            }
          ]
        },
        {
          "id": 5,
          "datetime": "12/10/2020",
          "method": "Universal Credit Deduction",
          "allocations": [
            {
              "debtId": 1,
              "amount": 20
            },
            {
              "debtId": 2,
              "amount": 25
            }
          ]
        },
        {
          "id": 6,
          "datetime": "12/09/2020",
          "method": "Universal Credit Deduction",
          "allocations": [
            {
              "debtId": 1,
              "amount": 20
            },
            {
              "debtId": 2,
              "amount": 25
            }
          ]
        },
        {
          "id": 7,
          "datetime": "12/08/2020",
          "method": "Universal Credit Deduction",
          "allocations": [
            {
              "debtId": 1,
              "amount": 20
            },
            {
              "debtId": 2,
              "amount": 25
            }
          ]
        }
      ]
    },
    {
      "id": 2,
      "name": "Gemma McDonald",
      "nino": "QQ 41 34 68 Z",
      "onBenefit": true,
      "benefits": [
        "Universal Credit"
      ],
      "activities": [
        {
          "id": 1,
          "title": "Universal Credit Advance (New Claims) received",
          "datetime": "2020-09-16T01:44:00.000Z",
          "content": "Claimant received a New Claims Advance for £409.89"
        },
        {
          "id": 2,
          "title": "Universal Credit Overpayment",
          "datetime": "2021-04-30T01:52:00.000Z",
          "content": "Claimant has a Universal Credit overpayment of £208.89"
        }
      ],
      "debts": [
        {
          "id": 1,
          "title": "Universal Credit Advance (New Claims)",
          "originalBalance": 409.89,
          "status": "recover",
          "debtStart": "2020-09-16T23:59:59.000Z",
          "debtNextPayment": "2021-05-14T23:59:59.000Z",
        },
        {
          "id": 2,
          "title": "Universal Credit Overpayment",
          "originalBalance": 208.89,
          "status": "hold",
          "debtStart": "2021-04-30T23:59:59.000Z",
          "overpaymentStart": "2021-04-16T23:59:59.000Z",
          "overpaymentEnd": "2021-05-16T23:59:59.000Z"
        }
      ],
      "repayments": [
        {
          "id": 1,
          "datetime": "2020-10-16T00:00:00.000Z",
          "method": "Universal Credit Deduction",
          "allocations": [
            {
              "debtId": 1,
              "amount": 34.16
            }
          ]
        },
        {
          "id": 2,
          "datetime": "2020-11-16T00:00:00.000Z",
          "method": "Universal Credit Deduction",
          "allocations": [
            {
              "debtId": 1,
              "amount": 34.16
            }
          ]
        },
        {
          "id": 3,
          "datetime": "2020-12-16T00:00:00.000Z",
          "method": "Universal Credit Deduction",
          "allocations": [
            {
              "debtId": 1,
              "amount": 34.16
            }
          ]
        },
        {
          "id": 4,
          "datetime": "2021-01-15T00:00:00.000Z",
          "method": "Universal Credit Deduction",
          "allocations": [
            {
              "debtId": 1,
              "amount": 34.16
            }
          ]
        },
        {
          "id": 5,
          "datetime": "2021-02-16T00:00:00.000Z",
          "method": "Universal Credit Deduction",
          "allocations": [
            {
              "debtId": 1,
              "amount": 34.16
            }
          ]
        },
        {
          "id": 6,
          "datetime": "2021-03-16T00:00:00.000Z",
          "method": "Universal Credit Deduction",
          "allocations": [
            {
              "debtId": 1,
              "amount": 34.16
            }
          ]
        },
        {
          "id": 7,
          "datetime": "2021-04-16T00:00:00.000Z",
          "method": "Universal Credit Deduction",
          "allocations": [
            {
              "debtId": 1,
              "amount": 34.16
            }
          ]
        }
      ]
    }
  ]
 


}
