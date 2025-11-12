<?php

declare(strict_types=1);

namespace Application;

use Ecodev\Felix\Api\Exception;
use Imagick;
use ImagickException;
use Throwable;

abstract class FriendlyException
{
    /**
     * Any exception thrown by `$callback` will be attempted to be transformed
     * into a user-friendly version. Then either the user-friendly, or the original,
     * exception will be re-thrown.
     *
     * @template T
     *
     * @param callable(): T $callback
     *
     * @return T Whatever the callable returned
     */
    public static function try(callable $callback): mixed
    {
        try {
            return $callback();
        } catch (Throwable $e) {
            $previous = $e->getPrevious();
            if (!($previous instanceof ImagickException)) {
                throw $e;
            }

            $message = $previous->getMessage();
            if (str_starts_with($message, 'width or height exceeds limit')) {
                // Your IDE might tell you `RESOURCETYPE_WIDTH` and `RESOURCETYPE_HEIGHT` don't exist, but actually they do exist since imagemagick 6.91
                // see https://github.com/Imagick/imagick/blob/45adfb7b1e322eaa6174e88f7d5e27ef20e0596e/imagick_helpers.c#L1672-L1675
                $maxWidth = Utility::formatMetric(Imagick::getResourceLimit(Imagick::RESOURCETYPE_WIDTH));
                $maxHeight = Utility::formatMetric(Imagick::getResourceLimit(Imagick::RESOURCETYPE_HEIGHT));
                self::throw("La dimension maximale de l'image est de $maxWidth x $maxHeight pixels, mais elle a été dépassée.", $e);
            } elseif (str_starts_with($message, 'cache resources exhausted')) {
                $maxCache = Utility::formatMetric(Imagick::getResourceLimit(Imagick::RESOURCETYPE_DISK));
                self::throw("La taille maximale du cache est de {$maxCache}iB, mais elle a été dépassée.", $e);
            } elseif (str_contains($message, 'time limit exceeded')) {
                $maxTime = Imagick::getResourceLimit(Imagick::RESOURCETYPE_TIME);
                self::throw("Le temps maximum de traitement d'image est de $maxTime secondes, mais il a été dépassé.", $e);
            }

            throw $e;
        }
    }

    private static function throw(string $message, Throwable $previous): never
    {
        throw new Exception($message, $previous->getCode(), $previous);
    }
}
