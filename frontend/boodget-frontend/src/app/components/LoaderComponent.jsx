const FinanceLoader = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-black">
            <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-6">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce [animation-delay:0s]" />
                    <div className="w-4 h-4 bg-yellow-500 rounded-full animate-bounce [animation-delay:0.1s]" />
                    <div className="w-4 h-4 bg-yellow-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
                <h1 className="text-xl font-semibold text-yellow-400 tracking-wide mb-1">
                    Tracking Your Wealth...
                </h1>
                <p className="text-sm text-gray-400 italic">
                    Gold never sleeps 💸
                </p>
            </div>
        </div>
    );
};

export default FinanceLoader;
