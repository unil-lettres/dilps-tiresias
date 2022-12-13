<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasParent;
use Application\Traits\HasParentInterface;
use Application\Traits\HasSite;
use Application\Traits\HasSiteInterface;
use Application\Traits\HasSorting;
use Application\Traits\HasYearRange;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Model\Traits\HasName;
use GraphQL\Doctrine\Annotation as API;

/**
 * An exact period in time with a name and expressed in years.
 *
 * @ORM\Entity(repositoryClass="Application\Repository\PeriodRepository")
 * @API\Filters({
 *     @API\Filter(field="custom", operator="Application\Api\Input\Operator\ExcludeSelfAndDescendantsOperatorType", type="id"),
 * })
 */
class Period extends AbstractModel implements HasParentInterface, HasSiteInterface
{
    use HasName;
    use HasParent;
    use HasSite;
    use HasSorting;
    use HasYearRange;

    /**
     * @var null|Period
     *
     * @ORM\ManyToOne(targetEntity="Period", inversedBy="children")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(onDelete="CASCADE")
     * })
     */
    private $parent;

    /**
     * @var Collection<Period>
     *
     * @ORM\OneToMany(targetEntity="Period", mappedBy="parent")
     * @ORM\OrderBy({"name" = "ASC", "id" = "ASC"})
     */
    private $children;

    public function __construct()
    {
        $this->children = new ArrayCollection();
    }

    /**
     * Get children periods.
     *
     * @API\Field(type="Period[]")
     */
    public function getChildren(): Collection
    {
        return $this->children;
    }
}
