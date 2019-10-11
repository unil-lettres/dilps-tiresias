<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasName;
use Application\Traits\HasParent;
use Application\Traits\HasParentInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * A material
 *
 * @ORM\Entity(repositoryClass="Application\Repository\MaterialRepository")
 */
class Material extends AbstractModel implements HasParentInterface
{
    use HasName;
    use HasParent;

    /**
     * @var Material
     *
     * @ORM\ManyToOne(targetEntity="Material", inversedBy="children")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(onDelete="CASCADE")
     * })
     */
    private $parent;

    /**
     * @var Collection
     *
     * @ORM\OneToMany(targetEntity="Material", mappedBy="parent")
     * @ORM\OrderBy({"name" = "ASC", "id" = "ASC"})
     */
    private $children;

    public function __construct()
    {
        $this->children = new ArrayCollection();
    }

    /**
     * @return Material[]
     */
    public function getParentHierarchy(): array
    {
        $list = [];
        $parent = $this->getParent();

        if ($parent) {
            return array_merge($parent->getParentHierarchy(), [$parent]);
        }

        return $list;
    }
}
