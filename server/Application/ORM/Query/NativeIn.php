<?php

declare(strict_types=1);

namespace Application\ORM\Query;

use Doctrine\ORM\Query\AST\Functions\FunctionNode;
use Doctrine\ORM\Query\Lexer;
use Doctrine\ORM\Query\Parser;
use Doctrine\ORM\Query\SqlWalker;

/**
 * A custom DQL function to be able to use `IN` clause but with native SQL subqueries.
 *
 * This is especially useful when we want to benefit from DQL builder, paginator,
 * automatic ACL filter etc, but still have to have some advanced conditions in subqueries.
 *
 * DQL should not be handwritten, but instead `self::dql()` should be used
 */
class NativeIn extends FunctionNode
{
    private $field;

    private $nativeQuery;

    private $isNot;

    /**
     * Generate DQL `IN` clause with a native subquery
     *
     * @param string $field DQL for the field
     * @param string $nativeSql native SQL subquery
     */
    public static function dql(string $field, string $nativeSql, bool $isNot = false): string
    {
        $quotedNativeSql = "'" . str_replace("'", "''", $nativeSql) . "'";

        return 'NATIVE_IN(' . $field . ',   ' . $quotedNativeSql . ', ' . (int) $isNot . ') = TRUE';
    }

    public function parse(Parser $parser): void
    {
        $parser->match(Lexer::T_IDENTIFIER);
        $parser->match(Lexer::T_OPEN_PARENTHESIS);
        $this->field = $parser->ArithmeticPrimary();

        // parse second parameter if available
        $parser->match(Lexer::T_COMMA);
        $this->nativeQuery = $parser->Literal();
        $parser->match(Lexer::T_COMMA);
        $this->isNot = $parser->Literal();

        $parser->match(Lexer::T_CLOSE_PARENTHESIS);
    }

    public function getSql(SqlWalker $sqlWalker): string
    {
        $field = $this->field->dispatch($sqlWalker);
        $nativeSql = $this->nativeQuery->dispatch($sqlWalker);
        $nativeSql = preg_replace("~^'(.*)'$~", '\\1', $nativeSql);
        $unquotedNativeSql = str_replace(["\\'", '\\n'], ["'", "\n"], $nativeSql);
        $isNot = $this->isNot->dispatch($sqlWalker);

        $sql = $field . ($isNot ? ' NOT' : '') . ' IN (' . $unquotedNativeSql . ')';

        return $sql;
    }
}
