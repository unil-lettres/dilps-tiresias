<?php

declare(strict_types=1);

namespace Application\Traits;

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
     * @ORM\Column(type="string", options={"default" = ""})
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

    /**
     * @return string
     */
    public function getAddition(): string
    {
        return $this->addition;
    }

    /**
     * @param string $addition
     */
    public function setAddition(string $addition): void
    {
        $this->addition = $addition;
    }

    /**
     * @return string
     */
    public function getExpandedName(): string
    {
        return $this->expandedName;
    }

    /**
     * @param string $expandedName
     */
    public function setExpandedName(string $expandedName): void
    {
        $this->expandedName = $expandedName;
    }

    /**
     * @return string
     */
    public function getMaterial(): string
    {
        return $this->material;
    }

    /**
     * @param string $material
     */
    public function setMaterial(string $material): void
    {
        $this->material = $material;
    }

    /**
     * @return string
     */
    public function getTechnique(): string
    {
        return $this->technique;
    }

    /**
     * @param string $technique
     */
    public function setTechnique(string $technique): void
    {
        $this->technique = $technique;
    }

    /**
     * @return string
     */
    public function getTechniqueAuthor(): string
    {
        return $this->techniqueAuthor;
    }

    /**
     * @param string $techniqueAuthor
     */
    public function setTechniqueAuthor(string $techniqueAuthor): void
    {
        $this->techniqueAuthor = $techniqueAuthor;
    }

    /**
     * @return string
     */
    public function getTechniqueDate(): string
    {
        return $this->techniqueDate;
    }

    /**
     * @param string $techniqueDate
     */
    public function setTechniqueDate(string $techniqueDate): void
    {
        $this->techniqueDate = $techniqueDate;
    }

    /**
     * @return string
     */
    public function getFormat(): string
    {
        return $this->format;
    }

    /**
     * @param string $format
     */
    public function setFormat(string $format): void
    {
        $this->format = $format;
    }

    /**
     * @return string
     */
    public function getLiterature(): string
    {
        return $this->literature;
    }

    /**
     * @param string $literature
     */
    public function setLiterature(string $literature): void
    {
        $this->literature = $literature;
    }

    /**
     * @return string
     */
    public function getObjectReference(): string
    {
        return $this->objectReference;
    }

    /**
     * @param string $objectReference
     */
    public function setObjectReference(string $objectReference): void
    {
        $this->objectReference = $objectReference;
    }

    /**
     * @return string
     */
    public function getPage(): string
    {
        return $this->page;
    }

    /**
     * @param string $page
     */
    public function setPage(string $page): void
    {
        $this->page = $page;
    }

    /**
     * @return string
     */
    public function getFigure(): string
    {
        return $this->figure;
    }

    /**
     * @param string $figure
     */
    public function setFigure(string $figure): void
    {
        $this->figure = $figure;
    }

    /**
     * @return string
     */
    public function getTable(): string
    {
        return $this->table;
    }

    /**
     * @param string $table
     */
    public function setTable(string $table): void
    {
        $this->table = $table;
    }

    /**
     * @return string
     */
    public function getIsbn(): string
    {
        return $this->isbn;
    }

    /**
     * @param string $isbn
     */
    public function setIsbn(string $isbn): void
    {
        $this->isbn = $isbn;
    }

    /**
     * @return string
     */
    public function getComment(): string
    {
        return $this->comment;
    }

    /**
     * @param string $comment
     */
    public function setComment(string $comment): void
    {
        $this->comment = $comment;
    }

    /**
     * @return string
     */
    public function getRights(): string
    {
        return $this->rights;
    }

    /**
     * @param string $rights
     */
    public function setRights(string $rights): void
    {
        $this->rights = $rights;
    }

    /**
     * @return string
     */
    public function getMuserisUrl(): string
    {
        return $this->muserisUrl;
    }

    /**
     * @param string $muserisUrl
     */
    public function setMuserisUrl(string $muserisUrl): void
    {
        $this->muserisUrl = $muserisUrl;
    }

    /**
     * @return string
     */
    public function getMuserisCote(): string
    {
        return $this->muserisCote;
    }

    /**
     * @param string $muserisCote
     */
    public function setMuserisCote(string $muserisCote): void
    {
        $this->muserisCote = $muserisCote;
    }

    /**
     * @return string
     */
    public function getProductionPlace(): string
    {
        return $this->productionPlace;
    }

    /**
     * @param string $productionPlace
     */
    public function setProductionPlace(string $productionPlace): void
    {
        $this->productionPlace = $productionPlace;
    }

    /**
     * @return string
     */
    public function getUrlDescription(): string
    {
        return $this->urlDescription;
    }

    /**
     * @param string $urlDescription
     */
    public function setUrlDescription(string $urlDescription): void
    {
        $this->urlDescription = $urlDescription;
    }
}
