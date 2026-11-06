<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Model\News;
use PHPUnit\Framework\TestCase;

class NewsTest extends TestCase
{
    public function testImageUrlIsEmptyWithoutImage(): void
    {
        $news = new News();
        self::assertSame('', $news->getImageUrl(), 'a news without image must not point to the folder of the images');

        $news->setFilename('foo.webp');
        self::assertSame('/news-images/foo.webp', $news->getImageUrl());
    }
}
