<?php

if ( empty( $_POST[ 'senderEmail' ]) ) {
	echo 'senderMail nmot defined in POST data';
	exit;
}

$senderName = $_POST[ 'senderName' ];
$senderPhone = $_POST[ 'senderPhone' ];
$senderEmail = $_POST[ 'senderEmail' ];
$senderMessage = nl2br( $_POST[ 'senderMessage' ] );

$headers  = "MIME-Version: 1.0
"; 
$headers .= "Content-type: text/html; charset=iso-8859-1
";
$headers .= "From: sitemail@neuromantic.com
";
$headers .= "Reply-To: " . $senderEmail;


$siteName = "www.neuromantic.com";
$to = "info@neuromantic.com";
$toSubject = "Site mail from $senderName via $siteName";
$emailBody = "From: $senderName<br/>
Phone: $senderPhone</br>
Email: $senderEmail<br/>
Message:<br/>
$senderMessage";

$ok = mail( $to, $toSubject, $emailBody, $headers );

if ( $ok ) {
	echo "win";

} else {
	echo "fail calling mail( $to, $toSubject, $message, $headers )";
}

?>