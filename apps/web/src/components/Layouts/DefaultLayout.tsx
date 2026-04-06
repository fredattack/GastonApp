import {
    PropsWithChildren,
    Suspense,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowUp } from "@phosphor-icons/react";
import App from "../../App";
import { IRootState } from "../../store";
import { toggleSidebar } from "../../store/themeConfigSlice";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Portals from "../Portals";
import TabBar from "../Navigation/TabBar";
import { CommandBar, useCommandBar } from "../AI/CommandBar";
import { AIAssistantProvider } from "../../contexts/AIAssistantContext";
import { AIBridgeProvider, useAIBridge } from "../../contexts/AIBridgeContext";

const AIWidgets = ({
    commandBarIsOpen,
    commandBarClose,
}: {
    commandBarIsOpen: boolean;
    commandBarClose: () => void;
}) => {
    const navigate = useNavigate();
    const { inject } = useAIBridge();

    const handleOpenChat = useCallback(
        (query: string, response: AIResponse) => {
            inject({
                type: "redirect",
                payload: { query, aiResponse: response },
            });
            navigate("/ai-assistant");
        },
        [navigate, inject],
    );

    return (
        <CommandBar
            isOpen={commandBarIsOpen}
            onClose={commandBarClose}
            onOpenChat={handleOpenChat}
        />
    );
};

const DefaultLayout = ({ children }: PropsWithChildren) => {
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();
    const commandBar = useCommandBar();

    const [showLoader, setShowLoader] = useState(true);
    const [showTopButton, setShowTopButton] = useState(false);

    const goToTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };

    const ticking = useRef(false);

    const onScrollHandler = useCallback(() => {
        if (!ticking.current) {
            ticking.current = true;
            requestAnimationFrame(() => {
                const scrollTop =
                    document.body.scrollTop ||
                    document.documentElement.scrollTop;
                setShowTopButton(scrollTop > 200);
                ticking.current = false;
            });
        }
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", onScrollHandler, { passive: true });

        const screenLoader = document.getElementsByClassName("screen_loader");
        if (screenLoader?.length) {
            screenLoader[0].classList.add("animate__fadeOut");
            setTimeout(() => {
                setShowLoader(false);
            }, 200);
        }

        return () => {
            window.removeEventListener("scroll", onScrollHandler);
        };
    }, [onScrollHandler]);

    return (
        <App>
            <AIBridgeProvider>
            <AIAssistantProvider>
                <div className="relative">
                    {/* sidebar menu overlay (mobile) */}
                    <div
                        className={`${(!themeConfig.sidebar && "hidden") || ""} fixed inset-0 bg-black/60 z-50 lg:hidden`}
                        onClick={() => dispatch(toggleSidebar())}
                    />

                    {/* screen loader */}
                    {showLoader && (
                        <div className="screen_loader fixed inset-0 bg-[var(--color-bg-base,#F4F1E8)] z-[60] grid place-content-center animate__animated">
                            <svg
                                width="64"
                                height="64"
                                viewBox="0 0 135 135"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="#8FA998"
                            >
                                <path d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z">
                                    <animateTransform
                                        attributeName="transform"
                                        type="rotate"
                                        from="0 67 67"
                                        to="-360 67 67"
                                        dur="2.5s"
                                        repeatCount="indefinite"
                                    />
                                </path>
                                <path d="M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z">
                                    <animateTransform
                                        attributeName="transform"
                                        type="rotate"
                                        from="0 67 67"
                                        to="360 67 67"
                                        dur="8s"
                                        repeatCount="indefinite"
                                    />
                                </path>
                            </svg>
                        </div>
                    )}

                    {/* Scroll to top */}
                    {showTopButton && (
                        <button
                            type="button"
                            className="fixed bottom-24 lg:bottom-8 right-6 z-30 w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                            onClick={goToTop}
                            aria-label="Retour en haut"
                        >
                            <ArrowUp
                                size={18}
                                className="text-gray-600 dark:text-gray-300"
                            />
                        </button>
                    )}

                    <div
                        className={`${themeConfig.navbar} main-container text-black dark:text-white-dark min-h-screen`}
                    >
                        <Sidebar />

                        <div className="main-content flex flex-col min-h-screen">
                            <Header />

                            <Suspense>
                                <div
                                    className={`${themeConfig.animation} p-4 sm:p-5 lg:p-6 pb-20 lg:pb-6 animate__animated`}
                                >
                                    {children}
                                </div>
                            </Suspense>

                            <Footer />
                            <Portals />
                        </div>

                        <TabBar />

                        <AIWidgets
                            commandBarIsOpen={commandBar.isOpen}
                            commandBarClose={commandBar.close}
                        />
                    </div>
                </div>
            </AIAssistantProvider>
            </AIBridgeProvider>
        </App>
    );
};

export default DefaultLayout;
