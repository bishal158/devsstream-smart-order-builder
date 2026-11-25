import React from 'react';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-surface rounded-2xl p-6 border border-border shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-primary">
              Frontend Technical Assessment
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-text-main">
              Smart Order Builder
            </h1>
            <p className="text-sm text-text-muted mt-1">
              Rules engine, shared stock, dynamic pricing & sales assistant
            </p>
          </div>

          <div className="flex items-center gap-3 bg-background px-4 py-3 rounded-xl border border-border">
            <div className="text-right">
              <div className="text-xs text-text-muted">Assessment Mode</div>
              <div className="text-sm font-bold text-primary">Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Placeholder for Builder & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Product & Option Builder (8 cols) */}
        <section className="lg:col-span-8 space-y-6">
          <div className="bg-surface rounded-2xl p-6 border border-border shadow-xs">
            <h2 className="text-lg font-bold text-text-main mb-2">Build Your Breakfast</h2>
            <p className="text-sm text-text-muted mb-4">
              Base Price: <span className="font-semibold text-text-main">250 BDT</span>
            </p>
            <div className="p-8 border-2 border-dashed border-border rounded-xl text-center text-text-muted text-sm">
              Product options & rules engine will be rendered here.
            </div>
          </div>
        </section>

        {/* Right Column: Live Order Summary & Cart (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-surface rounded-2xl p-6 border border-border shadow-xs sticky top-24">
            <h2 className="text-lg font-bold text-text-main mb-2">Live Order Summary</h2>
            <p className="text-xs text-text-muted mb-4">
              Integer Poisha-based real-time pricing calculation
            </p>
            <div className="p-8 border-2 border-dashed border-border rounded-xl text-center text-text-muted text-sm">
              Live cart summary, discounts, VAT & reservation timer will be rendered here.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
