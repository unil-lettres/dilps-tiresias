<?php

declare(strict_types=1);

namespace Application\Traits;

use Application\Utility;
use Doctrine\ORM\Mapping as ORM;

/**
 * Trait for all objects with a rich text name and an automatic plain version (to sort and filter on).
 */
trait HasRichTextName
{
    #[ORM\Column(type: 'string', length: 191)]
    private string $name = '';

    #[ORM\Column(type: 'string', length: 191, options: ['default' => ''])]
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
     * Set plain name.
     */
    public function setPlainName(string $plainName): void
    {
        $this->plainName = Utility::sanitizeRichText($plainName);
    }

    /**
     * Get name.
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * Get plain name.
     */
    public function getPlainName(): string
    {
        return $this->plainName;
    }
}
