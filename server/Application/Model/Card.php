<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Api\Exception;
use Application\Service\DatingRule;
use Application\Traits\CardSimpleProperties;
use Application\Traits\HasAddress;
use Application\Traits\HasCode;
use Application\Traits\HasImage;
use Application\Traits\HasInstitution;
use Application\Traits\HasName;
use Application\Traits\HasSite;
use Application\Traits\HasSiteInterface;
use Application\Traits\HasValidation;
use Application\Traits\HasYearRange;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection as DoctrineCollection;
use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Annotation as API;
use Imagine\Filter\Basic\Autorotate;
use Imagine\Image\ImagineInterface;
use InvalidArgumentException;
use Psr\Http\Message\UploadedFileInterface;

/**
 * A card containing an image and some information about it
 *
 * @ORM\HasLifecycleCallbacks
 * @ORM\Entity(repositoryClass="Application\Repository\CardRepository")
 * @ORM\Table(indexes={
 *     @ORM\Index(name="card_name_idx", columns={"name"}),
 *     @ORM\Index(name="card_locality_idx", columns={"locality"}),
 *     @ORM\Index(name="card_area_idx", columns={"area"}),
 * },
 * uniqueConstraints={
 *     @ORM\UniqueConstraint(name="unique_code", columns={"code", "site"})
 * })
 * @API\Filters({
 *     @API\Filter(field="nameOrExpandedName", operator="Application\Api\Input\Operator\NameOrExpandedNameOperatorType", type="string"),
 *     @API\Filter(field="artistOrTechniqueAuthor", operator="Application\Api\Input\Operator\ArtistOrTechniqueAuthorOperatorType", type="string"),
 *     @API\Filter(field="localityOrInstitutionLocality", operator="Application\Api\Input\Operator\LocalityOrInstitutionLocalityOperatorType", type="string"),
 *     @API\Filter(field="dating", operator="Application\Api\Input\Operator\DatingYearRange\EqualOperatorType", type="Email"),
 *     @API\Filter(field="dating", operator="Application\Api\Input\Operator\DatingYearRange\GreaterOperatorType", type="Email"),
 *     @API\Filter(field="dating", operator="Application\Api\Input\Operator\DatingYearRange\GreaterOrEqualOperatorType", type="Email"),
 *     @API\Filter(field="dating", operator="Application\Api\Input\Operator\DatingYearRange\LessOperatorType", type="Email"),
 *     @API\Filter(field="dating", operator="Application\Api\Input\Operator\DatingYearRange\LessOrEqualOperatorType", type="Email"),
 *     @API\Filter(field="yearRange", operator="Application\Api\Input\Operator\CardYearRange\EqualOperatorType", type="Login"),
 *     @API\Filter(field="yearRange", operator="Application\Api\Input\Operator\CardYearRange\GreaterOperatorType", type="Login"),
 *     @API\Filter(field="yearRange", operator="Application\Api\Input\Operator\CardYearRange\GreaterOrEqualOperatorType", type="Login"),
 *     @API\Filter(field="yearRange", operator="Application\Api\Input\Operator\CardYearRange\LessOperatorType", type="Login"),
 *     @API\Filter(field="yearRange", operator="Application\Api\Input\Operator\CardYearRange\LessOrEqualOperatorType", type="Login"),
 * })
 * @API\Sorting({"Application\Api\Input\Sorting\Artists"})
 */
class Card extends AbstractModel implements HasSiteInterface
{
    use HasCode;
    use HasName;
    use HasInstitution;
    use HasAddress;
    use CardSimpleProperties;
    use HasValidation;
    use HasYearRange;
    use HasSite;
    use HasImage {
        setFile as traitSetFile;
    }

    private const IMAGE_PATH = 'data/images/';

    const VISIBILITY_PRIVATE = 'private';
    const VISIBILITY_MEMBER = 'member';
    const VISIBILITY_PUBLIC = 'public';

    /**
     * @var string
     * @ORM\Column(type="CardVisibility", options={"default" = Card::VISIBILITY_PRIVATE})
     */
    private $visibility = self::VISIBILITY_PRIVATE;

    /**
     * @var int
     * @ORM\Column(type="integer")
     */
    private $fileSize = 0;

