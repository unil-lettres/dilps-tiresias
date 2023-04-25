<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Repository\CountryRepository;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Model\Traits\HasName;

/**
 * A country.
 */
#[ORM\Entity(CountryRepository::class)]
class Country extends AbstractModel
{
    use HasName;

    #[ORM\Column(type: 'string', length: 2, unique: true)]
    private string $code = '';

    /**
     * Set ISO 3166-1 alpha-2 country code.
     */
    public function setCode(string $code): void
    {
        $this->code = $code;
    }

    /**
     * Get ISO 3166-1 alpha-2 country code.
     */
    public function getCode(): string
    {
        return $this->code;
    }
}
