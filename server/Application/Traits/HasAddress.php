<?php

declare(strict_types=1);

namespace Application\Traits;

use Application\Enum\Precision;
use Application\Model\Country;
use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Attribute as API;
use LongitudeOne\Spatial\PHP\Types\Geography\Point;

/**
 * Common fields to represent an address.
 */
trait HasAddress
{
    #[ORM\Column(type: 'point', nullable: true)]
    #[API\Exclude]
    private ?Point $location = null;

    private ?float $latitude = null;

    private ?float $longitude = null;

    #[ORM\Column(name: '`precision`', type: 'Precision', nullable: true)]
    private ?Precision $precision = null;

    #[ORM\Column(type: 'string', options: ['default' => ''])]
    private string $street = '';

    #[ORM\Column(type: 'string', length: 20, options: ['default' => ''])]
    private string $postcode = '';

    #[ORM\Column(type: 'string', length: 191, options: ['default' => ''])]
    private string $locality = '';

    #[ORM\Column(type: 'string', length: 191, options: ['default' => ''])]
    private string $area = '';

    #[ORM\ManyToOne(targetEntity: Country::class)]
    #[ORM\JoinColumn(onDelete: 'SET NULL')]
    private ?Country $country = null;

    /**
     * Get latitude.
     */
    public function getLatitude(): ?float
    {
        return $this->location ? $this->location->getLatitude() : null;
    }

    /**
     * Set latitude.
     */
    public function setLatitude(?float $latitude): void
    {
        $this->latitude = $latitude;
        $this->toLocation();
    }

    private function toLocation(): void
    {
        if ($this->longitude && $this->latitude) {
            $this->location = new Point($this->longitude, $this->latitude, 4326);
        } else {
            $this->location = null;
        }
    }

    /**
     * Get longitude.
     */
    public function getLongitude(): ?float
    {
        return $this->location ? $this->location->getLongitude() : null;
    }

    /**
     * Set longitude.
     */
    public function setLongitude(?float $longitude): void
    {
        $this->longitude = $longitude;
        $this->toLocation();
    }

    public function getPrecision(): ?Precision
    {
        return $this->precision;
    }

    public function setPrecision(?Precision $precision): void
    {
        $this->precision = $precision;
    }

    public function getStreet(): string
    {
        return $this->street;
    }

    public function setStreet(string $street): void
    {
        $this->street = $street;
    }

    public function getPostcode(): string
    {
        return $this->postcode;
    }

    public function setPostcode(string $postcode): void
    {
        $this->postcode = $postcode;
    }

    public function getLocality(): string
    {
        return $this->locality;
    }

    public function setLocality(string $locality): void
    {
        $this->locality = $locality;
    }

    public function getArea(): string
    {
        return $this->area;
    }

    public function setArea(string $area): void
    {
        $this->area = $area;
    }

    public function getCountry(): ?Country
    {
        return $this->country;
    }

    public function setCountry(?Country $country = null): void
    {
        $this->country = $country;
    }
}
