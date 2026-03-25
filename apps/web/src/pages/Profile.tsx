import React from "react";
import { useNavigate } from "react-router-dom";
import { SignOut, User, Envelope, CalendarBlank } from "@phosphor-icons/react";
import { useAuthContext } from "../contexts/AuthContext";

export default function Profile() {
    const navigate = useNavigate();
    const { user, logout } = useAuthContext();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="max-w-lg mx-auto" data-testid="profile-page">
            <h1
                style={{
                    fontSize: "var(--font-size-h3)",
                    fontWeight: "var(--font-weight-bold)",
                    color: "var(--color-text-primary)",
                    marginBottom: "var(--spacing-24)",
                }}
            >
                Mon profil
            </h1>

            {/* Profile Card */}
            <div
                style={{
                    background: "var(--color-lin-0)",
                    borderRadius: "var(--radius-2xl)",
                    border: "1px solid var(--color-lin-3)",
                    boxShadow: "var(--shadow-sm)",
                    overflow: "hidden",
                }}
            >
                {/* Header gradient */}
                <div
                    style={{
                        height: "80px",
                        background:
                            "linear-gradient(135deg, var(--color-primary-100), var(--color-primary-200))",
                        position: "relative",
                    }}
                />

                {/* Avatar */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "-36px",
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    <div
                        style={{
                            width: "72px",
                            height: "72px",
                            borderRadius: "var(--radius-full)",
                            background: "var(--color-primary-500)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "4px solid var(--color-lin-0)",
                            boxShadow: "var(--shadow-md)",
                        }}
                    >
                        <User size={32} weight="bold" color="white" />
                    </div>
                </div>

                {/* User name */}
                <div
                    style={{
                        textAlign: "center",
                        padding: "var(--spacing-12) var(--spacing-24) 0",
                    }}
                >
                    <h2
                        data-testid="profile-user-name"
                        style={{
                            fontSize: "var(--font-size-h4)",
                            fontWeight: "var(--font-weight-bold)",
                            color: "var(--color-text-primary)",
                        }}
                    >
                        {user?.name}
                    </h2>
                </div>

                {/* Info rows */}
                <div
                    style={{
                        padding: "var(--spacing-24)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-16)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--spacing-12)",
                        }}
                    >
                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "var(--radius-md)",
                                background: "var(--color-primary-50)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <Envelope
                                size={20}
                                style={{ color: "var(--color-primary-500)" }}
                            />
                        </div>
                        <div>
                            <p
                                style={{
                                    fontSize: "var(--font-size-caption)",
                                    color: "var(--color-text-tertiary)",
                                    marginBottom: "2px",
                                }}
                            >
                                Email
                            </p>
                            <p
                                data-testid="profile-user-email"
                                style={{
                                    fontSize: "var(--font-size-body-m)",
                                    color: "var(--color-text-primary)",
                                    fontWeight: "var(--font-weight-semibold)",
                                }}
                            >
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    {user?.created_at && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--spacing-12)",
                            }}
                        >
                            <div
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "var(--radius-md)",
                                    background: "var(--color-secondary-50)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <CalendarBlank
                                    size={20}
                                    style={{
                                        color: "var(--color-secondary-500)",
                                    }}
                                />
                            </div>
                            <div>
                                <p
                                    style={{
                                        fontSize: "var(--font-size-caption)",
                                        color: "var(--color-text-tertiary)",
                                        marginBottom: "2px",
                                    }}
                                >
                                    Membre depuis
                                </p>
                                <p
                                    style={{
                                        fontSize: "var(--font-size-body-m)",
                                        color: "var(--color-text-primary)",
                                        fontWeight:
                                            "var(--font-weight-semibold)",
                                    }}
                                >
                                    {formatDate(user.created_at)}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Logout */}
                <div
                    style={{
                        padding: "0 var(--spacing-24) var(--spacing-24)",
                    }}
                >
                    <button
                        type="button"
                        data-testid="profile-logout-button"
                        onClick={handleLogout}
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "var(--spacing-8)",
                            padding: "var(--spacing-12) var(--spacing-16)",
                            background: "none",
                            border: "1px solid var(--color-error-200)",
                            borderRadius: "9999px",
                            color: "var(--color-error-500)",
                            fontSize: "var(--font-size-body-m)",
                            fontWeight: "var(--font-weight-semibold)",
                            cursor: "pointer",
                            transition: "all var(--transition-normal)",
                        }}
                    >
                        <SignOut size={20} />
                        Se déconnecter
                    </button>
                </div>
            </div>

            {/* Legal links */}
            <div
                style={{
                    marginTop: "var(--spacing-24)",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    gap: "var(--spacing-16)",
                }}
            >
                <a
                    href="/cgu"
                    data-testid="profile-cgu-link"
                    style={{
                        fontSize: "var(--font-size-caption)",
                        color: "var(--color-text-tertiary)",
                        textDecoration: "none",
                    }}
                >
                    CGU
                </a>
                <span
                    style={{
                        color: "var(--color-text-hint)",
                    }}
                >
                    ·
                </span>
                <a
                    href="/privacy"
                    data-testid="profile-privacy-link"
                    style={{
                        fontSize: "var(--font-size-caption)",
                        color: "var(--color-text-tertiary)",
                        textDecoration: "none",
                    }}
                >
                    Politique de confidentialité
                </a>
            </div>
        </div>
    );
}
