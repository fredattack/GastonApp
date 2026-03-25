import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";

export default function PrivacyPolicy() {
    return (
        <div
            className="min-h-screen"
            data-testid="privacy-policy-page"
            style={{
                background:
                    "linear-gradient(135deg, var(--color-lin-2), var(--color-lin-0))",
            }}
        >
            <div
                className="max-w-3xl mx-auto"
                style={{ padding: "var(--spacing-32) var(--spacing-16)" }}
            >
                {/* Back link */}
                <Link
                    to="/login"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "var(--spacing-8)",
                        fontSize: "var(--font-size-body-s)",
                        color: "var(--color-primary-500)",
                        textDecoration: "none",
                        marginBottom: "var(--spacing-24)",
                    }}
                >
                    <ArrowLeft size={16} />
                    Retour
                </Link>

                <div
                    style={{
                        background: "var(--color-lin-0)",
                        borderRadius: "var(--radius-2xl)",
                        boxShadow: "var(--shadow-sm)",
                        padding: "var(--spacing-40) var(--spacing-32)",
                    }}
                >
                    <h1
                        style={{
                            fontSize: "var(--font-size-h2)",
                            fontWeight: "var(--font-weight-bold)",
                            color: "var(--color-text-primary)",
                            marginBottom: "var(--spacing-8)",
                        }}
                    >
                        Politique de Confidentialité
                    </h1>
                    <p
                        style={{
                            fontSize: "var(--font-size-body-s)",
                            color: "var(--color-text-tertiary)",
                            marginBottom: "var(--spacing-32)",
                        }}
                    >
                        Gaston (Beta) — Dernière mise à jour : mars 2026
                    </p>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--spacing-32)",
                        }}
                    >
                        <Section title="1. Données collectées">
                            <p>
                                Dans le cadre de l'utilisation de l'application
                                Gaston, nous collectons les données suivantes :
                            </p>
                            <ul
                                style={{
                                    paddingLeft: "var(--spacing-24)",
                                    listStyleType: "disc",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "var(--spacing-8)",
                                }}
                            >
                                <li>
                                    <strong>Données d'identification</strong> :
                                    nom, adresse email
                                </li>
                                <li>
                                    <strong>
                                        Données relatives aux animaux
                                    </strong>{" "}
                                    : nom, espèce, race, date de naissance,
                                    informations de santé et d'alimentation
                                </li>
                                <li>
                                    <strong>Données d'événements</strong> :
                                    rendez-vous, rappels, historique d'activités
                                </li>
                                <li>
                                    <strong>Données d'utilisation</strong> :
                                    interactions avec l'assistant IA, logs
                                    techniques
                                </li>
                            </ul>
                        </Section>

                        <Section title="2. Utilisation des données">
                            <p>Vos données sont utilisées pour :</p>
                            <ul
                                style={{
                                    paddingLeft: "var(--spacing-24)",
                                    listStyleType: "disc",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "var(--spacing-8)",
                                }}
                            >
                                <li>
                                    Fournir et améliorer les fonctionnalités de
                                    l'application
                                </li>
                                <li>
                                    Personnaliser votre expérience utilisateur
                                </li>
                                <li>
                                    Alimenter l'assistant IA pour des réponses
                                    contextuelles
                                </li>
                                <li>
                                    Assurer la sécurité et le bon fonctionnement
                                    du service
                                </li>
                            </ul>
                        </Section>

                        <Section title="3. Intelligence artificielle et OpenAI">
                            <p>
                                L'application utilise les services d'OpenAI pour
                                les fonctionnalités d'assistant IA. Lorsque vous
                                interagissez avec l'assistant :
                            </p>
                            <ul
                                style={{
                                    paddingLeft: "var(--spacing-24)",
                                    listStyleType: "disc",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "var(--spacing-8)",
                                }}
                            >
                                <li>
                                    Vos messages (prompts) sont envoyés aux
                                    serveurs d'OpenAI pour traitement
                                </li>
                                <li>
                                    Les données de vos animaux peuvent être
                                    incluses dans le contexte pour des réponses
                                    pertinentes
                                </li>
                                <li>
                                    OpenAI peut conserver temporairement ces
                                    données selon leur propre politique de
                                    confidentialité
                                </li>
                                <li>
                                    Nous ne transmettons pas volontairement
                                    d'informations personnelles identifiantes
                                    (email, nom complet) dans les prompts
                                </li>
                            </ul>
                            <Placeholder>
                                Détails sur la politique de rétention des
                                données par OpenAI et les mesures de protection
                                à compléter.
                            </Placeholder>
                        </Section>

                        <Section title="4. Stockage et sécurité">
                            <p>
                                Vos données sont stockées sur des serveurs
                                sécurisés. Nous mettons en œuvre des mesures
                                techniques et organisationnelles appropriées
                                pour protéger vos données contre tout accès non
                                autorisé, modification ou destruction.
                            </p>
                            <Placeholder>
                                Localisation des serveurs, durée de
                                conservation, mesures de sécurité techniques à
                                détailler.
                            </Placeholder>
                        </Section>

                        <Section title="5. Vos droits (RGPD)">
                            <p>
                                Conformément au Règlement Général sur la
                                Protection des Données (RGPD), vous disposez des
                                droits suivants :
                            </p>
                            <ul
                                style={{
                                    paddingLeft: "var(--spacing-24)",
                                    listStyleType: "disc",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "var(--spacing-8)",
                                }}
                            >
                                <li>
                                    <strong>Droit d'accès</strong> : obtenir une
                                    copie de vos données personnelles
                                </li>
                                <li>
                                    <strong>Droit de rectification</strong> :
                                    corriger des données inexactes
                                </li>
                                <li>
                                    <strong>Droit à l'effacement</strong> :
                                    demander la suppression de vos données
                                </li>
                                <li>
                                    <strong>Droit à la portabilité</strong> :
                                    recevoir vos données dans un format
                                    structuré
                                </li>
                                <li>
                                    <strong>Droit d'opposition</strong> : vous
                                    opposer au traitement de vos données
                                </li>
                            </ul>
                            <p>
                                Pour exercer ces droits, contactez-nous à
                                l'adresse indiquée ci-dessous.
                            </p>
                            <Placeholder>
                                Procédures d'exercice des droits et délais de
                                réponse à détailler.
                            </Placeholder>
                        </Section>

                        <Section title="6. Contact DPO">
                            <p>
                                Pour toute question relative à la protection de
                                vos données personnelles, vous pouvez contacter
                                notre Délégué à la Protection des Données :
                            </p>
                            <p
                                style={{
                                    fontWeight: "var(--font-weight-semibold)",
                                    color: "var(--color-primary-500)",
                                }}
                            >
                                dpo@gaston.pet
                            </p>
                            <Placeholder>
                                Coordonnées complètes du DPO et autorité de
                                contrôle compétente (CNIL) à compléter.
                            </Placeholder>
                        </Section>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Section = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => {
    return (
        <section>
            <h2
                style={{
                    fontSize: "var(--font-size-h4)",
                    fontWeight: "var(--font-weight-bold)",
                    color: "var(--color-text-primary)",
                    marginBottom: "var(--spacing-12)",
                }}
            >
                {title}
            </h2>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--spacing-12)",
                    fontSize: "var(--font-size-body-m)",
                    color: "var(--color-text-secondary)",
                    lineHeight: "var(--line-height-relaxed)",
                }}
            >
                {children}
            </div>
        </section>
    );
};

const Placeholder = ({ children }: { children: React.ReactNode }) => {
    return (
        <div
            style={{
                padding: "var(--spacing-12) var(--spacing-16)",
                background: "var(--color-secondary-50)",
                borderRadius: "var(--radius-md)",
                border: "1px dashed var(--color-secondary-300)",
                fontSize: "var(--font-size-body-s)",
                color: "var(--color-secondary-600)",
                fontStyle: "italic",
            }}
        >
            [À compléter par un juriste] {children}
        </div>
    );
};
