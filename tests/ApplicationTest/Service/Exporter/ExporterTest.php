<?php

declare(strict_types=1);

namespace ApplicationTest\Service\Exporter;

use Application\Enum\ExportStatus;
use Application\Enum\Site;
use Application\Model\Export;
use Application\Model\User;
use Application\Repository\UserRepository;
use Application\Service\Exporter\Exporter;
use ApplicationTest\Traits\TestWithTransaction;
use PHPUnit\Framework\TestCase;

class ExporterTest extends TestCase
{
    use TestWithTransaction;

    public function testExport(): void
    {
        // Exports are only accessible to logged-in users
        /** @var UserRepository $userRepository */
        $userRepository = $this->getEntityManager()->getRepository(User::class);
        User::setCurrent($userRepository->getOneByLogin('administrator', Site::Dilps));

        /** @var Export $export */
        $export = $this->getEntityManager()->getReference(Export::class, 14001);

        global $container;

        /** @var Exporter $exporter */
        $exporter = $container->get(Exporter::class);

        $export = $exporter->export($export);

        self::assertSame(ExportStatus::Done, $export->getStatus());
        self::assertSame(182428, $export->getFileSize());
        self::assertNotEmpty($export->getFilename());
        self::assertFileExists($export->getPath());
        self::assertNotNull($export->getStart());
        self::assertNotNull($export->getDuration());
        self::assertNotNull($export->getMemory());

        unlink($export->getPath());
    }
}
