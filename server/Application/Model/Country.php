<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasName;
use Doctrine\ORM\Mapping as ORM;

/**
 * A country
 *
 * @ORM\Entity(repositoryClass="Application\Repository\CountryRepository")
 */
class Country extends AbstractModel
{
    use HasName;

    /**
     * @var string
     * @ORM\Column(type="string", length=2, unique=true)
     */
    private $code = '';

    /**
     * Set ISO 3166-1 alpha-2 country code
     */
    public function setCode(string $code): void
    {
        $this->code = $code;
    }

    /**
     * Get ISO 3166-1 alpha-2 country code
     */
    public function getCode(): string
    {
        return $this->code;
    }
}
