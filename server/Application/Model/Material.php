<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Api\Input\Operator\ExcludeSelfAndDescendantsOperatorType;
use Application\Repository\MaterialRepository;
use Application\Traits\HasParent;
use Application\Traits\HasParentInterface;
use Application\Traits\HasSite;
use Application\Traits\HasSiteInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Model\Traits\HasName;
use GraphQL\Doctrine\Attribute as API;

/**
 * A material.
 */
#[API\Filter(field: 'custom', operator: ExcludeSelfAndDescendantsOperatorType::class, type: 'id')]
#[ORM\Entity(MaterialRepository::class)]
class Material extends AbstractModel implements HasParentInterface, HasSiteInterface
{
    use HasName;
    use HasParent;
    use HasSite;

    /**
     * @var null|Material
     */
    #[ORM\JoinColumn(onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'children')]
    private $parent;

    /**
     * @var Collection<Material>
     */
    #[ORM\OneToMany(targetEntity: self::class, mappedBy: 'parent')]
    #[ORM\OrderBy(['name' => 'ASC', 'id' => 'ASC'])]
    private $children;

    public function __construct()
    {
        $this->children = new ArrayCollection();
    }
}
