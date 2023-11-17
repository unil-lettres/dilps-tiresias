<?php

declare(strict_types=1);

namespace Application\Traits;

use Application\Utility;
use Doctrine\ORM\Mapping as ORM;

/**
 * Trait for all objects with a richt text name and an automatic plain version (to sort and filter on).
 */
trait HasRichTextName
{
    #[ORM\Column(type: 'string', length: 191)]
    private string $name = '';

    #[ORM\Column(type: 'string', length: 191)]
    private string $plainName = '';

    /**
     * Constructor.
     *
     * @param string $name
     */
    public function __construct($name = '')
    {
        $this->setName($name);
    }

    /**
     * Set name.
     */
    public function setName(string $name): void
    {
        $this->name = Utility::sanitizeSingleLineRichText($name);
        $this->plainName = Utility::richTextToPlainText($this->name);
    }

    /**
     * Get name.
     */
    public function getName(): string
    {
        return $this->name;
    }
}
