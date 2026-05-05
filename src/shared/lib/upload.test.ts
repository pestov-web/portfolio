import { describe, expect, it } from 'vitest';
import { getOptionalFile, MAX_IMAGE_SIZE, validateImageFile } from './upload';

describe('validateImageFile', () => {
    it('accepts supported image types within size limit', () => {
        const file = new File(['content'], 'cover.png', { type: 'image/png' });

        expect(() => validateImageFile(file)).not.toThrow();
    });

    it('rejects unsupported file type', () => {
        const file = new File(['content'], 'cover.svg', { type: 'image/svg+xml' });

        expect(() => validateImageFile(file, { invalidType: 'bad-type', tooLarge: 'too-large' })).toThrow('bad-type');
    });

    it('rejects files larger than the configured limit', () => {
        const file = new File([new Uint8Array(MAX_IMAGE_SIZE + 1)], 'cover.png', { type: 'image/png' });

        expect(() => validateImageFile(file, { invalidType: 'bad-type', tooLarge: 'too-large' })).toThrow('too-large');
    });
});

describe('getOptionalFile', () => {
    it('returns null when file field is missing', () => {
        const formData = new FormData();

        expect(getOptionalFile(formData, 'coverImageFile')).toBeNull();
    });

    it('returns null for empty uploaded files', () => {
        const formData = new FormData();
        formData.set('coverImageFile', new File([], 'empty.png', { type: 'image/png' }));

        expect(getOptionalFile(formData, 'coverImageFile')).toBeNull();
    });

    it('returns file instance for non-empty upload', () => {
        const formData = new FormData();
        const file = new File(['binary'], 'cover.png', { type: 'image/png' });
        formData.set('coverImageFile', file);

        expect(getOptionalFile(formData, 'coverImageFile')).toBe(file);
    });
});
