<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Api\Input\Sorting\Owner;
use Application\Repository\ChangeRepository;
use Application\Traits\HasSite;
use Application\Traits\HasSiteInterface;
use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Attribute as API;

/**
 * A change suggested by a user to be accepted or rejected by administrators.
 */
#[ORM\Table('`change`')]
#[API\Sorting(Owner::class)]
#[ORM\Entity(ChangeRepository::class)]
class Change extends AbstractModel implements HasSiteInterface
{
    final public const TYPE_CREATE = 'create';
    final public const TYPE_UPDATE = 'update';
    final public const TYPE_DELETE = 'delete';

    use HasSite;

    #[ORM\Column(type: 'ChangeType', options: ['default' => self::TYPE_UPDATE])]
    private string $type = self::TYPE_UPDATE;

    #[ORM\JoinColumn(onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: Card::class)]
    private ?Card $original = null;

    #[ORM\JoinColumn(unique: true, onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: Card::class, inversedBy: 'changes')]
    private ?Card $suggestion = null;

    #[ORM\Column(type: 'text')]
    private string $request = '';

    /**
     * Get the type of change.
     */
    #[API\Field(type: 'Application\Api\Enum\ChangeTypeType')]
    public function getType(): string
    {
        return $this->type;
    }

    /**
     * Set the type of change.
     */
    #[API\Field(type: 'Application\Api\Enum\ChangeTypeType')]
    public function setType(string $type): void
    {
        $this->type = $type;
    }

    /**
     * Get the original card on which to apply change.
     *
     * It will be `null` if the change type is `create`, otherwise
     * it mus be set.
     */
    public function getOriginal(): ?Card
    {
        return $this->original;
    }

    /**
     * Set the original card on which to apply change.
     */
    public function setOriginal(?Card $original): void
    {
        $this->original = $original;
    }

    /**
     * Get the card containing the suggested changes.
     *
     * It will be `null` if the change type is `delete`, otherwise
     * it mus be set.
     */
    public function getSuggestion(): ?Card
    {
        return $this->suggestion;
    }

    public function setSuggestion(?Card $suggestion): void
    {
        if ($this->suggestion) {
            $this->suggestion->changeAdded(null);
        }

        $this->suggestion = $suggestion;

        if ($this->suggestion) {
            $this->suggestion->changeAdded($this);
        }
    }

    /**
     * Get the message from the submitter explaining the reason of the change request.
     */
    public function getRequest(): string
    {
        return $this->request;
    }

    /**
     * Set the message from the submitter explaining the reason of the change request.
     */
    public function setRequest(string $request): void
    {
        $this->request = $request;
    }
}
