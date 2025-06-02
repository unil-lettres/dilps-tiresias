<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Repository\LogRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * Log.
 */
#[ORM\Index(name: 'level', columns: ['level'])]
#[ORM\Index(name: 'message', columns: ['message'], options: ['lengths' => [191]])]
#[ORM\Entity(LogRepository::class)]
class Log extends AbstractModel
{
    use \Ecodev\Felix\Model\Traits\Log;
}
