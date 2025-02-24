<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Enum\Site;
use Application\Model\Statistic;
use Application\Model\User;
use Generator;
use InvalidArgumentException;

/**
 * @extends AbstractRepository<Statistic>
 */
class StatisticRepository extends AbstractRepository implements \Ecodev\Felix\Repository\LimitedAccessSubQuery
{
    public function getOrCreate(Site $site): Statistic
    {
        $date = date('Y-m');
        $statistic = $this->getAclFilter()->runWithoutAcl(fn () => $this->findOneBy([
            'date' => $date,
            'site' => $site->value,
        ]));

        if (!$statistic) {
            $statistic = new Statistic();
            $statistic->setSite($site);
            $statistic->setDate($date);

            $this->getEntityManager()->persist($statistic);
        }

        return $statistic;
    }

    /**
     * Returns pure SQL to get ID of all objects that are accessible to given user.
     *
     * @param User $user
     */
    public function getAccessibleSubQuery(?\Ecodev\Felix\Model\User $user): string
    {
        if (!$user || $user->getRole() !== User::ROLE_ADMINISTRATOR) {
            return '-1';
        }

        return 'SELECT id FROM statistic WHERE site = ' . $this->getEntityManager()->getConnection()->quote($user->getSite()->value);
    }

    public function getExtraStatistics(Site $site, string $period, ?User $user): array
    {
        $userSuffix = $user ? ' par ' . $user->getLogin() : '';

        $extraStatistics = [
            'cardCreation' => [
                'tables' => [
                    $this->getCardVisibility($site, $period, $user, true),
                    $this->getCardDescription($site, $period, $user, true),
                    $this->getCardGeolocation($site, $period, $user, true),
                ],
                'chart' => $this->oneChart($site, $period, 'card', true, 'visibility', 'Création de fiche' . $userSuffix, $user),
            ],
            'cardUpdate' => [
                'tables' => [
                    $this->getCardVisibility($site, $period, $user, false),
                    $this->getCardDescription($site, $period, $user, false),
                    $this->getCardGeolocation($site, $period, $user, false),
                ],
                'chart' => $this->oneChart($site, $period, 'card', false, 'visibility', 'Modification de fiche' . $userSuffix, $user),
            ],
            'userCreation' => [
                'tables' => [
                    $this->getUserType($site, $period, true),
                    $this->getUserRole($site, $period, true),
                ],
                'chart' => $this->oneChart($site, $period, 'user', true, 'type', 'Création d\'utilisateur'),
            ],
            'userUpdate' => [
                'tables' => [
                    $this->getUserType($site, $period, false),
                    $this->getUserRole($site, $period, false),
                ],
                'chart' => $this->oneChart($site, $period, 'user', false, 'type', 'Modification d\'utilisateur'),
            ],
        ];

        return $extraStatistics;
    }

    private function getCardVisibility(Site $site, string $period, ?User $user, bool $isCreation): array
    {
        $periodClause = $this->getPeriodClause($isCreation, $period);
        $userClause = $this->getUserClause($user, $isCreation);

        $query = "SELECT
SUM(CASE WHEN visibility = 'private' THEN 1 ELSE 0 END) AS 'Visible par moi',
SUM(CASE WHEN visibility = 'member' THEN 1 ELSE 0 END) AS 'Visible par tous les membres',
SUM(CASE WHEN visibility = 'public' THEN 1 ELSE 0 END) AS 'Visible par tout le monde'
FROM card
WHERE 
site = :site
$periodClause
$userClause
";

        return $this->toTableRows($site, 'Visibilité', $query);
    }

    private function getPeriodClause(bool $isCreation, string $period): string
    {
        if ($period === 'all') {
            return ' AND 1=1';
        }

        $field = $this->getDateField($isCreation);

        if ($period === 'month') {
            return " AND $field BETWEEN DATE_FORMAT(CURDATE(), '%Y-%m-01') AND LAST_DAY(CURDATE())";
        }
        if (is_numeric($period)) {
            return " AND YEAR($field) = $period";
        }

        throw new InvalidArgumentException("Invalid period: $period");
    }

    private function formatMonth(int $month): string
    {
        return mb_str_pad((string) $month, 2, '0', STR_PAD_LEFT);
    }

    private function getDateField(bool $isCreation): string
    {
        return $isCreation ? 'creation_date' : 'update_date';
    }

    private function getUserClause(?User $user, bool $isCreation): string
    {
        $field = $isCreation ? 'creator_id' : 'updater_id';
        if ($user) {
            return ' AND ' . $field . ' = ' . $user->getId();
        }

        return '';
    }

    private function toTableRows(Site $site, string $name, string $query): array
    {
        $connection = $this->getEntityManager()->getConnection();
        $params = [
            'site' => $site->value,
        ];

        $record = $connection->executeQuery($query, $params)->fetchAssociative();

        $result = [];
        foreach ($record as $key => $v) {
            $result[] = [
                'name' => $key,
                'value' => (int) $v,
            ];
        }

        return [
            'name' => $name,
            'rows' => $result,
        ];
    }

    private function getCardDescription(Site $site, string $period, ?User $user, bool $isCreation): array
    {
        $periodClause = $this->getPeriodClause($isCreation, $period);
        $userClause = $this->getUserClause($user, $isCreation);

        $query = "SELECT
SUM(CASE WHEN expanded_name != '' THEN 1 ELSE 0 END) AS 'Avec titre étendu',
SUM(CASE WHEN expanded_name = '' THEN 1 ELSE 0 END) AS 'Sans titre étendu'
FROM card
WHERE 
site = :site
$periodClause
$userClause
";

        return $this->toTableRows($site, 'Titre étendu', $query);
    }

