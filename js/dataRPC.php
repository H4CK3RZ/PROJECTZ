<?php
header('Content-Type: application/json');
$response = [];
if(isset($_GET['action'])) {
    switch($_GET['action']){
        case 'add' :
            $response['action'] = 'remove';
            break;
        case 'remove' :
            $response['action'] = 'add';
            break;
    }
}
$response['success'] = 'true';
echo json_encode($response);
