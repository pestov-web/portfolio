import { describe, expect, it } from 'vitest';
import { toSlug } from './slug';

describe('toSlug', () => {
    it('transliterates cyrillic with spaces', () => {
        expect(toSlug('Таврида Электрик')).toBe('tavrida-elektrik');
    });

    it('normalizes punctuation and repeated separators', () => {
        expect(toSlug('Hello,   World!!!')).toBe('hello-world');
    });

    it('removes diacritics from latin characters', () => {
        expect(toSlug('Crème brûlée')).toBe('creme-brulee');
    });
});
