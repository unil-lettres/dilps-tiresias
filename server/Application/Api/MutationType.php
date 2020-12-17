<?php

declare(strict_types=1);

namespace Application\Api;

use Application\Api\Field\Mutation\AcceptChange;
use Application\Api\Field\Mutation\CreateCard;
use Application\Api\Field\Mutation\CreateCards;
use Application\Api\Field\Mutation\CreateExport;
use Application\Api\Field\Mutation\LinkCollectionToCollection;
use Application\Api\Field\Mutation\Login;
use Application\Api\Field\Mutation\Logout;
use Application\Api\Field\Mutation\RecordDetail;
use Application\Api\Field\Mutation\RecordPage;
use Application\Api\Field\Mutation\RecordSearch;
use Application\Api\Field\Mutation\RejectChange;
use Application\Api\Field\Mutation\SuggestCreation;
use Application\Api\Field\Mutation\SuggestDeletion;
use Application\Api\Field\Mutation\SuggestUpdate;
use Application\Api\Field\Mutation\ValidateData;
use Application\Api\Field\Mutation\ValidateImage;
use Application\Api\Field\Standard;
use Application\Model\AntiqueName;
use Application\Model\Artist;
use Application\Model\Card;
use Application\Model\Collection;
use Application\Model\DocumentType;
use Application\Model\Domain;
use Application\Model\File;
use Application\Model\Institution;
use Application\Model\Material;
use Application\Model\News;
use Application\Model\Period;
use Application\Model\Tag;
use Application\Model\User;
use GraphQL\Type\Definition\ObjectType;

class MutationType extends ObjectType
{
    public function __construct()
    {
        $specializedFields = [
            SuggestCreation::build(),
            SuggestUpdate::build(),
            SuggestDeletion::build(),
            AcceptChange::build(),
            RejectChange::build(),
            Login::build(),
            Logout::build(),
            ValidateData::build(),
            ValidateImage::build(),
            LinkCollectionToCollection::build(),
            RecordPage::build(),
            RecordDetail::build(),
            RecordSearch::build(),
            CreateCard::build(),
            CreateCards::build(),
            CreateExport::build(),
        ];

        $fields = array_merge(
            Standard::buildMutation(Artist::class),
            Standard::buildMutation(Collection::class),
            Standard::buildMutation(Institution::class),
            Standard::buildMutation(Card::class),
            Standard::buildMutation(User::class),
            Standard::buildMutation(DocumentType::class),
            Standard::buildMutation(Domain::class),
            Standard::buildMutation(Material::class),
            Standard::buildMutation(News::class),
            Standard::buildMutation(Period::class),
            Standard::buildMutation(Tag::class),
            Standard::buildMutation(AntiqueName::class),
            Standard::buildMutation(File::class),
            Standard::buildRelationMutation(Collection::class, User::class),
            Standard::buildRelationMutation(Card::class, Card::class),
            Standard::buildRelationMutation(Card::class, Collection::class, false, 'linkCard'),
            Standard::buildRelationMutation(Card::class, Period::class),
            Standard::buildRelationMutation(Card::class, Material::class),

            $specializedFields,
        );

        $config = [
            'fields' => $fields,
        ];

        parent::__construct($config);
    }
}
