<?php

declare(strict_types=1);

namespace Application\Traits;

use Application\Model\User;
use Cake\Chronos\Chronos;
use Doctrine\ORM\Mapping as ORM;

/**
 * Fields to represent data and image validation.
 */
trait HasValidation
{
    /**
     * @var Chronos
     */
    #[ORM\Column(type: 'datetime', nullable: true)]
    private $imageValidationDate;

    /**
     * @var Chronos
     */
    #[ORM\Column(type: 'datetime', nullable: true)]
    private $dataValidationDate;

    /**
     * @var null|User
     */
    #[ORM\ManyToOne(targetEntity: User::class)]
    private $imageValidator;

    /**
     * @var null|User
     */
    #[ORM\ManyToOne(targetEntity: User::class)]
    private $dataValidator;

    /**
     * Get image validation date.
     */
    public function getImageValidationDate(): ?Chronos
    {
        return $this->imageValidationDate;
    }

    /**
     * Get data validation date.
     */
    public function getDataValidationDate(): ?Chronos
    {
        return $this->dataValidationDate;
    }

    /**
     * Get the user who validated the image.
     */
    public function getImageValidator(): ?User
    {
        return $this->imageValidator;
    }

    /**
     * Get the user who validated the data.
     */
    public function getDataValidator(): ?User
    {
        return $this->dataValidator;
    }

    /**
     * Mark the image as validated now by current user.
     */
    public function validateImage(): void
    {
        $this->imageValidationDate = new Chronos();
        $this->imageValidator = User::getCurrent();
    }

    /**
     * Mark the data as validated now by current user.
     */
    public function validateData(): void
    {
        $this->dataValidationDate = new Chronos();
        $this->dataValidator = User::getCurrent();
    }
}
