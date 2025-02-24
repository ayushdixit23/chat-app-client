const CircularProgress = ({ progress }: { progress: number }) => {
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = (1 - progress / 100) * circumference;

    return (
        <div className="relative w-16 h-16">
            <svg className="w-full h-full">
                {/* Background Circle */}
                <circle cx="50%" cy="50%" r={radius} strokeWidth="4" stroke="gray" fill="transparent" opacity="0.3" />
            </svg>

            {/* Progress Circle */}
            <svg className="absolute top-0 left-0 w-full h-full rotate-[-90deg]">
                <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    strokeWidth="4"
                    stroke="blue"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-200 ease-linear"
                />
            </svg>

            {/* Progress Text */}
            <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-blue-600">
                {progress}%
            </div>
        </div>
    );
};

export default CircularProgress