    /**
     * @var int
     * @ORM\Column(type="integer")
     */
    private $width = 0;

    /**
     * @var int
     * @ORM\Column(type="integer")
     */
    private $height = 0;

    /**
     * @var string
     *
     * @ORM\Column(type="string", options={"default" = ""})
     */
    private $dating = '';

    /**
     * @var DoctrineCollection
     *
     * @ORM\ManyToMany(targetEntity="Collection", mappedBy="cards")
     */
    private $collections;

    /**
     * @var DoctrineCollection
     *
     * @ORM\ManyToMany(targetEntity="Artist")
     */
    private $artists;

    /**
     * @var DoctrineCollection
     *
     * @ORM\ManyToMany(targetEntity="AntiqueName")
     */
    private $antiqueNames;

    /**
     * @var DoctrineCollection
     *
     * @ORM\ManyToMany(targetEntity="Tag")
     */
    private $tags;

    /**
     * @var DoctrineCollection
     *
     * @ORM\OneToMany(targetEntity="Dating", mappedBy="card")
     */
    private $datings;

    /**
     * @var null|Card
     * @ORM\ManyToOne(targetEntity="Card")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(onDelete="SET NULL")
     * })
     */
    private $original;

    /**
     * @var null|DocumentType
     * @ORM\ManyToOne(targetEntity="DocumentType")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(onDelete="SET NULL")
     * })
     */
    private $documentType;

    /**
     * @var null|Domain
     *
     * @ORM\ManyToOne(targetEntity="Domain")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(onDelete="SET NULL")
     * })
     */
    private $domain;

    /**
     * @var DoctrineCollection
     *
     * @ORM\ManyToMany(targetEntity="Period")
     */
    private $periods;

    /**
     * @var DoctrineCollection
     *
     * @ORM\ManyToMany(targetEntity="Material")
     */
    private $materials;

    /**
     * @var DoctrineCollection
     *
     * @ORM\ManyToMany(targetEntity="Card")
     */
    private $cards;

    /**
     * @var null|Change
     *
     * @ORM\OneToOne(targetEntity="Change", mappedBy="suggestion")
     */
    private $change;

    /**
     * @var string
     * @ORM\Column(type="string", length=191)
     */
    private $documentSize = '';

    /**
     * Constructor
     *
     * @param string $name
     */
    public function __construct(string $name = '')
    {
        $this->setName($name);

        $this->collections = new ArrayCollection();
        $this->artists = new ArrayCollection();
        $this->antiqueNames = new ArrayCollection();
        $this->tags = new ArrayCollection();
        $this->datings = new ArrayCollection();
        $this->cards = new ArrayCollection();
        $this->periods = new ArrayCollection();
        $this->materials = new ArrayCollection();
    }

    /**
     * Return whether this is publicly available to everybody, or only member, or only owner
     *
     * @API\Field(type="Application\Api\Enum\CardVisibilityType")
     *
     * @return string
     */
    public function getVisibility(): string
    {
        return $this->visibility;
    }

    /**
     * Set whether this is publicly available to everybody, or only member, or only owner
     *
     * @API\Input(type="Application\Api\Enum\CardVisibilityType")
     *
     * @param string $visibility
     */
    public function setVisibility(string $visibility): void
    {
        if ($this->visibility === $visibility) {
            return;
        }

        $user = User::getCurrent();
        if ($visibility === self::VISIBILITY_PUBLIC && $user->getRole() !== User::ROLE_ADMINISTRATOR) {
            throw new Exception('Only administrator can make a card public');
        }

        $this->visibility = $visibility;
    }

    /**
     * Get collections this card belongs to
     *
     * @API\Field(type="Collection[]")
     *
     * @return DoctrineCollection
     */
    public function getCollections(): DoctrineCollection
    {
        return $this->collections;
    }

    /**
     * Get the card dating.
     *
     * This is a free form string that will be parsed to **try** and extract
     * some actual date range of dates. Any string is valid, but some parseable
     * values would typically be:
     *
     * - (1620-1652)
     * - 01.05.1917
     * - XIIIe siècle
     * - 1927
     * - c. 1100
     * - Fin du XIIe siècle
     *
     * @return string
     */
    public function getDating(): string
    {
        return $this->dating;
    }

