<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Api\FileException;
use Application\Api\Input\Operator\ArtistOrTechniqueAuthorOperatorType;
use Application\Api\Input\Operator\CardYearRangeOperatorType;
use Application\Api\Input\Operator\DatingYearRangeOperatorType;
use Application\Api\Input\Operator\LocalityOrInstitutionLocalityOperatorType;
use Application\Api\Input\Operator\LocationOperatorType;
use Application\Api\Input\Operator\NameOrExpandedNameOperatorType;
use Application\Api\Input\Sorting\Artists;
use Application\Api\Input\Sorting\InstitutionLocality;
use Application\Repository\CardRepository;
use Application\Service\DatingRule;
use Application\Traits\CardSimpleProperties;
use Application\Traits\HasAddress;
use Application\Traits\HasCode;
use Application\Traits\HasFileSize;
use Application\Traits\HasImage;
use Application\Traits\HasInstitution;
use Application\Traits\HasParentInterface;
use Application\Traits\HasRichTextName;
use Application\Traits\HasSite;
use Application\Traits\HasSiteInterface;
use Application\Traits\HasValidation;
use Application\Traits\HasYearRange;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection as DoctrineCollection;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Api\Exception;
use Ecodev\Felix\Model\Image;
use Ecodev\Felix\Utility;
use GraphQL\Doctrine\Attribute as API;
use GraphQL\Doctrine\Definition\EntityID;
use Imagine\Filter\Basic\Autorotate;
use Imagine\Image\ImagineInterface;
use InvalidArgumentException;
use Psr\Http\Message\UploadedFileInterface;
use Throwable;

/**
 * A card containing an image and some information about it.
 */
#[ORM\Index(name: 'card_name_idx', columns: ['name'])]
#[ORM\Index(name: 'card_plain_name_idx', columns: ['plain_name'])]
#[ORM\Index(name: 'card_locality_idx', columns: ['locality'])]
#[ORM\Index(name: 'card_area_idx', columns: ['area'])]
#[ORM\UniqueConstraint(name: 'unique_code', columns: ['code', 'site'])]
#[API\Filter(field: 'nameOrExpandedName', operator: NameOrExpandedNameOperatorType::class, type: 'string')]
#[API\Filter(field: 'artistOrTechniqueAuthor', operator: ArtistOrTechniqueAuthorOperatorType::class, type: 'string')]
#[API\Filter(field: 'localityOrInstitutionLocality', operator: LocalityOrInstitutionLocalityOperatorType::class, type: 'string')]
#[API\Filter(field: 'datingYearRange', operator: DatingYearRangeOperatorType::class, type: 'int')]
#[API\Filter(field: 'cardYearRange', operator: CardYearRangeOperatorType::class, type: 'int')]
#[API\Filter(field: 'custom', operator: LocationOperatorType::class, type: 'string')]
#[API\Sorting(Artists::class)]
#[API\Sorting(InstitutionLocality::class)]
#[API\Sorting(\Application\Api\Input\Sorting\DocumentType::class)]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(CardRepository::class)]
class Card extends AbstractModel implements HasSiteInterface, Image
{
    use CardSimpleProperties;
    use HasAddress;
    use HasCode;
    use HasFileSize;
    use HasImage {
        setFile as traitSetFile;
    }
    use HasInstitution;
    use HasRichTextName;
    use HasSite;
    use HasValidation;
    use HasYearRange;

    private const IMAGE_PATH = 'data/images/';

    final public const VISIBILITY_PRIVATE = 'private';
    final public const VISIBILITY_MEMBER = 'member';
    final public const VISIBILITY_PUBLIC = 'public';

    #[ORM\Column(type: 'CardVisibility', options: ['default' => self::VISIBILITY_PRIVATE])]
    private string $visibility = self::VISIBILITY_PRIVATE;

    #[ORM\Column(type: 'integer')]
    private int $width = 0;

    #[ORM\Column(type: 'integer')]
    private int $height = 0;

    #[ORM\Column(type: 'string', options: ['default' => ''])]
    private string $dating = '';

    /**
     * This is a form of cache of all artist names whose only purpose is to be able
     * to search on artists more easily. It is automatically maintained via DB triggers.
     */
    #[API\Exclude]
    #[ORM\Column(type: 'text', options: ['default' => ''])]
    private string $cachedArtistNames = '';

    /**
     * @var DoctrineCollection<Collection>
     */
    #[ORM\ManyToMany(targetEntity: Collection::class)]
    private DoctrineCollection $collections;

    /**
     * @var DoctrineCollection<Artist>
     */
    #[ORM\ManyToMany(targetEntity: Artist::class)]
    private DoctrineCollection $artists;

