export default function Logo({ className = "text-white", showText = true }) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <svg
                width="40"
                height="40"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10"
            >
                {/* Wireframe Cube Structure */}
                <path
                    d="M50 20 L20 35 L20 75 L50 90 L80 75 L80 35 L50 20 Z"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M50 20 L50 50 L20 75 M50 50 L80 75 M20 35 L50 50 L80 35"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {/* Internal Connections */}
                <path
                    d="M20 35 L80 75 M80 35 L20 75"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeOpacity="0.8"
                />

                {/* Connection Nodes */}
                <circle cx="50" cy="20" r="4" fill="currentColor" />
                <circle cx="20" cy="35" r="4" fill="currentColor" />
                <circle cx="80" cy="35" r="4" fill="currentColor" />
                <circle cx="20" cy="75" r="4" fill="currentColor" />
                <circle cx="80" cy="75" r="4" fill="currentColor" />
                <circle cx="50" cy="90" r="4" fill="currentColor" />
                <circle cx="50" cy="50" r="5" fill="currentColor" />
            </svg>

            {showText && (
                <span className="text-xl font-bold tracking-tight uppercase">
                    Campus Connect
                </span>
            )}
        </div>
    )
}
