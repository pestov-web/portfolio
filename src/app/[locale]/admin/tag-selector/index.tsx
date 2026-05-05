'use client';

import { useMemo, useState, type ChangeEvent } from 'react';
import { Badge } from '@/shared/ui';

type AdminTagSelectorProps = {
    availableLabel: string;
    emptyLabel: string;
    fieldName: string;
    noAvailableLabel: string;
    selectedLabel: string;
    tags: Array<{
        id: string;
        name: string;
    }>;
    defaultSelectedTagIds?: string[];
};

export function AdminTagSelector({
    availableLabel,
    emptyLabel,
    fieldName,
    noAvailableLabel,
    selectedLabel,
    tags,
    defaultSelectedTagIds = [],
}: AdminTagSelectorProps) {
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>(defaultSelectedTagIds);

    const selectedTags = useMemo(() => tags.filter((tag) => selectedTagIds.includes(tag.id)), [selectedTagIds, tags]);

    const handleTagChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { checked, value } = event.target;

        setSelectedTagIds((currentTagIds) => {
            if (checked) {
                return currentTagIds.includes(value) ? currentTagIds : [...currentTagIds, value];
            }

            return currentTagIds.filter((tagId) => tagId !== value);
        });
    };

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
                <p className='text-xs font-medium uppercase tracking-[0.12em] text-faint'>{selectedLabel}</p>
                <div className='flex flex-wrap gap-2' aria-live='polite'>
                    {selectedTags.length > 0 ? (
                        selectedTags.map((tag) => (
                            <Badge key={tag.id} variant='accent'>
                                {tag.name}
                            </Badge>
                        ))
                    ) : (
                        <p className='text-sm text-muted'>{emptyLabel}</p>
                    )}
                </div>
            </div>

            <div className='flex flex-col gap-2'>
                <p className='text-xs font-medium uppercase tracking-[0.12em] text-faint'>{availableLabel}</p>
                {tags.length > 0 ? (
                    <div className='flex flex-wrap gap-3'>
                        {tags.map((tag) => {
                            const isChecked = selectedTagIds.includes(tag.id);

                            return (
                                <label
                                    key={tag.id}
                                    className='flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-fg transition-colors hover:bg-subtle'
                                >
                                    <input
                                        type='checkbox'
                                        name={fieldName}
                                        value={tag.id}
                                        checked={isChecked}
                                        onChange={handleTagChange}
                                        className='accent-accent-vivid'
                                    />
                                    <Badge variant={isChecked ? 'accent' : 'muted'}>{tag.name}</Badge>
                                </label>
                            );
                        })}
                    </div>
                ) : (
                    <p className='text-sm text-muted'>{noAvailableLabel}</p>
                )}
            </div>
        </div>
    );
}
