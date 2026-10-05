import type { TargetSizePreset } from '@/core/types/preset.types'

export function getTargetSizePresets(originalSizeBytes?: number): TargetSizePreset[] {
  if (!originalSizeBytes || originalSizeBytes <= 0) {
    return [
      {
        id: 'balanced_50',
        label: 'Balanced Quality',
        category: 'custom',
        targetSizeMb: 25,
        description: 'Balanced visual fidelity with ~50% file savings',
        badge: 'Popular',
      },
      {
        id: 'discord_25',
        label: 'Discord & Telegram HD',
        category: 'discord',
        targetSizeMb: 25,
        description: 'Standard 25 MB channel limit for free accounts',
        badge: '25 MB',
      },
      {
        id: 'whatsapp_16',
        label: 'WhatsApp Media',
        category: 'whatsapp',
        targetSizeMb: 16,
        description: 'Guarantees delivery through WhatsApp 16 MB limit',
        badge: '16 MB',
      },
      {
        id: 'email_10',
        label: 'Email Attachment',
        category: 'email',
        targetSizeMb: 10,
        description: 'Universal attachment compatibility for Gmail and Outlook',
        badge: '10 MB',
      },
      {
        id: 'compact_5',
        label: 'Ultra Compact',
        category: 'custom',
        targetSizeMb: 5,
        description: 'Maximum compression for quick transfers and cellular data',
        badge: '5 MB',
      },
    ]
  }

  const originalMb = originalSizeBytes / (1024 * 1024)

  const highQualityMb = Math.max(1, Math.round(originalMb * 0.75 * 10) / 10)
  const balancedMb = Math.max(1, Math.round(originalMb * 0.50 * 10) / 10)
  const compactMb = Math.max(0.5, Math.round(originalMb * 0.30 * 10) / 10)

  const presets: TargetSizePreset[] = [
    {
      id: 'preset_balanced',
      label: 'Balanced (~50%)',
      category: 'custom',
      targetSizeMb: balancedMb,
      description: `Halves file size to ~${balancedMb} MB while maintaining clean 1080p/720p visuals`,
      badge: 'Recommended',
    },
    {
      id: 'preset_hq',
      label: 'High Fidelity (~75%)',
      category: 'custom',
      targetSizeMb: highQualityMb,
      description: `Light compression to ~${highQualityMb} MB for maximum sharpness and detail`,
      badge: 'High Quality',
    },
    {
      id: 'preset_compact',
      label: 'Compact Share (~30%)',
      category: 'custom',
      targetSizeMb: compactMb,
      description: `Deep compression to ~${compactMb} MB for rapid sharing over mobile networks`,
      badge: 'Compact',
    },
  ]

  // Add platform limits ONLY if original video is larger than the limit
  if (originalMb > 25) {
    presets.push({
      id: 'discord_25',
      label: 'Discord HD',
      category: 'discord',
      targetSizeMb: 25,
      description: 'Fits standard 25 MB Discord and Telegram channel limits',
      badge: '25 MB Limit',
    })
  }

  if (originalMb > 16) {
    presets.push({
      id: 'whatsapp_16',
      label: 'WhatsApp Media',
      category: 'whatsapp',
      targetSizeMb: 16,
      description: 'Guarantees delivery under WhatsApp 16 MB media cap',
      badge: '16 MB Limit',
    })
  }

  if (originalMb > 10) {
    presets.push({
      id: 'email_10',
      label: 'Email Attachment',
      category: 'email',
      targetSizeMb: 10,
      description: 'Fits standard 10 MB email attachment limits',
      badge: '10 MB Limit',
    })
  }

  return presets
}

export const TARGET_SIZE_PRESETS = getTargetSizePresets()
