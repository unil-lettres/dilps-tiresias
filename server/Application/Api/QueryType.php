<?php

declare(strict_types=1);

namespace Application\Api;

use Application\Api\Field\Query\ExtraStatistics;
use Application\Api\Field\Query\UserRolesAvailable;
use Application\Api\Field\Query\ValidateExport;
use Application\Api\Field\Query\Viewer;
use Application\Api\Field\Standard;
use Application\Model\AntiqueName;
use Application\Model\Artist;
use Application\Model\Card;
use Application\Model\Change;
use Application\Model\Collection;
use Application\Model\Country;
use Application\Model\DocumentType;
use Application\Model\Domain;
use Application\Model\Export;
use Application\Model\File;
use Application\Model\Institution;
use Application\Model\Material;
use Application\Model\News;
use Application\Model\Period;
use Application\Model\Statistic;
use Application\Model\Tag;
use Application\Model\User;
use GraphQL\Type\Definition\ObjectType;

class QueryType extends ObjectType
{
    public function __construct()
    {
        $specializedFields = [
            Viewer::build(),
            ExtraStatistics::build(),
            UserRolesAvailable::build(),
            ValidateExport::build(),
        ];

        $fields = array_merge(
            $specializedFields,

            Standard::buildQuery(Artist::class),
            Standard::buildQuery(Change::class),
            Standard::buildQuery(Collection::class),
            Standard::buildQuery(Card::class),
            Standard::buildQuery(Institution::class),
            Standard::buildQuery(User::class),
            Standard::buildQuery(Country::class),
            Standard::buildQuery(DocumentType::class),
            Standard::buildQuery(Domain::class),
            Standard::buildQuery(Material::class),
            Standard::buildQuery(News::class),
            Standard::buildQuery(Period::class),
            Standard::buildQuery(Statistic::class),
            Standard::buildQuery(Tag::class),
            Standard::buildQuery(AntiqueName::class),
            Standard::buildQuery(File::class),
            Standard::buildQuery(Export::class),
        );

        $config = [
            'fields' => $fields,
        ];

        parent::__construct($config);
    }
}
