<?php

declare(strict_types=1);

namespace ApplicationTest\Service;

use Application\DBAL\Types\MessageTypeType;
use Application\Model\Export;
use Application\Model\Message;
use Application\Model\User;
use Application\Service\MessageQueuer;
use Doctrine\ORM\EntityManager;
use Ecodev\Felix\Service\MessageRenderer;
use Laminas\View\Renderer\RendererInterface;

class MessageQueuerTest extends \PHPUnit\Framework\TestCase
{
    private function createMockMessageQueuer(): MessageQueuer
    {
        global $container;

        $entityManager = $container->get(EntityManager::class);
        $viewRenderer = $container->get(RendererInterface::class);
        $messageRenderer = new MessageRenderer($viewRenderer, 'dilps.lan');

        $messageQueuer = new MessageQueuer(
            $entityManager,
            $messageRenderer,
        );

        return $messageQueuer;
    }

    public function testQueueRegister(): void
    {
        $user = $this->createMockUserMinimal();
        $export = $this->createMockExport();
        $messageQueuer = $this->createMockMessageQueuer();
        $message = $messageQueuer->queueExportDone($user, $export);

        $this->assertMessage($message, $user, 'minimal@example.com', MessageTypeType::EXPORT_DONE, 'Téléchargement prêt');
    }

    private function createMockExport(): Export
    {
        $cart = $this->createMock(Export::class);
        $cart->expects(self::once())
            ->method('getFilename')
            ->willReturn('export-123-abc.zip');

        return $cart;
    }

    private function createMockUserMinimal(): User
    {
        $user = $this->createMock(User::class);
        $user->expects(self::any())
            ->method('getEmail')
            ->willReturn('minimal@example.com');

        return $user;
    }

    private function assertMessage(Message $message, ?User $user, string $email, string $type, string $subject, ?string $variant = null): void
    {
        self::assertSame($type, $message->getType());
        self::assertSame($email, $message->getEmail());
        self::assertSame($user, $message->getRecipient());
        self::assertNull($message->getDateSent());
        self::assertSame($subject, $message->getSubject());

        $variant = $variant ? '-' . $variant : $variant;
        $expectedBody = 'tests/data/emails/' . str_replace('_', '-', $type . $variant) . '.html';
        $this->assertFile($expectedBody, $message->getBody());
    }

    /**
     * Custom assert that will not produce gigantic diff
     */
    private function assertFile(string $file, string $actual): void
    {
        // Log actual result for easier comparison with external diff tools
        $logFile = 'logs/' . $file;
        $dir = dirname($logFile);
        @mkdir($dir, 0777, true);
        file_put_contents($logFile, $actual);

        self::assertFileExists($file, 'Expected file must exist on disk, fix it with: cp ' . $logFile . ' ' . $file);
        $expected = file_get_contents($file);

        self::assertTrue($expected === $actual, 'File content does not match, compare with: meld ' . $file . ' ' . $logFile);
    }
}
