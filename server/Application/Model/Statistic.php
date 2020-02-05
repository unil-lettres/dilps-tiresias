<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasSite;
use Application\Traits\HasSiteInterface;
use Doctrine\ORM\Mapping as ORM;

/**
 * A statistic to record activity per month
 *
 * - "Page" is any visited pages
 * - "Detail" is the detail page of a card
 * - "Search" is a search submission for cards
 * - "Login" is when a user logs in, possibly multiple times
 * - "UniqueLogin" is a when a unique user logs in (so only one time per user)
 *
 * @ORM\Entity(repositoryClass="Application\Repository\StatisticRepository")
 * @ORM\Table(uniqueConstraints={
 *     @ORM\UniqueConstraint(name="unique_date", columns={"date", "site"})
 * })
 */
class Statistic extends AbstractModel implements HasSiteInterface
{
    use HasSite;

    /**
     * A year and month, eg: '2019-02'
     *
     * @var string
     *
     * @ORM\Column(type="string", length=7)
     */
    private $date;

    /**
     * @var int
     *
     * @ORM\Column(type="integer", options={"default" = 0, "unsigned" = true})
     */
    private $anonymousPageCount = 0;

    /**
     * @var int
     *
     * @ORM\Column(type="integer", options={"default" = 0, "unsigned" = true})
     */
    private $defaultPageCount = 0;

    /**
     * @var int
     *
     * @ORM\Column(type="integer", options={"default" = 0, "unsigned" = true})
     */
    private $aaiPageCount = 0;

    /**
     * @var int
     *
     * @ORM\Column(type="integer", options={"default" = 0, "unsigned" = true})
     */
    private $anonymousDetailCount = 0;

    /**
     * @var int
     *
     * @ORM\Column(type="integer", options={"default" = 0, "unsigned" = true})
     */
    private $defaultDetailCount = 0;

    /**
     * @var int
     *
     * @ORM\Column(type="integer", options={"default" = 0, "unsigned" = true})
     */
    private $aaiDetailCount = 0;

    /**
     * @var int
     *
     * @ORM\Column(type="integer", options={"default" = 0, "unsigned" = true})
     */
    private $anonymousSearchCount = 0;

    /**
     * @var int
     *
     * @ORM\Column(type="integer", options={"default" = 0, "unsigned" = true})
     */
    private $defaultSearchCount = 0;

    /**
     * @var int
     *
     * @ORM\Column(type="integer", options={"default" = 0, "unsigned" = true})
     */
    private $aaiSearchCount = 0;

    /**
     * @var int
     *
     * @ORM\Column(type="integer", options={"default" = 0, "unsigned" = true})
     */
    private $defaultLoginCount = 0;

    /**
     * @var int
     *
     * @ORM\Column(type="integer", options={"default" = 0, "unsigned" = true})
     */
    private $aaiLoginCount = 0;

    /**
     * @var array
     *
     * @ORM\Column(type="json")
     */
    private $defaultLogins = [];

    /**
     * @var array
     *
     * @ORM\Column(type="json")
     */
    private $aaiLogins = [];

    /**
     * @return string
     */
    public function getDate(): string
    {
        return $this->date;
    }

    /**
     * @param string $date
     */
    public function setDate(string $date): void
    {
        $this->date = $date;
    }

    /**
     * @return int
     */
    public function getAnonymousPageCount(): int
    {
        return $this->anonymousPageCount;
    }

    /**
     * @return int
     */
    public function getDefaultPageCount(): int
    {
        return $this->defaultPageCount;
    }

    /**
     * @return int
     */
    public function getAaiPageCount(): int
    {
        return $this->aaiPageCount;
    }

    /**
     * @return int
     */
    public function getAnonymousDetailCount(): int
    {
        return $this->anonymousDetailCount;
    }

    /**
     * @return int
     */
    public function getDefaultDetailCount(): int
    {
        return $this->defaultDetailCount;
    }

    /**
     * @return int
     */
    public function getAaiDetailCount(): int
    {
        return $this->aaiDetailCount;
    }

    /**
     * @return int
     */
    public function getAnonymousSearchCount(): int
    {
        return $this->anonymousSearchCount;
    }

    /**
     * @return int
     */
    public function getDefaultSearchCount(): int
    {
        return $this->defaultSearchCount;
    }

    /**
     * @return int
     */
    public function getAaiSearchCount(): int
    {
        return $this->aaiSearchCount;
    }

    /**
     * @return int
     */
    public function getDefaultLoginCount(): int
    {
        return $this->defaultLoginCount;
    }

    /**
     * @return int
     */
    public function getAaiLoginCount(): int
    {
        return $this->aaiLoginCount;
    }

    /**
     * @return int
     */
    public function getDefaultUniqueLoginCount(): int
    {
        return count($this->defaultLogins);
    }

    /**
     * @return int
     */
    public function getAaiUniqueLoginCount(): int
    {
        return count($this->aaiLogins);
    }

    public function recordPage(): void
    {
        $user = User::getCurrent();
        if (!$user) {
            ++$this->anonymousPageCount;
        } elseif ($user->getType() === User::TYPE_DEFAULT) {
            ++$this->defaultPageCount;
        } elseif ($user->getType() === User::TYPE_AAI) {
            ++$this->aaiPageCount;
        } else {
            throw new \InvalidArgumentException('User type not supported: ' . $user->getType());
        }
    }

    public function recordDetail(): void
    {
        $user = User::getCurrent();
        if (!$user) {
            ++$this->anonymousDetailCount;
        } elseif ($user->getType() === User::TYPE_DEFAULT) {
            ++$this->defaultDetailCount;
        } elseif ($user->getType() === User::TYPE_AAI) {
            ++$this->aaiDetailCount;
        } else {
            throw new \InvalidArgumentException('User type not supported: ' . $user->getType());
        }
    }

    public function recordSearch(): void
    {
        $user = User::getCurrent();
        if (!$user) {
            ++$this->anonymousSearchCount;
        } elseif ($user->getType() === User::TYPE_DEFAULT) {
            ++$this->defaultSearchCount;
        } elseif ($user->getType() === User::TYPE_AAI) {
            ++$this->aaiSearchCount;
        } else {
            throw new \InvalidArgumentException('User type not supported: ' . $user->getType());
        }
    }

    public function recordLogin(): void
    {
        $user = User::getCurrent();
        if ($user->getType() === User::TYPE_DEFAULT) {
            ++$this->defaultLoginCount;

            if (!in_array($user->getId(), $this->defaultLogins, true)) {
                $this->defaultLogins[] = $user->getId();
            }
        } elseif ($user->getType() === User::TYPE_AAI) {
            ++$this->aaiLoginCount;

            if (!in_array($user->getId(), $this->aaiLogins, true)) {
                $this->aaiLogins[] = $user->getId();
            }
        } else {
            throw new \InvalidArgumentException('User type not supported: ' . $user->getType());
        }
    }
}