    /**
     * @var DoctrineCollection<AntiqueName>
     */
    #[ORM\ManyToMany(targetEntity: AntiqueName::class)]
    private DoctrineCollection $antiqueNames;

    /**
     * @var DoctrineCollection<Tag>
     */
    #[ORM\ManyToMany(targetEntity: Tag::class)]
    private DoctrineCollection $tags;

    /**
     * @var DoctrineCollection<Dating>
     */
    #[ORM\OneToMany(targetEntity: Dating::class, mappedBy: 'card')]
    private DoctrineCollection $datings;

    #[ORM\JoinColumn(onDelete: 'SET NULL')]
    #[ORM\ManyToOne(targetEntity: self::class)]
    private ?Card $original = null;

    #[ORM\JoinColumn(onDelete: 'SET NULL')]
    #[ORM\ManyToOne(targetEntity: DocumentType::class)]
    private ?DocumentType $documentType = null;

    /**
     * @var DoctrineCollection<Domain>
     */
    #[ORM\ManyToMany(targetEntity: Domain::class)]
    private DoctrineCollection $domains;

    /**
     * @var DoctrineCollection<Period>
     */
    #[ORM\ManyToMany(targetEntity: Period::class)]
    private DoctrineCollection $periods;

    /**
     * @var DoctrineCollection<Material>
     */
    #[ORM\ManyToMany(targetEntity: Material::class)]
    private DoctrineCollection $materials;

    /**
     * @var DoctrineCollection<Card>
     */
    #[ORM\ManyToMany(targetEntity: self::class)]
    private DoctrineCollection $cards;

    /**
     * There is actually 0 to 1 change, never more. And this is
     * enforced by DB unique constraints on the mapping side.
     *
     * @var DoctrineCollection<Change>
     */
    #[ORM\OneToMany(targetEntity: Change::class, mappedBy: 'suggestion')]
    private DoctrineCollection $changes;

    #[ORM\Column(type: 'string', length: 191)]
    private string $documentSize = '';

    #[ORM\Column(name: 'legacy_id', type: 'integer', nullable: true)]
    private ?int $legacyId = null;

    /**
     * Constructor.
     */
    public function __construct(string $name = '')
    {
        $this->setName($name);

        $this->changes = new ArrayCollection();
        $this->collections = new ArrayCollection();
        $this->artists = new ArrayCollection();
        $this->antiqueNames = new ArrayCollection();
        $this->tags = new ArrayCollection();
        $this->datings = new ArrayCollection();
        $this->cards = new ArrayCollection();
        $this->domains = new ArrayCollection();
        $this->periods = new ArrayCollection();
        $this->materials = new ArrayCollection();
    }

    /**
     * Return whether this is publicly available to everybody, or only member, or only owner.
     */
    #[API\Field(type: 'Application\Api\Enum\CardVisibilityType')]
    public function getVisibility(): string
    {
        return $this->visibility;
    }

    /**
     * Set whether this is publicly available to everybody, or only member, or only owner.
     */
    #[API\Input(type: 'Application\Api\Enum\CardVisibilityType')]
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
     * Get collections this card belongs to.
     */
    #[API\Field(type: 'Collection[]')]
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
     * Return the automatically computed dating periods.
     */
    #[API\Field(type: 'Dating[]')]
    public function getDatings(): DoctrineCollection
    {
        return $this->datings;
    }

    /**
     * Set all artists at once by their names.
     *
     * Non-existing artists will be created automatically.
     *
     * @param null|string[] $artistNames
     */
    public function setArtists(?array $artistNames): void
    {
        if (null === $artistNames) {
            return;
        }

        $artistRepository = _em()->getRepository(Artist::class);
        $newArtists = $artistRepository->getOrCreateByNames($artistNames, $this->getSite());

        $oldIds = Utility::modelToId($this->artists->toArray());
        sort($oldIds);

        $newIds = Utility::modelToId($newArtists);
        sort($newIds);

        if ($oldIds === $newIds && !in_array(null, $oldIds, true) && !in_array(null, $newIds, true)) {
            return;
        }

        $this->artists->clear();
        foreach ($newArtists as $a) {
            $this->artists->add($a);
        }
    }

    /**
     * Set all materials at once.
     *
     * @param null|EntityID[] $materials
     */
    #[API\Input(type: '?MaterialID[]')]
    public function setMaterials(?array $materials): void
    {
        if (null === $materials) {
            return;
        }

        $this->setEntireCollection($materials, $this->materials, Material::class);
        $this->addEntireHierarchy($this->materials);
    }

    /**
     * Set all antiqueNames at once.
     *
     * @param null|EntityID[] $antiqueNames
     */
    #[API\Input(type: '?AntiqueNameID[]')]
    public function setAntiqueNames(?array $antiqueNames): void
    {
        if (null === $antiqueNames) {
            return;
        }

        $this->setEntireCollection($antiqueNames, $this->antiqueNames, AntiqueName::class);
    }

