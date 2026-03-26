import { db } from "../action";
import { siteSettings } from "../schema";
import { eq } from "drizzle-orm";

export async function getSiteSettings() {
  const settings = await db.query.siteSettings.findFirst();

  if (!settings) {
    // Initialize with defaults if none exist
    const [newSettings] = await db.insert(siteSettings).values({
      makingChargePerGram: 25,
      marginMultiplier: "2.50",
    }).returning();
    return newSettings;
  }

  return settings;
}

export async function updateSiteSettings(data: {
  makingChargePerGram: number;
  marginMultiplier: string;
}) {
  const current = await getSiteSettings();

  return await db.update(siteSettings)
    .set({
      makingChargePerGram: data.makingChargePerGram,
      marginMultiplier: data.marginMultiplier,
      updatedAt: new Date(),
    })
    .where(eq(siteSettings.id, current.id))
    .returning();
}
