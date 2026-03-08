import { HeroPattern } from "@/features/dashboard/components/hero-pattern";
import { TextInputPanel } from "@/features/dashboard/components/text-input-panel";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { QuickActionsPanel } from "@/features/dashboard/components/quick-actions-panel";

import { PageHeader } from "@/components/page-header";

export function DashboardView() {
  return (
    <div className="relative">
      <PageHeader title="Dashboard" className="lg:hidden" />
      <HeroPattern />
      <div className="relative space-y-8 p-4 lg:p-16">
        <DashboardHeader />
        <TextInputPanel />
        <QuickActionsPanel />
      </div>
    </div>
  );
}
