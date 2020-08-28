<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasName;
use Application\Traits\HasParent;
use Application\Traits\HasParentInterface;
use Application\Traits\HasSite;
use Application\Traits\HasSiteInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * A domain
 *
 * @ORM\Entity(repositoryClass="Application\Repository\DomainRepository")
 */
class Domain extends AbstractModel implements HasParentInterface, HasSiteInterface
{
    use HasName;
    use HasParent;
    use HasSite;

    /**
     * @var Domain
     *
     * @ORM\ManyToOne(targetEntity="Domain", inversedBy="children")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(onDelete="CASCADE")
     * })
     */
    private $parent;

    /**
     * @var Collection
     *
     * @ORM\OneToMany(targetEntity="Domain", mappedBy="parent")
     * @ORM\OrderBy({"name" = "ASC", "id" = "ASC"})
     */
    private $children;

    public function __construct()
    {
        $this->children = new ArrayCollection();
    }
}
