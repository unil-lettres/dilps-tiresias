<?php

declare(strict_types=1);

namespace Application\Model;

use Application\DBAL\Types\ExportFormatType;
use Application\DBAL\Types\ExportStateType;
use Application\Traits\HasFileSize;
use Application\Traits\HasSite;
use Application\Traits\HasSiteInterface;
use Doctrine\Common\Collections\Collection as DoctrineCollection;
use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Annotation as API;

/**
 * An export of cards in various format
 *
 * @ORM\Entity(repositoryClass="Application\Repository\ExportRepository")
 */
class Export extends AbstractModel implements HasSiteInterface
{
    use HasSite;
    use HasFileSize;

    /**
     * Number of card exported.
     *
     * This is kept separated from cards and collection, because those could
     * be deleted and we want to keep the count of card forever.
     *
     * @var int
     *
     * @ORM\Column(type="integer", options={"unsigned" = true})
     */
    private $cardCount;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=2000, options={"default" = ""})
     */
    private $filename = '';

    /**
     * @var string
     *
     * @ORM\Column(type="ExportState", options={"default" = ExportStateType::TODO})
     */
    private $state = ExportStateType::TODO;

    /**
     * @var string
     *
     * @ORM\Column(type="ExportFormat", options={"default" = ExportFormatType::ZIP})
     */
    private $format = ExportFormatType::ZIP;

    /**
     * Max height of image. Zero means no max.
     *
     * @var int
     *
     * @ORM\Column(type="integer", options={"default" = 0, "unsigned" = true})
     */
    private $maxHeight = 0;

    /**
     * @var bool
     * @ORM\Column(type="boolean", options={"default" = true})
     */
    private $includeLegend = true;

    /**
     * @var string
     * @ORM\Column(type="string", options={"default" = "#FFFFFF"})
     */
    private $textColor = '#FFFFFF';

    /**
     * @var string
     * @ORM\Column(type="string", options={"default" = "#000000"})
     */
    private $backgroundColor = '#000000';

    /**
     * The collection exported. This is only for informative purpose and only `cards`
     * contains the real cards that will be exported.
     *
     * @var null|Collection
     *
     * @ORM\ManyToOne(targetEntity="Collection")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(onDelete="SET NULL")
     * })
     */
    private $collection;

    /**
     * All cards to export, either picked one-by-one, or selected via a collection.
     *
     * @var DoctrineCollection
     *
     * @ORM\ManyToMany(targetEntity="Card")
     */
    private $cards;

    public function getCardCount(): int
    {
        return $this->cardCount;
    }

    public function getFilename(): string
    {
        return $this->filename;
    }

    /**
     * @API\Exclude
     */
    public function setFilename(string $filename): void
    {
        $this->filename = $filename;
    }

    /**
     * @API\Field(type="ExportState")
     */
    public function getState(): string
    {
        return $this->state;
    }

    /**
     * @API\Exclude
     */
    public function setState(string $state): void
    {
        $this->state = $state;
    }

    /**
     * @API\Field(type="ExportFormat")
     */
    public function getFormat(): string
    {
        return $this->format;
    }

    /**
     * @API\Input(type="ExportFormat")
     */
    public function setFormat(string $format): void
    {
        $this->format = $format;
    }

    public function getMaxHeight(): int
    {
        return $this->maxHeight;
    }

    public function setMaxHeight(int $maxHeight): void
    {
        $this->maxHeight = $maxHeight;
    }

    public function isIncludeLegend(): bool
    {
        return $this->includeLegend;
    }

    public function setIncludeLegend(bool $includeLegend): void
    {
        $this->includeLegend = $includeLegend;
    }

    /**
     * @API\Field(type="Color")
     */
    public function getTextColor(): string
    {
        return $this->textColor;
    }

    /**
     * @API\Input(type="Color")
     */
    public function setTextColor(string $textColor): void
    {
        $this->textColor = $textColor;
    }

    /**
     * @API\Field(type="Color")
     */
    public function getBackgroundColor(): string
    {
        return $this->backgroundColor;
    }

    /**
     * @API\Input(type="Color")
     */
    public function setBackgroundColor(string $backgroundColor): void
    {
        $this->backgroundColor = $backgroundColor;
    }

    public function getCollection(): ?Collection
    {
        return $this->collection;
    }

    public function setCollection(?Collection $collection): void
    {
        $this->collection = $collection;
    }

    /**
     * @API\Exclude
     */
    public function getCards(): DoctrineCollection
    {
        return $this->cards;
    }
}
