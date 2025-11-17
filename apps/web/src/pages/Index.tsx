import React from "react";
import { Button, Card, Badge, Avatar } from '@gastonapp/ui';
import { Dog, Calendar, Plus, Heart, PawPrint, Bell } from '@phosphor-icons/react';

/**
 * Page d'accueil - VERSION TEST pour valider les nouveaux composants
 * TODO: Remplacer par la vraie home page avec HeroSection, QuickActions, etc.
 */
const Index: React.FC = () => {
    return (
        <div className="min-h-screen" style={{ background: 'var(--color-lin-2)' }}>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Hero Section Test */}
                <Card variant="gradient" gradient="mint-lavender" padding="lg" className="mb-8">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                            Welcome to GastonApp
                        </h1>
                        <p className="text-xl mb-6 text-white/90">
                            Manage your pets' health, schedule, and activities all in one place.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Button variant="secondary" icon={<Plus />} iconPosition="left">
                                Add Pet
                            </Button>
                            <Button variant="ghost" icon={<Calendar />} iconPosition="left">
                                View Calendar
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-primary-900)' }}>
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card variant="standard" padding="lg">
                            <PawPrint size={32} style={{ color: 'var(--color-primary-500)' }} />
                            <h3 className="font-semibold mt-3" style={{ color: 'var(--color-primary-900)' }}>
                                My Pets
                            </h3>
                            <p className="text-sm mt-1" style={{ color: 'var(--color-neutral-600)' }}>
                                View all pets
                            </p>
                        </Card>

                        <Card variant="standard" padding="lg">
                            <Calendar size={32} style={{ color: 'var(--color-accent-500)' }} />
                            <h3 className="font-semibold mt-3" style={{ color: 'var(--color-primary-900)' }}>
                                Calendar
                            </h3>
                            <p className="text-sm mt-1" style={{ color: 'var(--color-neutral-600)' }}>
                                Schedule events
                            </p>
                        </Card>

                        <Card variant="standard" padding="lg">
                            <Bell size={32} style={{ color: 'var(--color-warning-500)' }} />
                            <h3 className="font-semibold mt-3" style={{ color: 'var(--color-primary-900)' }}>
                                Reminders
                            </h3>
                            <p className="text-sm mt-1" style={{ color: 'var(--color-neutral-600)' }}>
                                Active alerts
                            </p>
                        </Card>

                        <Card variant="standard" padding="lg">
                            <Heart size={32} style={{ color: 'var(--color-error-400)' }} />
                            <h3 className="font-semibold mt-3" style={{ color: 'var(--color-primary-900)' }}>
                                Health
                            </h3>
                            <p className="text-sm mt-1" style={{ color: 'var(--color-neutral-600)' }}>
                                Track wellness
                            </p>
                        </Card>
                    </div>
                </div>

                {/* Pet Cards Test */}
                <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-primary-900)' }}>
                        My Pets
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card variant="standard" padding="md">
                            <div className="flex items-start gap-4 mb-4">
                                <Avatar
                                    size="lg"
                                    src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100&h=100&fit=crop"
                                    alt="Max"
                                />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold" style={{ color: 'var(--color-primary-900)' }}>
                                        Max
                                    </h3>
                                    <p className="text-sm" style={{ color: 'var(--color-neutral-600)' }}>
                                        Golden Retriever • 3 years
                                    </p>
                                    <div className="flex gap-2 mt-2">
                                        <Badge variant="success" size="sm">Healthy</Badge>
                                        <Badge variant="info" size="sm">Vet Today</Badge>
                                    </div>
                                </div>
                            </div>
                            <Button variant="primary" size="sm" icon={<Calendar />} fullWidth>
                                Schedule Event
                            </Button>
                        </Card>

                        <Card variant="standard" padding="md">
                            <div className="flex items-start gap-4 mb-4">
                                <Avatar
                                    size="lg"
                                    src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&h=100&fit=crop"
                                    alt="Bella"
                                />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold" style={{ color: 'var(--color-primary-900)' }}>
                                        Bella
                                    </h3>
                                    <p className="text-sm" style={{ color: 'var(--color-neutral-600)' }}>
                                        Persian Cat • 2 years
                                    </p>
                                    <div className="flex gap-2 mt-2">
                                        <Badge variant="success" size="sm">Healthy</Badge>
                                        <Badge variant="neutral" size="sm">Indoor</Badge>
                                    </div>
                                </div>
                            </div>
                            <Button variant="primary" size="sm" icon={<Calendar />} fullWidth>
                                Schedule Event
                            </Button>
                        </Card>

                        {/* Add New Pet Card */}
                        <Card variant="gradient" gradient="activity-purple" padding="md">
                            <div className="text-center py-4">
                                <Plus size={48} className="mx-auto mb-3" style={{ color: 'white' }} />
                                <h3 className="text-lg font-semibold mb-2 text-white">
                                    Add New Pet
                                </h3>
                                <p className="text-sm text-white/90 mb-4">
                                    Register your new companion
                                </p>
                                <Button variant="secondary" size="sm" icon={<Plus />}>
                                    Add Pet
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Test Note */}
                <Card variant="glass" padding="md" className="mt-8">
                    <p className="text-sm text-center" style={{ color: 'var(--color-neutral-600)' }}>
                        <strong>Note:</strong> Ceci est une version de test pour valider les nouveaux composants.
                        Voir <a href="/components-showcase" className="underline">la page showcase</a> pour tous les composants.
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default Index;
