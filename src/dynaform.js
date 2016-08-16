'use strict';
(function ($) {
    
    $.fn.dynaform = function (options) {

        // the base DOM structure needed to create a modal
        var templates = {
            body:         '<div class="dynaform" tabindex="-1" role="dialog" aria-hidden="true">' +
                                '<div class="modal-dialog">' +
                                    '<div class="modal-content">' +
                                        '<div class="modal-body content-body"></div>' +
                                    '</div>'+
                                '</div>'+
                            '</div>',
            header:         '<div class="modal-header">' +
                                '<h4 class="modal-title"></h4>' +
                            '</div>',
            footer:         '<div class="modal-footer"></div>',
            closeButton:    '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden=true">&times;</span></button>',           
            formGroup:      '<div class="form-group"></div>',
            inputsDefault:  ['<input class="form-control requerid" placeholder="Nome" name="name" />', '<input placeholder="E-mail" class="form-control requerid" name="email" />'],        
            inputs: {
                select:     '<select class="form-control"></select>'               
            },
            sendButton:     '<button type="submit" class="btn btn-primary"></button>'            
        };
      
        var settings = $.extend({
          token:'', 
          secret:'', 
          modal: false, 
          fields:{},
          title: 'Title Plugin‏',
          buttom: 'Send',
          success: 'Sucess',
          error:  'Error',
          postUrl: null          
        }, options);   
        
        if (settings.modal) {

            if ((typeof $().modal != 'function')) {
                settings.modal = false; 
                //throw new Error('jQuery Bootstrap not found.');
            }
            
        }

        return this.each(function () {
           
            var DynaFormStruct = createHtml();
            var DynaFormFields = createFields();

            DynaFormStruct.find('.content-body').html(DynaFormFields);

            if (settings.modal){
                $('body').append($("<form/>").html(DynaFormStruct));
                $(this).on('click', function() {
                   $(DynaFormStruct).modal('show');
                });     
            }else {
                $(this).html($("<form/>").html(DynaFormStruct));
            } 
         
           DynaFormStruct.closest('form').on('submit', postForm);
        });


        function createHtml(){

            var DynaFormHTML = $(templates.body);

            if(settings.buttom){
                DynaFormHTML.find('.modal-body').before(templates.header);
                DynaFormHTML.find('.modal-title').html(settings.title);
            }

            DynaFormHTML.find('.modal-body').after($(templates.footer).append($(templates.sendButton).html(settings.buttom)));
           
            if (settings.modal){

                DynaFormHTML.find('.modal-title').prepend(templates.closeButton);
                DynaFormHTML.addClass('modal');

            } else {
               
                DynaFormHTML.addClass('no-modal');

                DynaFormHTML.find('[class*="modal"]').each(function (index) {

                    $(this).addClass($(this).attr('class').replace(/modal-+/g, '')).removeClass(function (index, css) {
                        return (css.match(/\modal-\S+/g) || []).join(' ');
                    });

                });

            }
            return DynaFormHTML;
        }


        function createFields() {
            var vHtmFields = $('<div/>');

            //create default fields
            $.each(templates.inputsDefault, function(index, value){
                vHtmFields.append($(templates.formGroup).html(value));
            });

            $.each(options.fields, function(index, value){    
               
                //test field is object create field select
                if(typeof(value) ===   'object'){ 

                    var vFieldSelect = $(templates.inputs.select).attr('name', index);

                    vFieldSelect.append( $('<option/>').attr({ 'value': '' }).text(firstCharToLowerCase(index)) );

                    $.each(value, function(i, v){
                        vFieldSelect.append( $('<option/>').attr({ 'value': v }).text(v) );
                    });

                    vHtmFields.append($(templates.formGroup).html(vFieldSelect));
                }
                
            });

            return vHtmFields;
        }

        function firstCharToLowerCase (str) {
            return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($name) {
                return $name.toUpperCase();
            });
        }

        function postForm(e){
            e.preventDefault();
            if(validateForm(this)){                
                var data = serializeFormJSON(this);                 
                $.ajax({
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    type: 'POST',
                    cache: false,
                    url: settings.postUrl,
                    data: { 'token': settings.token, 'secret': settings.secret, 'fields': JSON.stringify(data)}, 
                    success: postFormSucceeded,
                    error: postFormFailed
                });
            }
            return false;
        } 


        function postFormSucceeded(){
            alert(settings.success);
        }

        function postFormFailed(){
            alert(settings.error);
        }
        
        function validateForm(FormElement){
            var validate = true;
            $(FormElement).find('.requerid').each(function(index, input){
                if(!($(input).val())){
                    alert('Input ' + $(input).attr('placeholder') + ' requerid.' );
                    $(input).focus();
                    validate = false;
                    return validate                    
                }
            });
            return validate;
        }

        function serializeFormJSON(FormElement) {

            var o = {};
            var a = $(FormElement).serializeArray();
            $.each(a, function () { 

                if (o[this.name]) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }

            });
            return o;
            
        };
        
    }   

}(jQuery));