    /**
     * Set all domains at once.
     *
     * @param null|EntityID[] $domains
     */
    #[API\Input(type: '?DomainID[]')]
    public function setDomains(?array $domains): void
    {
        if (null === $domains) {
            return;
        }

        $this->setEntireCollection($domains, $this->domains, Domain::class);
    }

    /**
     * Set all periods at once.
     *
     * @param null|EntityID[] $periods
     */
    #[API\Input(type: '?PeriodID[]')]
    public function setPeriods(?array $periods): void
    {
        if (null === $periods) {
            return;
        }

        $this->setEntireCollection($periods, $this->periods, Period::class);
    }

    /**
     * Set all tags at once.
     *
     * @param null|EntityID[] $tags
     */
    #[API\Input(type: '?TagID[]')]
    public function setTags(?array $tags): void
    {
        if (null === $tags) {
            return;
        }

        $this->setEntireCollection($tags, $this->tags, Tag::class);
        $this->addEntireHierarchy($this->tags);
    }

    private function setEntireCollection(array $entityIds, DoctrineCollection $collection, string $class): void
    {
        $oldIds = Utility::modelToId($collection->toArray());
        sort($oldIds);

        $ids = Utility::modelToId($entityIds);
        sort($ids);

        if ($oldIds === $ids && !in_array(null, $oldIds, true) && !in_array(null, $ids, true)) {
            return;
        }

        $repository = _em()->getRepository($class);
        $objects = $repository->findBy([
            'id' => $ids,
            'site' => $this->getSite(),
        ]);

        $collection->clear();
        foreach ($objects as $object) {
            $collection->add($object);
        }
    }

    /**
     * Get artists.
     */
    #[API\Field(type: 'Artist[]')]
    public function getArtists(): DoctrineCollection
    {
        return $this->artists;
    }

    /**
     * Get antiqueNames.
     */
    #[API\Field(type: 'AntiqueName[]')]
    public function getAntiqueNames(): DoctrineCollection
    {
        return $this->antiqueNames;
    }

    /**
     * Add tag.
     */
    public function addTag(Tag $tag): void
    {
        if (!$this->tags->contains($tag)) {
            $this->tags[] = $tag;
        }
        $this->addEntireHierarchy($this->tags);
    }

    /**
     * Remove tag.
     */
    public function removeTag(Tag $tag): void
    {
        $this->tags->removeElement($tag);
        $this->addEntireHierarchy($this->tags);
    }

    /**
     * Get tags.
     */
    #[API\Field(type: 'Tag[]')]
    public function getTags(): DoctrineCollection
    {
        return $this->tags;
    }

    /**
     * The original card if this is a suggestion.
     */
    public function getOriginal(): ?self
    {
        return $this->original;
    }

    /**
     * Defines this card as suggestion for the $original.
     */
    public function setOriginal(?self $original): void
    {
        $this->original = $original;
    }

    public function getDocumentType(): ?DocumentType
    {
        return $this->documentType;
    }

    public function setDocumentType(?DocumentType $documentType): void
    {
        $this->documentType = $documentType;
    }

    /**
     * Get domains.
     */
    #[API\Field(type: 'Domain[]')]
    public function getDomains(): DoctrineCollection
    {
        return $this->domains;
    }

    /**
     * Add Domain.
     */
    public function addDomain(Domain $domain): void
    {
        if (!$this->domains->contains($domain)) {
            $this->domains[] = $domain;
        }
    }

    /**
     * Get periods.
     */
    #[API\Field(type: 'Period[]')]
    public function getPeriods(): DoctrineCollection
    {
        return $this->periods;
    }

    /**
     * Add Period.
     */
    public function addPeriod(Period $period): void
    {
        if (!$this->periods->contains($period)) {
            $this->periods[] = $period;
        }
    }

    /**
     * Remove Period.
     */
    public function removePeriod(Period $period): void
    {
        $this->periods->removeElement($period);
    }

    /**
     * Get materials.
     */
    #[API\Field(type: 'Material[]')]
    public function getMaterials(): DoctrineCollection
    {
        return $this->materials;
    }

    /**
     * Add Material.
     */
    public function addMaterial(Material $material): void
    {
        if (!$this->materials->contains($material)) {
            $this->materials[] = $material;
        }

        $this->addEntireHierarchy($this->materials);
    }

    /**
     * Remove Material.
     */
    public function removeMaterial(Material $material): void
    {
        $this->materials->removeElement($material);
        $this->addEntireHierarchy($this->materials);
    }

