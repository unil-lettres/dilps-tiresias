<?php

declare(strict_types=1);

namespace Application\Traits;

use Application\Model\Country;
use CrEOF\Spatial\PHP\Types\Geography\Point;
use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Annotation as API;

/**
 * Common fields to represent an address.
 */
trait HasAddress
{
    /**
     * @var null|Point
     * @ORM\Column(type="point", nullable=true)
     * @API\Exclude
     */
    private $location;

    /**
     * @var null|float
     */
    private $latitude;

    /**
     * @var null|float
     */
    private $longitude;

    /**
     * @var string
     * @ORM\Column(name="`precision`", type="Precision", nullable=true)
     */
    private $precision;

    /**
     * @var string
     * @ORM\Column(type="string")
     */
    private $street = '';

    /**
     * @var string
     * @ORM\Column(type="string", length=20)
     */
    private $postcode = '';

    /**
     * @var string
     * @ORM\Column(type="string", length=191)
     */
    private $locality = '';

    /**
     * @var string
     * @ORM\Column(type="string", length=191)
     */
    private $area = '';

    /**
     * @var null|Country
     * @ORM\ManyToOne(targetEntity="Country")
     * @ORM\JoinColumn(nullable=true, onDelete="SET NULL")
     */
    private $country;

    /**
     * Get latitude
     */
    public function getLatitude(): ?float
    {
        return $this->location ? $this->location->getLatitude() : null;
    }

    /**
     * Set latitude
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
     * Get longitude
     */
    public function getLongitude(): ?float
    {
        return $this->location ? $this->location->getLongitude() : null;
    }

    /**
     * Set longitude
     */
    public function setLongitude(?float $longitude): void
    {
        $this->longitude = $longitude;
        $this->toLocation();
    }

    /**
     * @API\Field(type="?Precision")
     */
    public function getPrecision(): ?string
    {
        return $this->precision;
    }

    /**
     * @API\Input(type="?Precision")
     */
    public function setPrecision(?string $precision): void
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