    /**
     * Set the card dating.
     *
     * This is a free form string that will be parsed to **try** and extract
     * some actual date range of dates. Any string is valid, but some parseable
     * values would typically be:
     *
     * - (1620-1652)
     * - 01.05.1917
     * - XIIIe siècle
     * - 1927
     * - c. 1100
     * - Fin du XIIe siècle
     *
     * @param string $dating
     */
    public function setDating(string $dating): void
    {
        if ($dating === $this->dating) {
            return;
        }
        $this->dating = $dating;

        $this->computeDatings();
    }

    /**
     * Return the automatically computed dating periods
     *
     * @API\Field(type="Dating[]")
     *
     * @return DoctrineCollection
     */
    public function getDatings(): DoctrineCollection
    {
        return $this->datings;
    }

    /**
     * Set all artists at once by their names.
     *
     * Non-existing artists will be created automatically.
     *
     * @param string[] $artistNames
     */
    public function setArtists(array $artistNames): void
    {
        $this->artists->clear();

        $artistNames = _em()->getRepository(Artist::class)->getOrCreateByNames($artistNames);
        foreach ($artistNames as $a) {
            $this->artists->add($a);
        }
    }

    /**
     * Set all materials at once.
     *
     * @param Material[] $materials
     */
    public function setMaterials(array $materials): void
    {
        $this->materials->clear();

        $ids = array_map(function ($m) {
            return $m->getId();
        }, $materials);

        $materials = _em()->getRepository(Material::class)->findById($ids);
        foreach ($materials as $material) {
            $this->materials->add($material);
        }
    }

    /**
     * Set all antiqueNames at once.
     *
     * @param AntiqueName[] $antiqueNames
     */
    public function setAntiqueNames(array $antiqueNames): void
    {
        $this->antiqueNames->clear();

        $ids = array_map(function ($n) {
            return $n->getId();
        }, $antiqueNames);

        $antiqueNames = _em()->getRepository(AntiqueName::class)->findById($ids);
        foreach ($antiqueNames as $material) {
            $this->antiqueNames->add($material);
        }
    }

    /**
     * Set all periods at once.
     *
     * @param Period[] $periods
     */
    public function setPeriods(array $periods): void
    {
        $this->periods->clear();

        $ids = array_map(function ($m) {
            return $m->getId();
        }, $periods);

        $periods = _em()->getRepository(Period::class)->findById($ids);
        foreach ($periods as $period) {
            $this->periods->add($period);
        }
    }

    /**
     * Set all tags at once.
     *
     * @param Tag[] $tags
     */
    public function setTags(array $tags): void
    {
        $this->tags->clear();

        $ids = array_map(function ($m) {
            return $m->getId();
        }, $tags);

        $tags = _em()->getRepository(Tag::class)->findById($ids);
        foreach ($tags as $tag) {
            $this->tags->add($tag);
        }

        $this->addEntireHierarchy();
    }

    /**
     * Get artists
     *
     * @API\Field(type="Artist[]")
     *
     * @return DoctrineCollection
     */
    public function getArtists(): DoctrineCollection
    {
        return $this->artists;
    }

    /**
     * Get antiqueNames
     *
     * @API\Field(type="AntiqueName[]")
     *
     * @return DoctrineCollection
     */
    public function getAntiqueNames(): DoctrineCollection
    {
        return $this->antiqueNames;
    }

    /**
     * Add tag
     *
     * @param Tag $tag
     */
    public function addTag(Tag $tag): void
    {
        if (!$this->tags->contains($tag)) {
            $this->tags[] = $tag;
        }
        $this->addEntireHierarchy();
    }

    /**
     * Remove tag
     *
     * @param Tag $tag
     */
    public function removeTag(Tag $tag): void
    {
        $this->tags->removeElement($tag);
        $this->addEntireHierarchy();
    }

    /**
     * Get tags
     *
     * @API\Field(type="Tag[]")
     *
     * @return DoctrineCollection
     */
    public function getTags(): DoctrineCollection
    {
        return $this->tags;
    }

    /**
     * The original card if this is a suggestion
     *
     * @return null|Card
     */
    public function getOriginal(): ?self
    {
        return $this->original;
    }

    /**
     * Defines this card as suggestion for the $original
     *
     * @param null|Card $original
     */
    public function setOriginal(?self $original): void
    {
        $this->original = $original;
    }

