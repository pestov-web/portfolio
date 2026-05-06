import { ImageResponse } from 'next/og';

export const size = {
    width: 32,
    height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#6366F1',
                    borderRadius: '6px',
                    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                    color: '#ffffff',
                }}
            >
                VP
            </div>
        ),
        { ...size },
    );
}
