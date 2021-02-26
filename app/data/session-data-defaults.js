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
      "name": "David Ross",
      "nino": "RM 52 23 65 B",
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
          "date": "12/02/2021",
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
          "date": "12/01/2021",
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
          "date": "12/12/2020",
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
          "date": "12/11/2020",
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
          "date": "12/10/2020",
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
          "date": "12/09/2020",
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
          "date": "12/08/2020",
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
      "name": "linda smith",
      "nino": "RM 52 23 65 C",
      "onBenefit": false,
      "benefits": [
        "Universal Credit",
        "something"
      ],
      "debts": [
        {
          "id": 3,
          "title": "Budgeting Advance",
          "originalBalance": 120,
          "debtStart": "18/01/2020"
        }
      ]
    }
  ]
 


}
