<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasParent;
use Application\Traits\HasParentInterface;
use Application\Traits\HasSite;
use Application\Traits\HasSiteInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Model\Traits\HasName;
use GraphQL\Doctrine\Annotation as API;

/**
 * A material.
 *
 * @ORM\Entity(repositoryClass="Application\Repository\MaterialRepository")
 * @API\Filters({
 *     @API\Filter(field="custom", operator="Application\Api\Input\Operator\ExcludeSelfAndDescendantsOperatorType", type="id"),
 * })
 */
class Material extends AbstractModel implements HasParentInterface, HasSiteInterface
{
    use HasName;
    use HasParent;
    use HasSite;

    /**
     * @var null|Material
     *
     * @ORM\ManyToOne(targetEntity="Material", inversedBy="children")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(onDelete="CASCADE")
     * })
     */
    private $parent;

    /**
     * @var Collection<Material>
     *
     * @ORM\OneToMany(targetEntity="Material", mappedBy="parent")
     * @ORM\OrderBy({"name" = "ASC", "id" = "ASC"})
     */
    private $children;

    public function __construct()
    {
        $this->children = new ArrayCollection();
    }
}
