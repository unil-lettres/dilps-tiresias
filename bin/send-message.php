#! /usr/bin/env php
<?php

use Application\Model\Message;
use Application\Repository\MessageRepository;
use Ecodev\Felix\Service\Mailer;

$id = $argv[1] ?? null;
if (!$id) {
    throw new InvalidArgumentException('Specify the ID of the message to be sent');
}

$container = require_once 'server/cli.php';

/** @var MessageRepository $messageRepository */
$messageRepository = _em()->getRepository(Message::class);

/** @var null|Message $message */
$message = $messageRepository->findOneById($id);
if (!$message) {
    throw new InvalidArgumentException('Could not find message with ID: ' . $id);
}

/** @var Mailer $mailer */
$mailer = $container->get(Mailer::class);
$mailer->sendMessage($message);
