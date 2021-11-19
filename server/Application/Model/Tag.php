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

/**
 * A tag.
 *
 * @ORM\Entity(repositoryClass="Application\Repository\TagRepository")
 */
class Tag extends AbstractModel implements HasParentInterface, HasSiteInterface
{
    use HasName;
    use HasParent;
    use HasSite;

    /**
     * @var null|Tag
     *
     * @ORM\ManyToOne(targetEntity="Tag", inversedBy="children")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(onDelete="CASCADE")
     * })
     */
    private $parent;

    /**
     * @var Collection<Tag>
     *
     * @ORM\OneToMany(targetEntity="Tag", mappedBy="parent")
     * @ORM\OrderBy({"name" = "ASC", "id" = "ASC"})
     */
    private $children;

    public function __construct()
    {
        $this->children = new ArrayCollection();
    }
}
