<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Api\Input\Operator\ExcludeSelfAndDescendantsOperatorType;
use Application\Repository\TagRepository;
use Application\Traits\HasParent;
use Application\Traits\HasParentInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Attribute as API;

/**
 * A tag.
 */
#[API\Filter(field: 'custom', operator: ExcludeSelfAndDescendantsOperatorType::class, type: 'id')]
#[ORM\Entity(TagRepository::class)]
class Tag extends Thesaurus implements HasParentInterface
{
    use HasParent;

    /**
     * @var null|Tag
     */
    #[ORM\JoinColumn(onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'children')]
    private $parent;

    /**
     * @var Collection<Tag>
     */
    #[ORM\OneToMany(targetEntity: self::class, mappedBy: 'parent')]
    #[ORM\OrderBy(['name' => 'ASC', 'id' => 'ASC'])]
    private $children;

    public function __construct()
    {
        parent::__construct();
        $this->children = new ArrayCollection();
    }
}
