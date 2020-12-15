<?php

declare(strict_types=1);

namespace Application\Model;

use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Annotation as API;
use Psr\Http\Message\UploadedFileInterface;
use Throwable;

/**
 * An uploaded file that is related to a card (pdf/docx/xlsx/etc.)
 *
 * @ORM\HasLifecycleCallbacks
 * @ORM\Entity(repositoryClass="Application\Repository\FileRepository")
 * @ORM\Table(uniqueConstraints={
 *     @ORM\UniqueConstraint(name="unique_name", columns={"filename"})
 * })
 */
class File extends AbstractModel implements \Ecodev\Felix\Model\File
{
    /**
     * @var Card
     *
     * @ORM\ManyToOne(targetEntity="Card")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(nullable=false, onDelete="CASCADE")
     * })
     */
    private $card;

    use \Ecodev\Felix\Model\Traits\File {
        setFile as traitSetFile;
    }

    public function setCard(Card $card): void
    {
        $this->card = $card;
    }

    public function getCard(): Card
    {
        return $this->card;
    }

    /**
     * Set the image file
     *
     * @API\Input(type="?GraphQL\Upload\UploadType")
     */
    public function setFile(UploadedFileInterface $file): void
    {
        try {
            $this->traitSetFile($file);
        } catch (Throwable $e) {
            throw new \Ecodev\Felix\Api\Exception('Erreur avec le fichier : ' . $file->getClientFilename(), 0, $e);
        }
    }

    protected function getAcceptedMimeTypes(): array
    {
        // This list should be kept in sync with client
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
