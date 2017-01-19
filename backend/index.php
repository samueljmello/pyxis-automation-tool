<?php

require_once('constants.php');

final class InstagramRelay {

    private $client_id;
    private $client_secret;
    private $code;
    private $grant_type = 'authorization_code';
    private $redirect_uri;

    private $loaded = Array();
    private $missing = Array();

    public function __construct() {
    
        header('Content-Type: application/json');
        header("Access-Control-Allow-Origin: *");

        $loaded = $this->loadParams();
        if ($loaded) {
            $this->request();
        } else {
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(Array('message' => 'Missing parameters: ' . implode(', ', $this->missing)));
        }
    }

    private function loadParams() {

        $this->client_secret = INSTAGRAM_SECRET_KEY;

        $post = json_decode($_POST['json']);

        if (property_exists($post,'client_id')) {
            $this->client_id = $post->client_id;
            array_push($this->loaded, 'client_id');
        } else {
            array_push($this->missing, 'client_id');
        }

        if (property_exists($post,'code')) {
            $this->code = $post->code;
            array_push($this->loaded, 'code');
        } else {
            array_push($this->missing, 'code');
        }

        if (property_exists($post,'redirect_uri')) {
            $this->redirect_uri = $post->redirect_uri;
            array_push($this->loaded, 'redirect_uri');
        } else {
            array_push($this->missing, 'redirect_uri');
        }

        if (count($this->loaded) === 3) {
            return true;
        }
        else {
            return false;
        }
    }

    private function request() {

        $url = "https://api.instagram.com/oauth/access_token";
        $access_token_parameters = array(
            'client_id' => $this->client_id,
            'client_secret' => $this->client_secret,
            'grant_type' => $this->grant_type,
            'redirect_uri' => $this->redirect_uri,
            'code' => $this->code
        );

        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $access_token_parameters);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        $result = curl_exec($curl);

        if (!curl_error($curl)) {
            header("HTTP/1.1 200 OK");
            $data = $result;
        } else {
            header("HTTP/1.1 500 Server Error");
            $data = Array('message' => 'Instagram Response Error: ' . curl_error($curl));
        }

        curl_close($curl);
        echo json_encode($data);
    }
}

new InstagramRelay();