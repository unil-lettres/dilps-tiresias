<?php

declare(strict_types=1);

namespace Application\Traits;

use Application\Utility;
use Doctrine\ORM\Mapping as ORM;

/**
 * Trait for "simple" properties of an card.
 *
 * They are mostly what was called "meta" in the old DILPS. And we split
 * them only to reduce the Card class size to focus on most important code.
 */
trait CardSimpleProperties
{
    use HasUrl;

    /**
     * @var string
     * @ORM\Column(type="text", options={"default" = ""})
     */
    private $addition = '';

    /**
     * @var string
     * @ORM\Column(type="text", options={"default" = ""})
     */
    private $expandedName = '';

    /**
     * @var string
     * @ORM\Column(type="string", options={"default" = ""})
     */
    private $material = '';

    /**
     * @var string
     * @ORM\Column(type="string", options={"default" = ""})
     */
    private $technique = '';

    /**
     * @var string
     * @ORM\Column(type="string", options={"default" = ""})
     */
    private $techniqueAuthor = '';

    /**
     * @var string
     * @ORM\Column(type="string", length=60, options={"default" = ""})
     */
    private $techniqueDate = '';

    /**
     * @var string
     * @ORM\Column(type="string", options={"default" = ""})
     */
    private $format = '';

    /**
     * @var string
     * @ORM\Column(type="text", options={"default" = ""})
     */
    private $literature = '';

    /**
     * @var string
     * @ORM\Column(type="text", options={"default" = ""})
     */
    private $objectReference = '';

    /**
     * @var string
     * @ORM\Column(type="string", length=10, options={"default" = ""})
     */
    private $page = '';

    /**
     * @var string
     * @ORM\Column(type="string", length=10, options={"default" = ""})
     */
    private $figure = '';

    /**
     * @var string
     * @ORM\Column(name="`table`", type="string", length=10, options={"default" = ""})
     */
    private $table = '';

    /**
     * @var string
     * @ORM\Column(type="string", length=30, options={"default" = ""})
     */
    private $isbn = '';

    /**
     * @var string
     * @ORM\Column(type="text")
     */
    private $comment = '';

    /**
     * @var string
     * @ORM\Column(type="text")
     */
    private $corpus = '';

    /**
     * @var string
     * @ORM\Column(type="string", options={"default" = ""})
     */
    private $rights = '';

    /**
     * @var string
     * @ORM\Column(type="string", options={"default" = ""})
     */
    private $muserisUrl = '';

    /**
     * @var string
     * @ORM\Column(type="string", options={"default" = ""})
     */
    private $muserisCote = '';

    /**
     * @var string
     * @ORM\Column(type="string", length=60, options={"default" = ""})
     */
    private $productionPlace = '';

    /**
     * @var string
     * @ORM\Column(type="text", options={"default" = ""})
     */
    private $urlDescription = '';

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

    public function getTechnique(): string
    {
        return $this->technique;
    }

    public function setTechnique(string $technique): void
    {
        $this->technique = $technique;
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
        $this->page = $page;
    }

    public function getFigure(): string
    {
        return $this->figure;
    }

    public function setFigure(string $figure): void
    {
        $this->figure = $figure;
    }

    public function getTable(): string
    {
        return $this->table;
    }

    public function setTable(string $table): void
    {
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
        $this->corpus = $corpus;
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
