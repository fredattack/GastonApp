import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";

export default function TermsOfService() {
    return (
        <div
            className="min-h-screen"
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
                        Conditions Générales d'Utilisation
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
                        <Section title="1. Objet">
                            <p>
                                Les présentes Conditions Générales d'Utilisation
                                (ci-après « CGU ») ont pour objet de définir les
                                modalités et conditions d'utilisation de
                                l'application Gaston (ci-après « l'Application
                                »), accessible à l'adresse app.gaston.pet.
                            </p>
                            <p>
                                Gaston est une application de gestion
                                d'événements et de suivi pour animaux de
                                compagnie, proposant des fonctionnalités de
                                planification, de suivi nutritionnel et d'aide
                                assistée par intelligence artificielle.
                            </p>
                        </Section>

                        <Section title="2. Inscription et compte utilisateur">
                            <p>
                                L'utilisation de l'Application nécessite la
                                création d'un compte utilisateur. L'utilisateur
                                s'engage à fournir des informations exactes et à
                                maintenir la confidentialité de ses identifiants
                                de connexion.
                            </p>
                            <p>
                                L'utilisateur est seul responsable de toute
                                activité effectuée depuis son compte.
                            </p>
                        </Section>

                        <Section title="3. Utilisation de l'intelligence artificielle">
                            <p>
                                L'Application intègre des fonctionnalités
                                d'intelligence artificielle fournies par des
                                services tiers (OpenAI). Les réponses générées
                                par l'IA sont fournies à titre informatif
                                uniquement et ne constituent en aucun cas un
                                avis vétérinaire ou médical.
                            </p>
                            <p>
                                L'utilisateur est informé que les données
                                échangées avec l'assistant IA sont transmises
                                aux serveurs d'OpenAI pour traitement. Aucune
                                donnée personnelle identifiante n'est
                                volontairement transmise dans ces échanges.
                            </p>
                            <Placeholder>
                                Détails techniques sur le traitement des données
                                IA à compléter par un juriste.
                            </Placeholder>
                        </Section>

                        <Section title="4. Données personnelles">
                            <p>
                                Les données personnelles collectées sont
                                traitées conformément à notre{" "}
                                <Link
                                    to="/privacy"
                                    style={{
                                        color: "var(--color-primary-500)",
                                        textDecoration: "underline",
                                    }}
                                >
                                    Politique de Confidentialité
                                </Link>
                                . L'utilisateur dispose d'un droit d'accès, de
                                rectification et de suppression de ses données
                                conformément au RGPD.
                            </p>
                            <Placeholder>
                                Clauses RGPD détaillées à compléter par un
                                juriste.
                            </Placeholder>
                        </Section>

                        <Section title="5. Responsabilité limitée (Version Beta)">
                            <p>
                                L'Application est actuellement en version Beta.
                                En conséquence :
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
                                    Des bugs ou dysfonctionnements peuvent
                                    survenir
                                </li>
                                <li>
                                    Les données pourraient être réinitialisées
                                    lors de mises à jour majeures
                                </li>
                                <li>
                                    Les fonctionnalités peuvent évoluer ou être
                                    modifiées sans préavis
                                </li>
                                <li>
                                    Le service est fourni « en l'état » sans
                                    garantie de disponibilité
                                </li>
                            </ul>
                            <Placeholder>
                                Clauses de limitation de responsabilité à
                                compléter par un juriste.
                            </Placeholder>
                        </Section>

                        <Section title="6. Propriété intellectuelle">
                            <p>
                                L'ensemble des éléments de l'Application (logo,
                                design, textes, fonctionnalités) sont la
                                propriété exclusive de Gaston. Toute
                                reproduction ou utilisation non autorisée est
                                interdite.
                            </p>
                            <Placeholder>
                                Clauses de propriété intellectuelle à compléter
                                par un juriste.
                            </Placeholder>
                        </Section>

                        <Section title="7. Contact">
                            <p>
                                Pour toute question relative aux présentes CGU,
                                vous pouvez nous contacter à l'adresse :
                            </p>
                            <p
                                style={{
                                    fontWeight: "var(--font-weight-semibold)",
                                    color: "var(--color-primary-500)",
                                }}
                            >
                                contact@gaston.pet
                            </p>
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
