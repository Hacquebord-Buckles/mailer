define(['parsley'], function() {
    var Mailer = function(formElement, config) {
        this.$form = $(formElement);
        console.info('Mailer binding to:', this.$form);

        this.config = config || {};

        var defaultParsleyConfig = {
            errorClass: 'error',
            successClass: 'success',
            errors: {
                classHandler: function(element, isRadioOrCheckbox) {
                    return element.parent();
                }
            },
            listeners: {
                onFormSubmit: $.proxy(this.onSubmit, this)
            }
        };

        this.$form.parsley($.extend(defaultParsleyConfig, this.config.parsley));
    };

    Mailer.prototype = {
        onSubmit: function(isFormValid, event, ParsleyForm) {
            event.preventDefault();

            if (!isFormValid) {
                return;
            }

            this.send();
        },

        send: function() {
            var context = this;
            var url = this.$form.attr('action') + '?json';

            $.ajax(url, {
                data: this.$form.serialize(),
                type: 'POST',
                context: context,
                beforeSend: function() {
                    this.loading(true);
                }
            }).done(function(data) {
                console.log(data);
            }).fail(function(xhr, status) {
                console.log(status);
            }).always(function() {
                this.loading(false);
            });
        },

        loading: function(loading) {
            console.info('Loading: ', loading);
            if (loading) {
                this.$form.find('.ajax-loader').show();
                console.log(this.$form.find('input', 'textarea'));
                this.$form.find('input, textarea, button').attr('disabled', 'disabled');
            }
            else {
                this.$form.find('.ajax-loader').hide();
                this.$form.find('input, textarea, button').removeAttr('disabled');
            }
        }
    };

    return Mailer;
});