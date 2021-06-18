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

    const $validationGroup = $('.js-validation-group'),
          $validationFields = $('.js-validate'),
          $validationSubmit = $('.js-submit-validation');
    
    let $invalidFields = $validationFields;

    const updateInvalidFields = function($field) {
      let fieldValid = false;

      // remove this validation field from the invalid fields list if valid
      if ( $field.attr('data-js-valid') === 'true' ) {
        fieldValid = true;
        $invalidFields = $invalidFields.not($field[0]);
      }
    };

    // check if any fields that are tagged to be validated are valid
    const isValid = function() {
    
      if ( $invalidFields.length ) {
        console.log('One or more fields are not valid');

        return false;
      }

      console.log('All fields are valid.');

      return true;
    };

    const toggleValidationMessages = function (isValid) {

        $('.js-validation-message').toggleClass( 'js-validation--hidden', isValid ).focus();

        console.dir($validationFields);
        
        $validationFields.each(function(){
          const $this = $(this);

          $this.toggleClass( 'govuk-form-group--error', !isValid );
        });

      

      // 'govuk-form-group--error'

    }

    
    
    // // on required radio button change make parent container valid to test on submit 
    $('.js-radioRequired').change( function() {
      const $radioGroup = $('input[name="' + $(this).attr('name') + '"]');
      const $radioGroupParent = $(this).closest('.js-validate');
    
      $radioGroup.each( function(){
        if ($(this).prop('checked')) {
          $radioGroupParent.attr('data-js-valid', true);
          updateInvalidFields($radioGroupParent);
          return false;
        }
      });
    });

    $validationSubmit.click( function(e) {
      if ( !isValid() ){
        e.preventDefault();
        toggleValidationMessages( false );
      } 
    } );


  }

  return;
}



//======== end form validation =============  


