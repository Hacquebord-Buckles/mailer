(function() {
    var Mailer = function(formElement, config) {
        this.$form = $(formElement);

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

            var fail = $.proxy(function(description) {
                this.$form.find('.alert.error').show();

                if (description) {
                    this.$form.find('.alert.error .description').html(description);
                }
            }, this);

            var success = $.proxy(function() {
                this.$form.find('.alert.error').hide();

                this.$form.find('.alert.alert-success').show();
                this.$form.find('button[type=submit]').hide();

                this.$form.parsley('destroy');
            }, this);

            $.ajax(url, {
                data: this.$form.serialize(),
                type: 'POST',
                context: context,
                beforeSend: function() {
                    this.loading(true);
                }
            }).done(function(data) {
                if (data.success && data.success === true) {
                    success();
                }
                else {
                    fail();
                }
            }).fail(function(xhr) {
                if (console && console.log) {
                    console.log(xhr);
                }

                var description;

                try {
                    var response = $.parseJSON(xhr.responseText);
                    if (response.error) {
                        description = response.error;
                    }
                }
                catch (e) {}

                fail(description);
            }).always(function() {
                this.loading(false);
            });
        },

        loading: function(loading) {
            if (loading) {
                this.$form.find('.ajax-loader').show();
                this.$form.find('input, textarea, button').attr('disabled', 'disabled');
            }
            else {
                this.$form.find('.ajax-loader').hide();
                this.$form.find('input, textarea, button').removeAttr('disabled');
            }
        }
    };

    window.Mailer = Mailer;
})();