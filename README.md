Mailer
======
Mailer is a tiny library that does some contact form stuff.

It uses [Parsley](http://parsleyjs.org) for front-end form validation, and [PHPMailer](https://github.com/Synchro/PHPMailer) for sending e-mails.

Requirements
------------
- PHP 5.4 (or later)
- jQuery (<1.9.1 not tested but I suppose it should work)

Installation
------------
Just include jQuery, `mailer.css` (optional) and `mailer.min.js` in your HTML, and make the `/lib` folder available somewhere on your web server. The minified JavaScript file contains dutch localization for Parsley.

Configuration
-------------
It's easy!

###On the server

Create a php file where your form will post to. Something like `contact.php`. In this file include the `Mailer` class, and create a new instance with your configuration. After that, all you need to do is call the `handle` function on the instance.

	require_once('lib/mailer.php');
	
	$mailer = new Mailer\Mailer(array(
		// configuration
	));
	
	$mailer->handle();

###Frontend

Put a form in your HTML and style it any way you like. Configure Parsley with it's DOM-API and make sure it's action attribute is set to the php file you just created.

Create a new Mailer object somewhere, with optional configuration, and point it to the form. I'll let you figure out where to place this code in your page.

	var contactForm = new Mailer(formElement, config);

`formElement` can be a DOM element or a css selector. I haven't tested what happens if you pass a selector that returns multiple elements.

`config` should be an object. At this time Mailer only checks if `config` contains a `parsley` attribute. If so, the value is passed to Parsley.

On form submit parsley checks the form and if everything is okay the form is submitted via an AJAX request. On success the element with the class `.alert.alert-success` is shown. On error the element with the class `.alert.error` is shown.

To Do
-----
- Finish the documentation,
- Include an example,
- Add a license (any suggestions which license I should use?),
- Maybe write some tests.

License
-------
Copyright Roald Hacquebord, 2013

It's open source! I haven't figured out what license I should release this under, so contact me if you want to use it! :)

- roald@hacquebordbuckles.nl
- @afroald