    /**
     * @return null|DocumentType
     */
    public function getDocumentType(): ?DocumentType
    {
        return $this->documentType;
    }

    /**
     * @param null|DocumentType $documentType
     */
    public function setDocumentType(?DocumentType $documentType): void
    {
        $this->documentType = $documentType;
    }

    /**
     * @return null|Domain
     */
    public function getDomain(): ?Domain
    {
        return $this->domain;
    }

    /**
     * @param null|Domain $domain
     */
    public function setDomain(?Domain $domain): void
    {
        $this->domain = $domain;
    }

    /**
     * Get periods
     *
     * @API\Field(type="Period[]")
     *
     * @return DoctrineCollection
     */
    public function getPeriods(): DoctrineCollection
    {
        return $this->periods;
    }

    /**
     * Add Period
     *
     * @param Period $period
     */
    public function addPeriod(Period $period): void
    {
        if (!$this->periods->contains($period)) {
            $this->periods[] = $period;
        }
    }

    /**
     * Remove Period
     *
     * @param Period $period
     */
    public function removePeriod(Period $period): void
    {
        $this->periods->removeElement($period);
    }

    /**
     * Get materials
     *
     * @API\Field(type="Material[]")
     *
     * @return DoctrineCollection
     */
    public function getMaterials(): DoctrineCollection
    {
        return $this->materials;
    }

    /**
     * Add Material
     *
     * @param Material $material
     */
    public function addMaterial(Material $material): void
    {
        if (!$this->materials->contains($material)) {
            $this->materials[] = $material;
        }
    }

    /**
     * Remove Material
     *
     * @param Material $material
     */
    public function removeMaterial(Material $material): void
    {
        $this->materials->removeElement($material);
    }

    /**
     * Notify the Card that it was added to a Collection.
     * This should only be called by Collection::addCard()
     *
     * @param Collection $collection
     */
    public function collectionAdded(Collection $collection): void
    {
        $this->collections->add($collection);

        // If we are new and don't have a code yet, set one automatically
        if (!$this->getId() && !$this->getCode()) {
            $code = _em()->getRepository(self::class)->getNextCodeAvailable($collection);
            $this->setCode($code);
        }
    }

    /**
     * Notify the Card that it was removed from a Collection.
     * This should only be called by Collection::removeCard()
     *
     * @param Collection $collection
     */
    public function collectionRemoved(Collection $collection): void
    {
        $this->collections->removeElement($collection);
    }

    /**
     * Notify the Card that a Dating was added.
     * This should only be called by Dating::setCard()
     *
     * @param Dating $dating
     */
    public function datingAdded(Dating $dating): void
    {
        $this->datings->add($dating);
    }

    /**
     * Notify the Card that a Dating was removed.
     * This should only be called by Dating::setCard()
     *
     * @param Dating $dating
     */
    public function datingRemoved(Dating $dating): void
    {
        $this->datings->removeElement($dating);
    }

    /**
     * Get file size in bytes
     *
     * @return int
     */
    public function getFileSize(): int
    {
        return $this->fileSize;
    }

    /**
     * Set file size in bytes
     *
     * @API\Exclude
     *
     * @param int $fileSize
     */
    public function setFileSize(int $fileSize): void
    {
        $this->fileSize = $fileSize;
    }

    /**
     * Get image width
     *
     * @return int
     */
    public function getWidth(): int
    {
        return $this->width;
    }

    /**
     * Set image width
     *
     * @API\Exclude
     *
     * @param int $width
     */
    public function setWidth(int $width): void
    {
        $this->width = $width;
    }

    /**
     * Get image height
     *
     * @return int
     */
    public function getHeight(): int
    {
        return $this->height;
    }

    /**
     * Set image height
     *
     * @API\Exclude
     *
     * @param int $height
     */
    public function setHeight(int $height): void
    {
        $this->height = $height;
    }

    /**
     * Set the image file
     *
     * @API\Input(type="?GraphQL\Upload\UploadType")
     *
     * @param UploadedFileInterface $file
     */
    public function setFile(UploadedFileInterface $file): void
    {
        $this->traitSetFile($file);
        $this->readFileInfo();
    }

