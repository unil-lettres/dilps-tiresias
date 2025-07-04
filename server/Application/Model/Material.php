<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Api\Input\Operator\ExcludeSelfAndDescendantsOperatorType;
use Application\Repository\MaterialRepository;
use Application\Traits\HasParent;
use Application\Traits\HasParentInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\Collection as DoctrineCollection;
use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Attribute as API;

/**
 * A material.
 */
#[API\Filter(field: 'custom', operator: ExcludeSelfAndDescendantsOperatorType::class, type: 'id')]
#[ORM\Entity(MaterialRepository::class)]
class Material extends Thesaurus implements HasParentInterface
{
    use HasParent;

    #[ORM\JoinColumn(onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'children')]
    private ?self $parent = null;

    /**
     * @var Collection<int, Material>
     */
    #[ORM\OneToMany(targetEntity: self::class, mappedBy: 'parent')]
    #[ORM\OrderBy(['name' => 'ASC', 'id' => 'ASC'])]
    private DoctrineCollection $children;

    public function __construct()
    {
        parent::__construct();
        $this->children = new ArrayCollection();
    }
}
