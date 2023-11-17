<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Api\FileException;
use Application\Repository\FileRepository;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Model\Traits\HasName;
use GraphQL\Doctrine\Attribute as API;
use Psr\Http\Message\UploadedFileInterface;
use Throwable;

/**
 * An uploaded file that is related to a card (pdf/docx/xlsx/etc.).
 */
#[ORM\UniqueConstraint(name: 'unique_name', columns: ['filename'])]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(FileRepository::class)]
class File extends AbstractModel implements \Ecodev\Felix\Model\File
{
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: Card::class)]
    private ?Card $card = null;

    use \Ecodev\Felix\Model\Traits\File {
        setFile as traitSetFile;
    }
    use HasName;

    public function setCard(Card $card): void
    {
        $this->card = $card;
    }

    public function getCard(): Card
    {
        return $this->card;
    }

    /**
     * Set the file.
     */
    #[API\Input(type: '?GraphQL\Upload\UploadType')]
    public function setFile(UploadedFileInterface $file): void
    {
        try {
            $this->traitSetFile($file);

            // Default to filename as name
            if (!$this->getName()) {
                $this->setName($file->getClientFilename());
            }
        } catch (Throwable $e) {
            throw new FileException($file, $e);
        }
    }

    protected function getAcceptedMimeTypes(): array
    {
        // This list should be kept in sync with FilesComponent.accept
        return [
            'application/msword',
            'application/pdf',
            'application/x-pdf',
            'application/vnd.ms-excel',
            'application/vnd.oasis.opendocument.spreadsheet',
            'application/vnd.oasis.opendocument.text',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
    }
}
