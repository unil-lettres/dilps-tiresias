<?php

declare(strict_types=1);

namespace Application;

use Normalizer;

/**
 * Utility class to parse, format and extract terms from a text.
 */
class TextFormat
{
    public const PUNCTUATIONS = [
        '.', '।', '։', '。', '۔', '⳹', '܁', '።', '᙮', '᠃', '⳾', '꓿', '꘎', '꛳', '࠽', '᭟', ',', '،', '、', '՝', '߸', '፣',
        '᠈', '꓾', '꘍', '꛵', '᭞', '⁇', '⁉', '⁈', '‽', '❗', '‼', '⸘', '?', ';', '¿', '؟', '՞', '܆', '፧', '⳺', '⳻', '꘏',
        '꛷', '𑅃', '꫱', '!', '¡', '߹', '᥄', '·', '𐎟', '𐏐', '𒑰', '፡', ' ', '𐤟', '࠰', '—', '–', '‒', '‐', '⁃', '﹣', '－',
        '֊', '᠆', ';', '·', '؛', '፤', '꛶', '․', ':', '፥', '꛴', '᭝', '…', '︙', 'ຯ', '«', '‹', '»', '›', '„', '‚', '“',
        '‟', '‘', '‛', '”', '’', '"', "'", '(', ')',
    ];

    public function __construct(
        private string $text,
    ) {}

    /**
     * Parse the term to extract a list of words that are not quoted.
     *
     * @return string[]
     */
    public function notExactTerms(): array
    {
        /** @var string $term */
        $term = Normalizer::normalize($this->text);

        // Drop empty quote
        $term = str_replace('""', '', $term);

        // Extract exact terms that are quoted
        preg_match_all('~"([^"]*)"~', $term, $m);
        $termWithoutExact = str_replace($m[0], ' ', $term);
        $termWithoutExactWithoutPunctuations = str_replace(self::PUNCTUATIONS, ' ', $termWithoutExact);

        // Split words by any whitespace
        $words = preg_split('/[[:space:]]+/', $termWithoutExactWithoutPunctuations, -1, PREG_SPLIT_NO_EMPTY) ?: [];

        // Drop duplicates
        $words = array_unique($words);

        return $words;
    }

    /**
     * Parse the term to extract a list of words and quoted terms.
     *
     * @return string[]
     */
    public function exactTerms(): array
    {
        /** @var string $term */
        $term = Normalizer::normalize($this->text);

        // Drop empty quote
        $term = str_replace('""', '', $term);

        // Extract exact terms that are quoted
        preg_match_all('~"([^"]*)"~', $term, $m);

        return array_unique($m[1]);
    }
}
