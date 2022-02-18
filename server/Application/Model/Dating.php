<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Utility;
use Cake\Chronos\Chronos;
use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Annotation as API;

/**
 * An exact dating period expressed in Julian Days and automatically computed
 * from an approximate, lose string value.
 *
 * Julian days are used instead of standard date format because MariaDB does not
 * support older year than 1000 and we are often much older than that (before Christ)
 *
 * @ORM\Entity(repositoryClass="Application\Repository\DatingRepository")
 */
class Dating extends AbstractModel
{
    /**
     * @ORM\Column(name="`from`", type="integer")
     */
    private int $from;

    /**
     * @ORM\Column(name="`to`", type="integer")
     */
    private int $to;

    /**
     * @ORM\ManyToOne(targetEntity="Card", inversedBy="datings")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(onDelete="CASCADE", nullable=false)
     * })
     */
    private ?\Application\Model\Card $card = null;

    /**
     * Return the automatically computed beginning of dating period.
     */
    public function getFrom(): Chronos
    {
        return Utility::julianToDate($this->from);
    }

    /**
     * @API\Exclude
     */
    public function setFrom(Chronos $from): void
    {
        $this->from = Utility::dateToJulian($from);
    }

    /**
     * Return the automatically computed end of dating period.
     */
    public function getTo(): Chronos
    {
        return Utility::julianToDate($this->to);
    }

    /**
     * @API\Exclude
     */
    public function setTo(Chronos $to): void
    {
        $this->to = Utility::dateToJulian($to);
    }

    public function getCard(): Card
    {
        return $this->card;
    }

    public function setCard(Card $card): void
    {
        if ($this->card) {
            $this->card->datingRemoved($this);
        }

        $this->card = $card;
        $this->card->datingAdded($this);
    }
}
