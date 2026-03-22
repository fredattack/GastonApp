import React, { Component, type ErrorInfo, type ReactNode } from "react";
import Bugsnag from "@bugsnag/js";
import { WarningCircle, ArrowClockwise } from "@phosphor-icons/react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("ErrorBoundary caught:", error, errorInfo);
        try {
            if (Bugsnag.isStarted()) {
                Bugsnag.notify(error, (event) => {
                    event.addMetadata("react", {
                        componentStack: errorInfo.componentStack,
                    });
                });
            }
        } catch {
            // Bugsnag not initialized, ignore
        }
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div
                    className="flex items-center justify-center min-h-[60vh]"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                >
                    <div className="text-center max-w-md mx-auto p-8">
                        <div className="flex justify-center mb-4">
                            <WarningCircle
                                size={64}
                                weight="duotone"
                                style={{ color: "#D4A574" }}
                            />
                        </div>
                        <h1
                            className="text-2xl font-bold mb-2"
                            style={{ color: "#3D3529" }}
                        >
                            Oups, quelque chose s'est mal passé
                        </h1>
                        <p className="mb-6" style={{ color: "#6B5E4F" }}>
                            Une erreur inattendue est survenue. Rechargez la
                            page pour continuer.
                        </p>
                        <button
                            type="button"
                            onClick={this.handleReload}
                            className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white transition-colors"
                            style={{
                                backgroundColor: "#8FA998",
                                borderRadius: "9999px",
                            }}
                        >
                            <ArrowClockwise size={20} weight="bold" />
                            Recharger la page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
