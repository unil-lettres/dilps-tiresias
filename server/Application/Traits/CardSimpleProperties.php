<?php

declare(strict_types=1);

namespace Application\Traits;

use Application\Utility;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Model\Traits\HasUrl;

/**
 * Trait for "simple" properties of an card.
 *
 * They are mostly what was called "meta" in the old DILPS. And we split
 * them only to reduce the Card class size to focus on most important code.
 */
trait CardSimpleProperties
{
    use HasUrl;

    #[ORM\Column(type: 'text', options: ['default' => ''])]
    private string $addition = '';

    #[ORM\Column(type: 'text', options: ['default' => ''])]
    private string $expandedName = '';

    #[ORM\Column(type: 'string', options: ['default' => ''])]
    private string $material = '';

    #[ORM\Column(type: 'string', options: ['default' => ''])]
    private string $dilpsDomain = '';

    #[ORM\Column(type: 'string', options: ['default' => ''])]
    private string $techniqueAuthor = '';

    #[ORM\Column(type: 'string', length: 60, options: ['default' => ''])]
    private string $techniqueDate = '';

    #[ORM\Column(type: 'string', options: ['default' => ''])]
    private string $format = '';

    #[ORM\Column(type: 'text', options: ['default' => ''])]
    private string $literature = '';

    #[ORM\Column(type: 'text', options: ['default' => ''])]
    private string $objectReference = '';

    #[ORM\Column(type: 'string', length: 10, options: ['default' => ''])]
    private string $page = '';

    #[ORM\Column(type: 'string', length: 10, options: ['default' => ''])]
    private string $figure = '';

    #[ORM\Column(name: '`table`', type: 'string', length: 10, options: ['default' => ''])]
    private string $table = '';

    #[ORM\Column(type: 'string', length: 30, options: ['default' => ''])]
    private string $isbn = '';

    #[ORM\Column(type: 'text')]
    private string $comment = '';

    #[ORM\Column(type: 'text')]
    private string $corpus = '';

    #[ORM\Column(type: 'string', options: ['default' => ''])]
    private string $rights = '';

    #[ORM\Column(type: 'string', options: ['default' => ''])]
    private string $muserisUrl = '';

    #[ORM\Column(type: 'string', options: ['default' => ''])]
    private string $muserisCote = '';

    #[ORM\Column(type: 'string', length: 60, options: ['default' => ''])]
    private string $productionPlace = '';

    #[ORM\Column(type: 'text', options: ['default' => ''])]
    private string $urlDescription = '';

    public function getAddition(): string
    {
        return $this->addition;
    }

    public function setAddition(string $addition): void
    {
        $this->addition = $addition;
    }

    public function getExpandedName(): string
    {
        return $this->expandedName;
    }

    public function setExpandedName(string $expandedName): void
    {
        $this->expandedName = Utility::sanitizeRichText($expandedName);
    }

    public function getMaterial(): string
    {
        return $this->material;
    }

    public function setMaterial(string $material): void
    {
        $this->material = $material;
    }

    public function getDilpsDomain(): string
    {
        return $this->dilpsDomain;
    }

    public function setDilpsDomain(string $dilpsDomain): void
    {
        $this->dilpsDomain = $dilpsDomain;
    }

    public function getTechniqueAuthor(): string
    {
        return $this->techniqueAuthor;
    }

    public function setTechniqueAuthor(string $techniqueAuthor): void
    {
        $this->techniqueAuthor = $techniqueAuthor;
    }

    public function getTechniqueDate(): string
    {
        return $this->techniqueDate;
    }

    public function setTechniqueDate(string $techniqueDate): void
    {
        $this->techniqueDate = $techniqueDate;
    }

    public function getFormat(): string
    {
        return $this->format;
    }

    public function setFormat(string $format): void
    {
        $this->format = $format;
    }

    public function getLiterature(): string
    {
        return $this->literature;
    }

    public function setLiterature(string $literature): void
    {
        $this->literature = Utility::sanitizeRichText($literature);
    }

    public function getObjectReference(): string
    {
        return $this->objectReference;
    }

    public function setObjectReference(string $objectReference): void
    {
        $this->objectReference = $objectReference;
    }

    public function getPage(): string
    {
        return $this->page;
    }

    public function setPage(string $page): void
    {
        // Field is readonly and can only be emptied.
        if ($page !== '') {
            return;
        }

        $this->page = $page;
    }

    public function getFigure(): string
    {
        return $this->figure;
    }

    public function setFigure(string $figure): void
    {
        // Field is readonly and can only be emptied.
        if ($figure !== '') {
            return;
        }

        $this->figure = $figure;
    }

    public function getTable(): string
    {
        return $this->table;
    }

    public function setTable(string $table): void
    {
        // Field is readonly and can only be emptied.
        if ($table !== '') {
            return;
        }

        $this->table = $table;
    }

    public function getIsbn(): string
    {
        return $this->isbn;
    }

    public function setIsbn(string $isbn): void
    {
        $this->isbn = $isbn;
    }

    public function getComment(): string
    {
        return $this->comment;
    }

    public function setComment(string $comment): void
    {
        $this->comment = $comment;
    }

    public function getCorpus(): string
    {
        return $this->corpus;
    }

    public function setCorpus(string $corpus): void
    {
        $this->corpus = Utility::sanitizeRichText($corpus);
    }

    public function getRights(): string
    {
        return $this->rights;
    }

    public function setRights(string $rights): void
    {
        $this->rights = $rights;
    }

    public function getMuserisUrl(): string
    {
        return $this->muserisUrl;
    }

    public function setMuserisUrl(string $muserisUrl): void
    {
        $this->muserisUrl = $muserisUrl;
    }

    public function getMuserisCote(): string
    {
        return $this->muserisCote;
    }

    public function setMuserisCote(string $muserisCote): void
    {
        $this->muserisCote = $muserisCote;
    }

    public function getProductionPlace(): string
    {
        return $this->productionPlace;
    }

    public function setProductionPlace(string $productionPlace): void
    {
        $this->productionPlace = $productionPlace;
    }

    public function getUrlDescription(): string
    {
        return $this->urlDescription;
    }

    public function setUrlDescription(string $urlDescription): void
    {
        $this->urlDescription = Utility::sanitizeRichText($urlDescription);
    }
}
