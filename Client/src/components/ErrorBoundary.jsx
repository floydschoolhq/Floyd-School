import React from 'react';

/**
 * ErrorBoundary - catches render errors and shows a friendly UI instead of white screen.
 * This is a class component because React error boundaries must be class-based.
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error('[ErrorBoundary] Caught error:', error, info);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (
                <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6 border border-red-100">
                        <span className="text-3xl">⚠️</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-3 uppercase tracking-tight">
                        Something went <span className="text-red-500">wrong</span>
                    </h2>
                    <p className="text-slate-500 max-w-sm font-medium mb-8 leading-relaxed text-sm">
                        This page encountered an error. Please refresh or go back to the classroom.
                    </p>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-all text-sm uppercase tracking-widest"
                        >
                            Refresh Page
                        </button>
                        <button
                            onClick={() => window.history.back()}
                            className="px-6 py-3 bg-white text-slate-700 border border-slate-200 font-bold rounded-xl hover:bg-slate-50 transition-all text-sm uppercase tracking-widest"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
