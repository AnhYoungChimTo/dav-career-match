'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
                    <h2 style={{ color: 'red' }}>Critical Application Error</h2>
                    <p>This is the Global Error Boundary.</p>
                    <pre style={{ background: '#f0f0f0', padding: '1rem', borderRadius: '4px' }}>
                        {error.message}
                    </pre>
                    <button onClick={() => reset()}>Try again</button>
                </div>
            </body>
        </html>
    );
}
