'use strict';

describe('DOM based dynaform.js plugin test', function () {
  var options;

  beforeEach(function () {

    $('#dyna').remove();
    $('body').append('<div id="dyna"></div>');

    options =  { 
        'token':'62bb61431348e22850828a5829c4373faafe29c1',  
        'secret':'51a266c2844ccd5cac83d88de88d82d05358aa51', 
        'modal':false, 
        'fields':{  
            'estado':['PR','SC','SP','RS'], 
            'nível':['Iniciante','Intermediário','Avançado','Ninja'] 
        } 
    };
  });
 
  it('should use DOM dynaform', function () {
    $('#dyna').dynaform(options);
    expect($('#dyna')).toSomething();
  });
 
  it('should use DOM dynaform again', function () {
    $('#dyna').dynaform(options);
    expect($('#dyna')).toSomethingElse();
  });
});