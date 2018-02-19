<?php
//  shturman@example.com
// info@shturman.biz
//if (array_key_exists('name', $_POST) && array_key_exists('phone', $_POST)) {
//    $to = 'vnachalesobaka@gmail.com';
//    $subject = $_POST['parameter'].' from '.$_SERVER['HTTP_REFERER'];
//    $subject = "=?utf-8?b?". base64_encode($subject) ."?=";
//    $message = "Имя: ".$_POST['name']."\nPhone: ".$_POST['phone']."\nSite: ".$_POST['site'];
//    $headers = 'From: ' . $_SERVER['HTTP_REFERER'] . "\r\n" .
//        'Reply-To: shturman@example.com' . "\r\n" .
//        'X-Mailer: PHP/' . phpversion();
//    mail($to, $subject, $message, $headers);
//}

$min=100;
$max=200;
$randNum=rand ( $min ,  $max );

$method = $_SERVER['REQUEST_METHOD'];
//Script Foreach
$c = true;
$myFaile = "";
$file_name = "";
if (!empty($_FILES['file_v']['tmp_name'])) {
    $path = $_SERVER['DOCUMENT_ROOT']."/upload/".$_FILES['file_v']['name'];
    if (copy($_FILES['file_v']['tmp_name'], $path)){
        $myFaile = $path;
        $file_name = $_FILES['file_v']['name'];
    }
}
if ( $method === 'POST' ) {
    $project_name = "Chef.ua". $randNum;
    $admin_email  = "vnachalesobaka@gmail.com";
    $form_subject = "some-SERVICE";
    foreach ( $_POST as $key => $value ) {
        if ( $value != "" && $key != "project_name" && $key != "admin_email" && $key != "form_subject" ) {
            $message .= "
			" . ( ($c = !$c) ? '<tr>':'<tr style="background-color: #f8f8f8;">' ) . "
				<td style='padding: 10px; border: #e9e9e9 1px solid;'><b>$key</b></td>
				<td style='padding: 10px; border: #e9e9e9 1px solid;'>$value</td>
			</tr>
			";
        }
    }
} else if ( $method === 'GET' ) {
    $project_name = "Chef";
    $admin_email  = "vnachalesobaka@gmail.com";
    $form_subject = "some-SERVICE";
    foreach ( $_GET as $key => $value ) {
        if ( $value != "" && $key != "project_name" && $key != "admin_email" && $key != "form_subject" ) {
            $message .= "
			" . ( ($c = !$c) ? '<tr>':'<tr style="background-color: #f8f8f8;">' ) . "
				<td style='padding: 10px; border: #e9e9e9 1px solid;'><b>$key</b></td>
				<td style='padding: 10px; border: #e9e9e9 1px solid;'>$value</td>
			</tr>
			";
        }
    }
}
$message = "<table style='width: 100%;'>$message</table>";
function adopt($text) {
    return '=?UTF-8?B?'.Base64_encode($text).'?=';
}
$headers = "MIME-Version: 1.0" . PHP_EOL .
    "Content-Type: text/html; charset=utf-8" . PHP_EOL .
    'From: '.adopt($project_name).' <'.$form_subject.'>' . PHP_EOL .
    'Reply-To: '.$admin_email.'' . PHP_EOL;
mail($admin_email, adopt($form_subject), $message, $headers, $file_name );