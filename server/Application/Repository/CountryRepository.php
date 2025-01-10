<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\Country;

/**
 * @extends AbstractRepository<Country>
 */
class CountryRepository extends AbstractRepository
{
    use HasNames;
}
