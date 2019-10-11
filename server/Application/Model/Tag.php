<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasName;
use Application\Traits\HasParent;
use Application\Traits\HasParentInterface;
use Application\Traits\HasSite;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * A tag
 *
 * @ORM\Entity(repositoryClass="Application\Repository\TagRepository")
 */
class Tag extends AbstractModel implements HasParentInterface
{
    use HasName;
    use HasParent;

    use HasSite;

    /**
     * @var Tag
     *
     * @ORM\ManyToOne(targetEntity="Tag", inversedBy="children")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(onDelete="CASCADE")
     * })
     */
    private $parent;

    /**
     * @var Collection
     *
     * @ORM\OneToMany(targetEntity="Tag", mappedBy="parent")
     * @ORM\OrderBy({"name" = "ASC", "id" = "ASC"})
     */
    private $children;

    public function __construct()
    {
        $this->children = new ArrayCollection();
    }

    /**
     * @return Tag[]
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