    /**
     * Add this card into the given collection.
     */
    public function addCollection(Collection $collection): void
    {
        if (!$this->collections->contains($collection)) {
            $this->collections->add($collection);
        }

        // If we are new and don't have a code yet, set one automatically
        if (!$this->getId() && !$this->getCode() && $this->canUpdateCode()) {
            /** @var CardRepository $userRepository */
            $userRepository = _em()->getRepository(self::class);
            $code = $userRepository->getNextCodeAvailable($collection);
            $this->setCode($code);
        }
    }

    /**
     * Remove this card from given collection.
     */
    public function removeCollection(Collection $collection): void
    {
        $this->collections->removeElement($collection);
    }

    /**
     * Notify the Card that a Dating was added.
     * This should only be called by Dating::setCard().
     */
    public function datingAdded(Dating $dating): void
    {
        $this->datings->add($dating);
    }

    /**
     * Notify the Card that a Dating was removed.
     * This should only be called by Dating::setCard().
     */
    public function datingRemoved(Dating $dating): void
    {
        $this->datings->removeElement($dating);
    }

    /**
     * Get image width.
     */
    public function getWidth(): int
    {
        return $this->width;
    }

    /**
     * Set image width.
     */
    #[API\Exclude]
    public function setWidth(int $width): void
    {
        $this->width = $width;
    }

    /**
     * Get image height.
     */
    public function getHeight(): int
    {
        return $this->height;
    }

    /**
     * Set image height.
     */
    #[API\Exclude]
    public function setHeight(int $height): void
    {
        $this->height = $height;
    }

    /**
     * Set the image file.
     */
    #[API\Input(type: '?GraphQL\Upload\UploadType')]
    public function setFile(UploadedFileInterface $file): void
    {
        $this->traitSetFile($file);

        try {
            $this->readFileInfo();
        } catch (Throwable $e) {
            throw new FileException($file, $e);
        }
    }

    /**
     * Get legacy id.
     */
    public function getLegacyId(): ?int
    {
        return $this->legacyId;
    }

    /**
     * Set legacy id.
     */
    #[API\Exclude]
    public function setLegacyId(int $legacyId): void
    {
        $this->legacyId = $legacyId;
    }

    /**
     * Read dimension and size from file on disk.
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
     * Copy most of this card data into the given card.
     */
    public function copyInto(self $original): void
    {
        // Trigger loading of proxy
        $original->getName();

        $blacklist = [
            'id',
            'visibility',
            'code',
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
        $original->domains = clone $this->domains;
        $original->periods = clone $this->periods;
        $original->computeDatings();
        $original->institution = $this->institution;
        $original->country = $this->country;
        $original->documentType = $this->documentType;

        // Copy file on disk
        if ($this->filename) {
            $original->generateUniqueFilename($this->filename);
            copy($this->getPath(), $original->getPath());
        }
    }

    /**
     * Get related cards.
     */
    #[API\Field(type: 'Card[]')]
    public function getCards(): DoctrineCollection
    {
        return $this->cards;
    }

    /**
     * Add related card.
     */
    public function addCard(self $card): void
    {
        if ($card === $this) {
            throw new InvalidArgumentException('A card cannot be related to itself');
        }

        if (!$this->cards->contains($card)) {
            $this->cards[] = $card;
        }

        if (!$card->getCards()->contains($this)) {
            $card->getCards()->add($this);
        }
    }

    /**
     * Remove related card.
     */
    public function removeCard(self $card): void
    {
        $this->cards->removeElement($card);
        $card->getCards()->removeElement($this);
    }

    /**
     * Return the change this card is a suggestion for, if any.
     */
    public function getChange(): ?Change
    {
        return $this->changes->first() ?: null;
    }

    /**
     * Notify the Card that it was added to a Change.
     * This should only be called by Change::addCard().
     */
    public function changeAdded(?Change $change): void
    {
        $this->changes->clear();
        if ($change) {
            $this->changes->add($change);
        }
    }

    /**
     * Set documentSize.
     */
    public function setDocumentSize(string $documentSize): void
    {
        $this->documentSize = $documentSize;
    }

    /**
     * Get documentSize.
     */
    public function getDocumentSize(): string
    {
        return $this->documentSize;
    }

    /**
     * Ensure that the entire hierarchy is added, but also make sure that
     * a non-leaf tag is added without one of his leaf.
     */
    private function addEntireHierarchy(DoctrineCollection $collection): void
    {
        $objects = $collection->toArray();
        $collection->clear();

        /** @var HasParentInterface $object */
        foreach ($objects as $object) {
            if ($object->hasChildren()) {
                continue;
            }

            $collection->add($object);

            foreach ($object->getParentHierarchy() as $parent) {
                if (!$collection->contains($parent)) {
                    $collection->add($parent);
                }
            }
        }
    }
}
