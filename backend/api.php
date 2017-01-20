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
        
        error_reporting(0);
        ini_set('display_errors', 0);

        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Credentials: true ");
        header("Access-Control-Allow-Methods: OPTIONS, GET, POST");
        header("Access-Control-Allow-Headers: Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");

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
        
        $json = file_get_contents('php://input');
        $post = json_decode($json);

        if ($post) {
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
        } else {
            array_push($this->missing, 'client_id', 'code', 'redirect_uri');
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
            $data = json_decode($result);
        } else {
            header("HTTP/1.1 500 Server Error");
            $data = Array('message' => 'Instagram Response Error: ' . curl_error($curl));
        }

        curl_close($curl);
        echo json_encode($data);
    }
}

new InstagramRelay();