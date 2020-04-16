<?php

declare(strict_types=1);

namespace Application\Traits;

use Application\Utility;
use Doctrine\ORM\Mapping as ORM;

/**
 * Trait for all objects with a richt text name and an automatic plain version (to sort and filter on)
 */
trait HasRichTextName
{
    /**
     * @var string
     * @ORM\Column(type="string", length=191)
     */
    private $name = '';

    /**
     * @var string
     * @ORM\Column(type="string", length=191)
     */
    private $plainName = '';

    /**
     * Constructor
     *
     * @param string $name
     */
    public function __construct($name = '')
    {
        $this->setName($name);
    }

    /**
     * Set name
     *
     * @param string $name
     */
    public function setName(string $name): void
    {
        $this->name = Utility::sanitizeSingleLineRichText($name);
        $this->plainName = strip_tags($this->name);
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }
}
