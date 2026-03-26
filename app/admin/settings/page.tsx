export const dynamic = "force-dynamic";

import React from "react";
import { SettingsForm } from "@/components/SettingsForm";
import { getSiteSettings } from "@/app/admin/actions";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-spectral text-2xl italic font-bold">Settings</h2>
        <p className="text-sm text-ivory/50 mt-1">
          Configure global pricing strategy and atelier parameters.
        </p>
      </div>

      <SettingsForm
        initialSettings={{
          makingChargePerGram: settings.makingChargePerGram,
          marginMultiplier: settings.marginMultiplier,
        }}
      />
    </div>
  );
}
