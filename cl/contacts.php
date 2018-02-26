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

echo $path;
echo $file_name;
if ( $method === 'POST' ) {
    $project_name = "coder quote";
    $admin_email  = $_POST['Email'];
    $form_subject = "form-order";
    foreach ( $_POST as $key => $value ) {
        if ( $value != "" && $key != "project_name" && $key != "admin_email" && $key != "form_subject" ) {
            $message .= "
			" . ( ($c = !$c) ? '<tr>':'<tr style="background-color: #e2e2e0;">' ) . "
				<td style='padding: 10px; border: #e9e9e9 1px solid;'><b>$key</b></td>
				<td style='padding: 10px; border: #e9e9e9 1px solid;'>$value</td>
			</tr>
			";
        }
    }
} else if ( $method === 'GET' ) {
    $project_name = "coder quote";
    $admin_email  = $_POST['Email'];
    $form_subject = "some-SERVICE";
    foreach ( $_GET as $key => $value ) {
        if ( $value != "" && $key != "project_name" && $key != "admin_email" && $key != "form_subject" ) {
            $message .= "
			" . ( ($c = !$c) ? '<tr>':'<tr style="background-color: #e2e2e0;">' ) . "
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
if (!empty($_FILES['mail_file']['tmp_name']))

{


}
$attachment = chunk_split(base64_encode(file_get_contents($_FILES['uploadfile']['tmp_name'])));
$filename = $_FILES['uploadfile']['name'];

$boundary =md5(date('r', time()));

$headers = "From: CODER QUOTE\r\nReply-To: CODER QUOTE";
$headers .= "\r\nMIME-Version: 1.0\r\nContent-Type: multipart/mixed; boundary=\"_1_$boundary\"";

$message="This is a multi-part message in MIME format.

--_1_$boundary
Content-Type: multipart/alternative; boundary=\"_2_$boundary\"

--_2_$boundary
Content-Type: text/html; charset=\"iso-8859-1\"
Content-Transfer-Encoding: 7bit

$message

--_2_$boundary--
--_1_$boundary
Content-Type: application/octet-stream; name=\"$filename\" 
Content-Transfer-Encoding: base64 
Content-Disposition: attachment 

$attachment
--_1_$boundary--";

mail($admin_email, adopt($form_subject), $message, $headers );



// Каталог, в который мы будем принимать файл:
//$uploaddir = '/home/dlm2902/zpz.dp.ua/cl/temp/';
//$uploadfile = $uploaddir.basename($_FILES['uploadfile']['name']);
//echo '<pre>';
//print_r($_FILES);
//echo '</pre>';
//echo $uploadfile;
//// Копируем файл из каталога для временного хранения файлов:
//if (copy($_FILES['uploadfile']['tmp_name'], $uploadfile))
//{
//    echo "<h3>Файл успешно загружен на сервер</h3>";
//}
//else { echo "<h3>Ошибка! Не удалось загрузить файл на сервер!</h3>"; exit; }
//
//// Выводим информацию о загруженном файле:
//echo "<h3>Информация о загруженном на сервер файле: </h3>";
//echo "<p><b>Оригинальное имя загруженного файла: ".$_FILES['uploadfile']['name']."</b></p>";
//echo "<p><b>Mime-тип загруженного файла: ".$_FILES['uploadfile']['type']."</b></p>";
//echo "<p><b>Размер загруженного файла в байтах: ".$_FILES['uploadfile']['size']."</b></p>";
//echo "<p><b>Временное имя файла: ".$_FILES['uploadfile']['tmp_name']."</b></p>";

//if(isset($_POST['name'],$_FILES['uploadfile'])){
//    $req = false; // изначально переменная для "ответа" - false
//    // Приведём полученную информацию в удобочитаемый вид
//    ob_start();
//    echo '<pre>';
//    echo 'Имя пользователя: <strong>' , $_POST['name'] , '</strong><br>Данные загруженного файла:<br>';
//    print_r($_FILES['uploadfile']);
//    echo '</pre>';
//    $req = ob_get_contents();
//    ob_end_clean();
//    echo json_encode($req); // вернем полученное в ответе
//    exit;
//}
