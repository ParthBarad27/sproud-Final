import React from 'react';
import Header from '../components/ui/Header';
import Button from '../components/ui/Button';
import Icon from '../components/AppIcon';

const LinkCard = ({ title, desc, actions }) => (
  <div className="bg-card border border-border rounded-xl p-6">
    <div className="flex items-center justify-between mb-2">
      <h3 className="font-semibold text-foreground">{title}</h3>
      <Icon name="ExternalLink" size={16} className="text-muted-foreground" />
    </div>
    <p className="text-sm text-muted-foreground mb-4">{desc}</p>
    <div className="flex flex-wrap gap-2">
      {actions?.map((a) => (
        <a key={a?.label} href={a?.href} target={a?.target ?? '_self'} rel="noreferrer">
          <Button variant={a?.variant ?? 'outline'} iconName={a?.icon ?? 'ArrowRight'} iconPosition="right" size="sm">
            {a?.label}
          </Button>
        </a>
      ))}
    </div>
  </div>
);

const Integrations = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-foreground">Legacy Parts Integration</h1>
            <p className="text-muted-foreground mt-2">Access and run Parts A, C, D, and E from the unified app</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LinkCard
              title="Part A (Authentication) - Flask"
              desc="Standalone Flask app, moved under apps/."
              actions={[
                { label: 'Open README', href: '/apps/part-a-auth/README.md', icon: 'BookOpen' },
              ]}
            />

            <LinkCard
              title="Part D (Resource Hub) - React"
              desc="Older prototype moved to apps/. The integrated Resource Library is live."
              actions={[
                { label: 'Open Integrated Module', href: '/resource-library', icon: 'Play' },
              ]}
            />

            <LinkCard
              title="Part C (Standalone builds)"
              desc="Static builds are now served under /part-c/ via Vite public/."
              actions={[
                { label: 'Open Dist', href: '/part-c/dist/index.html', target: '_blank', icon: 'ExternalLink' },
                { label: 'Open My Project Dist', href: '/part-c/my-project/dist/index.html', target: '_blank', icon: 'ExternalLink' }
              ]}
            />

            <LinkCard
              title="Part E (Appointment) - JSX Demo"
              desc="Legacy demo moved to apps/. The new Appointment Booking is integrated."
              actions={[
                { label: 'Open Appointments', href: '/appointment-booking', icon: 'Calendar' }
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Integrations;


