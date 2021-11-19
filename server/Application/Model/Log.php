<?php

declare(strict_types=1);

namespace Application\Model;

use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Annotation as API;

/**
 * Log.
 *
 * @ORM\Table(indexes={
 *     @ORM\Index(name="priority", columns={"creation_date"}),
 *     @ORM\Index(name="date_created", columns={"creation_date"}),
 *     @ORM\Index(name="message", columns={"message"}, options={"lengths" = {191}})
 * })
 * @ORM\Entity(repositoryClass="Application\Repository\LogRepository")
 */
class Log extends AbstractModel
{
    use \Ecodev\Felix\Model\Traits\Log;
}
