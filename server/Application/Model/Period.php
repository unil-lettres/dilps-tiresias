<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Api\Input\Operator\ExcludeSelfAndDescendantsOperatorType;
use Application\Repository\PeriodRepository;
use Application\Traits\HasParent;
use Application\Traits\HasParentInterface;
use Application\Traits\HasSorting;
use Application\Traits\HasYearRange;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\Collection as DoctrineCollection;
use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Attribute as API;

/**
 * An exact period in time with a name and expressed in years.
 */
#[API\Filter(field: 'custom', operator: ExcludeSelfAndDescendantsOperatorType::class, type: 'id')]
#[ORM\Entity(PeriodRepository::class)]
class Period extends Thesaurus implements HasParentInterface
{
    use HasParent;
    use HasSorting;
    use HasYearRange;

    #[ORM\JoinColumn(onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'children')]
    private ?self $parent = null;

    /**
     * @var Collection<Period>
     */
    #[ORM\OneToMany(targetEntity: self::class, mappedBy: 'parent')]
    #[ORM\OrderBy(['name' => 'ASC', 'id' => 'ASC'])]
    private DoctrineCollection $children;

    public function __construct()
    {
        parent::__construct();
        $this->children = new ArrayCollection();
    }

    /**
     * Get children periods.
     */
    public function getChildren(): Collection
    {
        return $this->children;
    }
}
