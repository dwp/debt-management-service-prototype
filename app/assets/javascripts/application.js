/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  window.GOVUKFrontend.initAll()
  validation();
})

//======== form validation =============
const validation = function(){
  
  // only run if the page requires validation
  if ( $('.js-validation-group').length ) {

    const $validationSubmit = $('.js-submit-validation'),
          $errorSummary = $('.js-error-summary');
 

    // validations to run on submit (checkboxes and radios have live validation on change)
    const validateOnSubmit = function(){

      if ($('.js-money').length) {
        validateMoney();
      }

      if ($('.js-radio-required').length) {
        validateRadioRequired();
      }
    }


    // check if any errors exist in the invalid fields list
    const isValid = function() {

      const $invalidFields = $('[data-js-valid="false"]');

      console.dir($invalidFields);
    
      if ( $invalidFields.length ) {
        console.log('One or more fields are not valid');
        $errorSummary.removeClass('js-validation--hidden');
        return false;
      } 
      
      console.log('All fields are valid.');
      return true;
    };

   
  

    
    // validate money field
    const validateMoney = function(){
      $('.js-money').each( function(){
        //      RegEx: /^\d+(,\d{3})*(\.\d{1,2})?$/ test at https://www.regextester.com/98001
        //      check value is 
        //        - not empty
        //        - integer or float
        //        - only 2 decimal places if float
        //        - positive value
        //        - no letters or symbols
        //        - if including commas only 3 units from decimal
    
        //     valid examples: 0.55, 12, 12.12, 10000, 10000.00
        //     invalid examples: somee text, £12000, 1,0000.00, 
            
          const $inputGroup = $(this),
                $field = $('.js-validate-field', $inputGroup);

          const hideErrors = function(){
            // hide all error messages
            $('.js-error-message', $inputGroup).each(function(){
              $(this).addClass('js-validation--hidden');
            });

            $('.js-money-error', $errorSummary).addClass('js-validation--hidden');
            $inputGroup.removeClass('govuk-form-group--error');
          };
          
          
    
          // removing commas before validation and submit
          const value = $field.val().replaceAll(',', '');
    
          console.log('cleaned: ' + value);
    
          if ( !value ) {
            hideErrors();
            console.log('invalid: empty')
            console.dir($('#payment-amount-empty-error', $inputGroup))
            $inputGroup.attr('data-js-valid', false);
            $inputGroup.addClass('govuk-form-group--error');
            $('#payment-amount-empty-error', $inputGroup).removeClass('js-validation--hidden');
            $('#payment-amount-summary-error').removeClass('js-validation--hidden');
            
          }
          else if ( value <= 0 ) {
            hideErrors();
            console.log('invalid: zero')
            $inputGroup.attr('data-js-valid', false);
            $inputGroup.addClass('govuk-form-group--error');
            $('#payment-amount-min-error', $inputGroup).removeClass('js-validation--hidden');
            $('#payment-amount-summary-error2').removeClass('js-validation--hidden');
            
          }
          else if ( !/^\d+(,\d{3})*(\.\d{1,2})?$/.test(value) ) {
            hideErrors();
            console.log('invalid!!!');
            $inputGroup.attr('data-js-valid', false);
            $inputGroup.addClass('govuk-form-group--error');
            $('#payment-amount-invalid-error', $inputGroup).removeClass('js-validation--hidden');
            $('#payment-amount-summary-error3').removeClass('js-validation--hidden');
            
          } 
          else {
            console.log('valid!');
            $inputGroup.attr('data-js-valid', true);
          }

          return false;
        });
    }

    // validate required radio buttons
    const validateRadioRequired = function(){
      $('.js-radio-required').each(function(){
        const $inputGroup = $(this),
              $radios = $('input[type="radio"]', $inputGroup);

        let checkedFound = false;

        // hide all error messages
        const hideErrors = function(){
          $('.js-error-message', $inputGroup).each(function(){
            $(this).addClass('js-validation--hidden');
          });
          
          $('.js-radio-required-error', $errorSummary).addClass('js-validation--hidden');
          $inputGroup.removeClass('govuk-form-group--error');
        }
        
        

        $radios.each(function(){
          if ($(this).prop('checked')) {
            console.log('checked found');
            $inputGroup.attr('data-js-valid', true);
            checkedFound = true;
            return false
          }
        });

        if (!checkedFound) {
          hideErrors();
          console.log('checked NOT found');

          $inputGroup.attr('data-js-valid', false);
          $inputGroup.addClass('govuk-form-group--error');
          $('#payment-successful-input-error', $inputGroup).removeClass('js-validation--hidden');
          $('#payment-successful-summary-error').removeClass('js-validation--hidden');
        }

        return false
        
      });
    }

    $validationSubmit.click( function(e) {
      validateOnSubmit();

      if ( !isValid() ){
        e.preventDefault();
      } 
    } );


  }

  return;
}



//======== end form validation =============  


