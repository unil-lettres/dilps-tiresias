<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasSite;
use Application\Traits\HasSiteInterface;
use Doctrine\ORM\Mapping as ORM;
use InvalidArgumentException;

/**
 * A statistic to record activity per month.
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
     * A year and month, eg: '2019-02'.
     *
     * @ORM\Column(type="string", length=7)
     */
    private string $date;

    /**
     * @ORM\Column(type="integer", options={"default" = 0, "unsigned" = true})
     */
    private int $anonymousPageCount = 0;

    /**
     * @ORM\Column(type="integer", options={"default" = 0, "unsigned" = true})
     */
    private int $defaultPageCount = 0;

    /**
     * @ORM\Column(type="integer", options={"default" = 0, "unsigned" = true})
     */
    private int $aaiPageCount = 0;

    /**
     * @ORM\Column(type="integer", options={"default" = 0, "unsigned" = true})
     */
    private int $anonymousDetailCount = 0;

    /**
     * @ORM\Column(type="integer", options={"default" = 0, "unsigned" = true})
     */
    private int $defaultDetailCount = 0;

    /**
     * @ORM\Column(type="integer", options={"default" = 0, "unsigned" = true})
     */
    private int $aaiDetailCount = 0;

    /**
     * @ORM\Column(type="integer", options={"default" = 0, "unsigned" = true})
     */
    private int $anonymousSearchCount = 0;

    /**
     * @ORM\Column(type="integer", options={"default" = 0, "unsigned" = true})
     */
    private int $defaultSearchCount = 0;

    /**
     * @ORM\Column(type="integer", options={"default" = 0, "unsigned" = true})
     */
    private int $aaiSearchCount = 0;

    /**
     * @ORM\Column(type="integer", options={"default" = 0, "unsigned" = true})
     */
    private int $defaultLoginCount = 0;

    /**
     * @ORM\Column(type="integer", options={"default" = 0, "unsigned" = true})
     */
    private int $aaiLoginCount = 0;

    /**
     * @ORM\Column(type="json")
     */
    private array $defaultLogins = [];

    /**
     * @ORM\Column(type="json")
     */
    private array $aaiLogins = [];

    public function getDate(): string
    {
        return $this->date;
    }

    public function setDate(string $date): void
    {
        $this->date = $date;
    }

    public function getAnonymousPageCount(): int
    {
        return $this->anonymousPageCount;
    }

    public function getDefaultPageCount(): int
    {
        return $this->defaultPageCount;
    }

    public function getAaiPageCount(): int
    {
        return $this->aaiPageCount;
    }

    public function getAnonymousDetailCount(): int
    {
        return $this->anonymousDetailCount;
    }

    public function getDefaultDetailCount(): int
    {
        return $this->defaultDetailCount;
    }

    public function getAaiDetailCount(): int
    {
        return $this->aaiDetailCount;
    }

    public function getAnonymousSearchCount(): int
    {
        return $this->anonymousSearchCount;
    }

    public function getDefaultSearchCount(): int
    {
        return $this->defaultSearchCount;
    }

    public function getAaiSearchCount(): int
    {
        return $this->aaiSearchCount;
    }

    public function getDefaultLoginCount(): int
    {
        return $this->defaultLoginCount;
    }

    public function getAaiLoginCount(): int
    {
        return $this->aaiLoginCount;
    }

    public function getDefaultUniqueLoginCount(): int
    {
        return count($this->defaultLogins);
    }

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
            throw new InvalidArgumentException('User type not supported: ' . $user->getType());
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
            throw new InvalidArgumentException('User type not supported: ' . $user->getType());
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
            throw new InvalidArgumentException('User type not supported: ' . $user->getType());
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
            throw new InvalidArgumentException('User type not supported: ' . $user->getType());
        }
    }
}