    /**
     * Read dimension and size from file on disk
     */
    private function readFileInfo(): void
    {
        global $container;
        $path = $this->getPath();

        /** @var ImagineInterface $imagine */
        $imagine = $container->get(ImagineInterface::class);
        $image = $imagine->open($path);

        // Auto-rotate image if EXIF says it's rotated
        $autorotate = new Autorotate();
        $autorotate->apply($image);
        $image->save($path);

        $size = $image->getSize();

        $this->setWidth($size->getWidth());
        $this->setHeight($size->getHeight());
        $this->setFileSize(filesize($path));
    }

    private function computeDatings(): void
    {
        $rule = new DatingRule();

        // Delete all existing
        foreach ($this->datings as $d) {
            _em()->remove($d);
        }
        $this->datings->clear();

        // Add new one
        $datings = $rule->compute($this->dating);
        foreach ($datings as $d) {
            _em()->persist($d);
            $d->setCard($this);
        }
    }

    /**
     * Copy most of this card data into the given card
     *
     * @param Card $original
     */
    public function copyInto(self $original): void
    {
        // Trigger loading of proxy
        $original->getName();

        $blacklist = [
            'id',
            'visibility',
            '__initializer__',
            '__cloner__',
            '__isInitialized__',
        ];

        if (!$this->hasImage()) {
            $blacklist[] = 'filename';
            $blacklist[] = 'width';
            $blacklist[] = 'height';
            $blacklist[] = 'fileSize';
        }

        // Copy scalars
        foreach ($this as $property => $value) {
            if (in_array($property, $blacklist, true)) {
                continue;
            }

            if (is_scalar($value) || $value === null) {
                $original->$property = $value;
            }
        }

        // Copy a few collection and entities
        $original->artists = clone $this->artists;
        $original->tags = clone $this->tags;
        $original->materials = clone $this->materials;
        $original->periods = clone $this->periods;
        $original->computeDatings();
        $original->institution = $this->institution;
        $original->country = $this->country;
        $original->documentType = $this->documentType;
        $original->domain = $this->domain;

        // Copy file on disk
        if ($this->filename) {
            $original->generateUniqueFilename($this->filename);
            copy($this->getPath(), $original->getPath());
        }
    }

    /**
     * Get related cards
     *
     * @API\Field(type="Card[]")
     *
     * @return DoctrineCollection
     */
    public function getCards(): DoctrineCollection
    {
        return $this->cards;
    }

    /**
     * Add related card
     *
     * @param Card $card
     */
    public function addCard(self $card): void
    {
        if ($card === $this) {
            throw new InvalidArgumentException('A card cannot be related to itself');
        }

        if (!$this->cards->contains($card)) {
            $this->cards[] = $card;
        }

        if (!$card->cards->contains($this)) {
            $card->cards[] = $this;
        }
    }

    /**
     * Remove related card
     *
     * @param Card $card
     */
    public function removeCard(self $card): void
    {
        $this->cards->removeElement($card);
        $card->cards->removeElement($this);
    }

    /**
     * Return the change this card is a suggestion for, if any
     *
     * @return null|Change
     */
    public function getChange(): ?Change
    {
        return $this->change;
    }

    /**
     * Notify the Card that it was added to a Change.
     * This should only be called by Change::addCard()
     *
     * @param null|Change $change
     */
    public function changeAdded(?Change $change): void
    {
        $this->change = $change;
    }

    /**
     * Set documentSize
     *
     * @param string $documentSize
     */
    public function setDocumentSize(string $documentSize): void
    {
        $this->documentSize = $documentSize;
    }

    /**
     * Get documentSize
     *
     * @return string
     */
    public function getDocumentSize(): string
    {
        return $this->documentSize;
    }

    /**
     * Ensure that the entire hierarchy is added, but also make sure that
     * a non-leaf tag is added without one of his leaf.
     */
    private function addEntireHierarchy(): void
    {
        $tags = $this->tags->toArray();
        $this->tags->clear();

        /** @var Tag $tag */
        foreach ($tags as $tag) {
            if ($tag->hasChildren()) {
                continue;
            }

            $this->tags->add($tag);

            foreach ($tag->getParentHierarchy() as $parent) {
                if (!$this->tags->contains($parent)) {
                    $this->tags->add($parent);
                }
            }
        }
    }
}
