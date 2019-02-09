/*this js file is going to run on the client side and not on the node server 
It will grab the details of the payment  form and validate the details with 
the help of the stripe server and for this we set the publishable key*/
Stripe.setPublishableKey('pk_test_Jvwp9pFj5cyvsqK1SPQGYAJM');
var $form= $('#payment-form');


$form.submit((event)=>{
    //after submitting the form this callback function gets executed
    //disable the button so that the user wont be able to submit the form multiple times while validation is going on
    $('#charge-error').addClass('hidden');
    $form.find('button').prop('disabled',true);
    console.log("in the chekcout.js");
    Stripe.card.createToken({
        number: $('#card-number').val(),
        cvc: $('#card-cvc').val(),
        exp_month: $('#card-expiry-month').val(),
        exp_year: $('#card-expiry-year').val()
       
      },stripeResponseHandler);
      
      return false;
});

function stripeResponseHandler(status,response){
    if(response.error){
       $('#charge-error').text(response.error.message);
       $('#charge-error').removeClass('hidden');
        $form.find('button').prop('disabled',false);
    }
    else{
        //token was created and retirevd it from the response object
        var token=response.id;
        $form.append($('<input type="hidden" name="stripeToken" id="source"/>').val(token));
        $form.get(0).submit(); 
    }

}