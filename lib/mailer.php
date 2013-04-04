<?php

namespace Mailer;

require_once('class.phpmailer.php');

class Mailer
{
    protected $_config;
    protected $_mail;
    protected $_data;

    public function __construct($config)
    {
        $this->_config = $config;
        $this->_data = $_POST;

        date_default_timezone_set('Europe/Amsterdam');

        $mail = new \PHPMailer(true);

        if (array_key_exists('gmail', $config)) {
            $mail->IsSMTP();
            $mail->Host       = "mail.yourdomain.com";
            $mail->SMTPAuth   = true;
            $mail->SMTPSecure = "ssl";
            $mail->Host       = "smtp.gmail.com";
            $mail->Port       = 465;
            $mail->Username   = $config['gmail']['username'];
            $mail->Password   = $config['gmail']['password'];
        }

        $mail->AddAddress($config['to']['email'], $config['to']['name']);

        $this->_mail = $mail;
    }

    public function handle()
    {
        if (!$this->_validateInput()) {
            throw new Exception('Invalid input');
        }

        $data = &$this->_data;
        $mail = &$this->_mail;

        if (isset($this->_config['from'])) {
            $mail->SetFrom($this->_config['from']['email'], $this->_config['from']['name']);
            $mail->AddReplyTo($this->_config['from']['email'], $this->_config['from']['name']);
        }
        else {
            $mail->SetFrom($data['email'], $data['name']);
            $mail->AddReplyTo($data['email'], $data['name']);
        }

        $mail->Subject = 'Bericht van ' . $data['name'] . ' via het contactformulier';

        $template = isset($this->_config['templates']) && isset($this->_config['templates']['mail']) ? $this->_config['templates']['mail'] : getcwd() . '/templates/mail.html';

        $mail->MsgHTML(nl2br($this->render($template, $data, true)));
        $mail->AltBody = $this->render($template, $data, true);

        $mail->send();

        if (self::json()) {
            self::renderJson(array(
                'success' => true
            ));
        }
        else {
            $template = isset($this->_config['templates']) && isset($this->_config['templates']['success']) ? $this->_config['templates']['success'] : getcwd() . '/templates/success.html';
            self::render($template);
        }
    }

    protected function _validateInput()
    {
        $valid = true;
        $data = &$this->_data;

        foreach ($this->_config['validate'] as $key => $rules) {
            if (!array_key_exists($key, $data) || empty($data[$key])) {
                if (array_search('required', $rules) !== false) {
                    $valid = false;
                }
            }
            else {
                foreach ($rules as $rule) {
                    switch($rule) {
                        case 'required':
                        break;

                        case 'email':
                            if (!\PHPMailer::ValidateAddress($data[$key])) {
                                $valid = false;
                            }
                        break;
                    }
                }
            }
        }

        return $valid;
    }

    static function render($template, $data = array(), $toString = false) {
        extract($data);

        if ($toString) {
            ob_start();
        }
        else {
            self::killCaching();
        }

        include($template);

        if ($toString) {
            return ob_get_clean();
        }
    }

    static function renderJson($data) {
        self::killCaching();

        header('Content-Type: application/json');

        echo json_encode($data);
    }

    static function killCaching() {
        header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
        header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
        header("Cache-Control: no-store, no-cache, must-revalidate");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
    }

    static function json() {
        return array_key_exists('json', $_GET);
    }
}

class Exception extends \Exception {}

function exception_handler($exception) {
    http_response_code(400);

    if (Mailer::json()) {
        header('Content-Type: application/json');

        Mailer::renderJson(array(
            'error' => $exception->getMessage()
        ));
    }
    else {
        Mailer::render(getcwd() . '/templates/error.html', array(
            'exception' => $exception
        ));
    }
}

set_exception_handler('Mailer\exception_handler');