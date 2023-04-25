<?php

declare(strict_types=1);

namespace Application\Model;

use Application\DBAL\Types\ExportFormatType;
use Application\DBAL\Types\ExportStatusType;
use Application\Repository\ExportRepository;
use Application\Traits\HasFileSize;
use Application\Traits\HasSite;
use Application\Traits\HasSiteInterface;
use Cake\Chronos\Chronos;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection as DoctrineCollection;
use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Attribute as API;
use Throwable;

/**
 * An export of cards in various format.
 */
#[ORM\Entity(ExportRepository::class)]
class Export extends AbstractModel implements HasSiteInterface
{
    private const EXPORT_PATH = 'htdocs/export/';

    use HasFileSize;
    use HasSite;

    /**
     * Number of card exported.
     *
     * This is kept separated from cards and collection, because those could
     * be deleted and we want to keep the count of card forever.
     */
    #[ORM\Column(type: 'integer', options: ['default' => 0, 'unsigned' => true])]
    private int $cardCount = 0;

    #[ORM\Column(type: 'string', length: 2000, options: ['default' => ''])]
    private string $filename = '';

    #[ORM\Column(type: 'ExportStatus', options: ['default' => ExportStatusType::TODO])]
    private string $status = ExportStatusType::TODO;

    #[ORM\Column(type: 'ExportFormat', options: ['default' => ExportFormatType::ZIP])]
    private string $format = ExportFormatType::ZIP;

    /**
     * Max height of image. Zero means no max.
     */
    #[ORM\Column(type: 'integer', options: ['default' => 0, 'unsigned' => true])]
    private int $maxHeight = 0;

    #[ORM\Column(type: 'boolean', options: ['default' => true])]
    private bool $includeLegend = true;

    #[ORM\Column(type: 'string', options: ['default' => '#FFFFFF'])]
    private string $textColor = '#FFFFFF';

    #[ORM\Column(type: 'string', options: ['default' => '#000000'])]
    private string $backgroundColor = '#000000';

    /**
     * Start time of export process.
     */
    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?Chronos $start = null;

    /**
     * Duration of export process in seconds.
     */
    #[ORM\Column(type: 'integer', nullable: true, options: ['unsigned' => true])]
    private ?int $duration = null;

    /**
     * Peak memory usage in MiB.
     */
    #[ORM\Column(type: 'integer', nullable: true, options: ['unsigned' => true])]
    private ?int $memory = null;

    #[ORM\Column(type: 'string', length: 2000, options: ['default' => ''])]
    private string $errorMessage = '';

    /**
     * The collections exported. This is only for informative purpose and only `cards`
     * contains the real cards that will be exported.
     *
     * @var DoctrineCollection<Collection>
     */
    #[ORM\ManyToMany(targetEntity: Collection::class)]
    private DoctrineCollection $collections;

    /**
     * All cards to export, either picked one-by-one, or selected via a collection.
     *
     * @var DoctrineCollection<Card>
     */
    #[ORM\ManyToMany(targetEntity: Card::class)]
    private DoctrineCollection $cards;

    public function __construct()
    {
        $this->collections = new ArrayCollection();
        $this->cards = new ArrayCollection();
    }

    public function getCardCount(): int
    {
        return $this->cardCount;
    }

    /**
     * Get absolute path to export on disk.
     */
    #[API\Exclude]
    public function getPath(): string
    {
        return realpath('.') . '/' . self::EXPORT_PATH . $this->getFilename();
    }

    public function getFilename(): string
    {
        return $this->filename;
    }

    #[API\Field(type: 'ExportStatus')]
    public function getStatus(): string
    {
        return $this->status;
    }

    public function markAsInProgress(string $filename): void
    {
        $this->status = ExportStatusType::IN_PROGRESS;
        $this->start = new Chronos();
        $this->filename = $filename;
    }

    public function markAsDone(): void
    {
        $this->status = ExportStatusType::DONE;
        $this->stats();
    }

    public function markAsErrored(Throwable $throwable): void
    {
        $this->status = ExportStatusType::ERRORED;
        $this->errorMessage = $throwable->getMessage();
        $this->stats();
    }

    private function stats(): void
    {
        $now = new Chronos();
        $this->duration = $now->getTimestamp() - $this->start->getTimestamp();
        $this->memory = (int) round(memory_get_peak_usage() / 1024 / 1024);

        $path = $this->getPath();
        if (is_readable($path)) {
            $this->fileSize = filesize($path);
        }
    }

    #[API\Field(type: 'ExportFormat')]
    public function getFormat(): string
    {
        return $this->format;
    }

    #[API\Input(type: 'ExportFormat')]
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

    #[API\Field(type: 'Color')]
    public function getTextColor(): string
    {
        return $this->textColor;
    }

    #[API\Input(type: 'Color')]
    public function setTextColor(string $textColor): void
    {
        $this->textColor = $textColor;
    }

    #[API\Field(type: 'Color')]
    public function getBackgroundColor(): string
    {
        return $this->backgroundColor;
    }

    #[API\Input(type: 'Color')]
    public function setBackgroundColor(string $backgroundColor): void
    {
        $this->backgroundColor = $backgroundColor;
    }

    public function getStart(): ?Chronos
    {
        return $this->start;
    }

    public function getDuration(): ?int
    {
        return $this->duration;
    }

    public function getMemory(): ?int
    {
        return $this->memory;
    }
}