    private function getCardGeolocation(Site $site, string $period, ?User $user, bool $isCreation): array
    {
        $periodClause = $this->getPeriodClause($isCreation, $period);
        $userClause = $this->getUserClause($user, $isCreation);

        $query = "SELECT
SUM(CASE WHEN location IS NOT NULL THEN 1 ELSE 0 END) AS 'Géolocalisées',
SUM(CASE WHEN location IS NULL THEN 1 ELSE 0 END) AS 'Sans géolocalisation'
FROM card
WHERE 
site = :site
$periodClause
$userClause
";

        return $this->toTableRows($site, 'Géolocalisation', $query);
    }

    private function oneChart(Site $site, string $period, string $table, bool $isCreation, string $field2, string $name, ?User $user = null): array
    {
        $count = $this->countCardByMonth($site, $period, $table, $isCreation, $field2, $user);
        $countByDate = $this->groupByDateAndGroup($count, $period);
        $categories = array_keys($countByDate);
        $series = [];

        $total = [];
        foreach ($countByDate as $byDate) {
            foreach ($byDate as $d) {
                $group = $d['grouping'];

                if (!array_key_exists($group, $series)) {
                    $total[$group] = 0;
                }

                $total[$group] += $d['count'];

                if (!array_key_exists($group, $series)) {
                    $series[$group] = [
                        'name' => $group,
                        'data' => [],
                    ];
                }

                $series[$group]['data'][] = (int) $d['count'];
            }
        }

        $rows = [];
        $superTotal = 0;
        foreach ($total as $key => $t) {
            $superTotal += $t;
            $rows[] = ['name' => $key, 'value' => $t];
        }

        $data = [
            'name' => $name,
            'categories' => $categories,
            'series' => array_values($series),
        ];

        return $data;
    }

    private function countCardByMonth(Site $site, string $period, string $table, bool $isCreation, string $groupingField, ?User $user = null): array
    {
        $field = $this->getDateField($isCreation);
        $connection = $this->getEntityManager()->getConnection();
        $month = "DATE_FORMAT($field, '%Y-%m')";
        $periodClause = $this->getPeriodClause($isCreation, $period);
        $userClause = $this->getUserClause($user, $isCreation);

        $query = "SELECT $month AS date, $groupingField AS grouping, COUNT($field) AS count
FROM $table
WHERE 
$field IS NOT NULL
AND site = :site
$periodClause
$userClause
GROUP BY $month, $groupingField 
ORDER BY $month, $groupingField ASC
";

        $params = [
            'site' => $site->value,
        ];

        $result = $connection->executeQuery($query, $params)->fetchAllAssociative();

        return $result;
    }

    private function groupByDateAndGroup(array $count, string $period): array
    {
        $result = [];
        $groups = [];
        foreach ($count as $d) {
            if (!array_key_exists($d['date'], $result)) {
                $result[$d['date']] = [];
            }

            $groups[] = $d['grouping'];
            $result[$d['date']][$d['grouping']] = $d;
        }

        // If year is selected, fill gap for months without data
        $groups = array_unique($groups);
        if ($period === 'month') {
            $first = date('Y-m');
            $last = $first;
        } elseif (is_numeric($period)) {
            $first = $period . '-01';
            $last = $period . '-12';
        } else {
            $dates = array_keys($result);
            $first = reset($dates);
            $last = end($dates);
        }

        if ($first && $last) {
            foreach ($this->months($first, $last) as $date) {
                if (!array_key_exists($date, $result)) {
                    $result[$date] = [];
                }

                foreach ($groups as $group) {
                    if (!array_key_exists($group, $result[$date])) {
                        $result[$date][$group] = [
                            'date' => $date,
                            'count' => 0,
                            'grouping' => $group,
                        ];
                    }
                }
            }
        }

        ksort($result);

        return $result;
    }

    private function months(string $first, string $last): Generator
    {
        $date = $first;

        [$year, $month] = explode('-', $date);
        $year = (int) $year;
        $month = (int) $month;

        while ($date !== $last) {
            yield $date;

            if ($month === 12) {
                $month = 1;
                ++$year;
            } else {
                ++$month;
            }
            $date = $year . '-' . $this->formatMonth($month);
        }

        yield $date;
    }

    private function getUserType(Site $site, string $period, bool $isCreation): array
    {
        $periodClause = $this->getPeriodClause($isCreation, $period);
        $query = "SELECT
SUM(CASE WHEN type = 'aai' THEN 1 ELSE 0 END) AS 'AAI',
SUM(CASE WHEN type = 'default' THEN 1 ELSE 0 END) AS 'Externe',
SUM(CASE WHEN type = 'legacy' THEN 1 ELSE 0 END) AS 'Legacy'
FROM user
WHERE 
site = :site
$periodClause
";

        return $this->toTableRows($site, 'Type', $query);
    }

    private function getUserRole(Site $site, string $period, bool $isCreation): array
    {
        $periodClause = $this->getPeriodClause($isCreation, $period);
        $query = "SELECT
SUM(CASE WHEN role = 'student' THEN 1 ELSE 0 END) AS 'Etudiant',
SUM(CASE WHEN role = 'junior' THEN 1 ELSE 0 END) AS 'Etudiant junior',
SUM(CASE WHEN role = 'senior' THEN 1 ELSE 0 END) AS 'Senior',
SUM(CASE WHEN role = 'administrator' THEN 1 ELSE 0 END) AS 'Administrateur'
FROM user
WHERE 
site = :site
$periodClause
";

        return $this->toTableRows($site, 'Rôles', $query);
    }
}
