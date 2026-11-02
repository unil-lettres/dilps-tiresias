<?php

declare(strict_types=1);

namespace ApplicationTest\Api\Field\Mutation;

use Application\Api\Field\Mutation\CreateExport;
use Application\Api\Schema;
use Application\Enum\ExportFormat;
use Application\Enum\Site;
use Application\Model\User;
use Application\Repository\UserRepository;
use ApplicationTest\Traits\TestWithTransaction;
use Ecodev\Felix\Api\Exception;
use GraphQL\GraphQL;
use PHPUnit\Framework\TestCase;

class CreateExportTest extends TestCase
{
    use TestWithTransaction;

    public function testZipCanReachMaximumSize(): void
    {
        $this->setCardFileSize(5_000_000_000);

        $export = CreateExport::create($this->getArgs(ExportFormat::Zip));

        self::assertSame(ExportFormat::Zip, $export->getFormat());
    }

    public function testValidationTellsUserThatZipExceedsMaximumSize(): void
    {
        $this->setCardFileSize(5_300_000_000);

        $query = '{ validateExport(input: {format: Zip, cards: ["6005"], site: Dilps}) }';
        $result = GraphQL::executeQuery(new Schema(), $query)->toArray();

        self::assertSame(['data' => ['validateExport' => "L'export en Zip est limité à 5 Go, mais la sélection actuelle est de 5,3 Go."]], $result);
    }

    public function testZipCannotExceedMaximumSize(): void
    {
        $this->setCardFileSize(5_000_000_001);

        $this->expectException(Exception::class);
        $this->expectExceptionMessage("L'export en Zip est limité à 5 Go, mais la sélection actuelle est de 5,1 Go.");

        CreateExport::create($this->getArgs(ExportFormat::Zip));
    }

    public function testOtherFormatsAreNotLimitedBySize(): void
    {
        $this->setCardFileSize(5_000_000_001);

        $export = CreateExport::create($this->getArgs(ExportFormat::Pptx));

        self::assertSame(ExportFormat::Pptx, $export->getFormat());
    }

    private function setCardFileSize(int $fileSize): void
    {
        /** @var UserRepository $userRepository */
        $userRepository = _em()->getRepository(User::class);
        User::setCurrent($userRepository->getOneByLogin('administrator', Site::Dilps));

        _em()->getConnection()->executeStatement('UPDATE card SET file_size = :fileSize WHERE id = 6005', ['fileSize' => $fileSize]);
    }

    private function getArgs(ExportFormat $format): array
    {
        return [
            'input' => [
                'format' => $format,
                'cards' => [6005],
                'collections' => [],
                'site' => Site::Dilps,
            ],
        ];
    }
}
