import type { TargetSizePreset } from '@/core/types/preset.types'

export const TARGET_SIZE_PRESETS: TargetSizePreset[] = [
  {
    id: 'discord_8mb',
    label: 'Discord Free',
    category: 'discord',
    targetSizeMb: 8,
    description: 'Compresses to fit under Discord 8 MB free upload cap',
    badge: '8 MB',
  },
  {
    id: 'discord_25mb',
    label: 'Discord Standard',
    category: 'discord',
    targetSizeMb: 25,
    description: 'Optimized for Discord 25 MB channel upload limit',
    badge: '25 MB',
  },
  {
    id: 'whatsapp_16mb',
    label: 'WhatsApp Media',
    category: 'whatsapp',
    targetSizeMb: 16,
    description: 'Guarantees delivery through WhatsApp 16 MB media limit',
    badge: '16 MB',
  },
  {
    id: 'email_10mb',
    label: 'Email Attachment',
    category: 'email',
    targetSizeMb: 10,
    description: 'Universally deliverable across Gmail, Outlook, and Apple Mail',
    badge: '10 MB',
  },
  {
    id: 'email_20mb',
    label: 'Email Large',
    category: 'email',
    targetSizeMb: 20,
    description: 'Fits standard 25 MB mail server raw ceiling after base64 overhead',
    badge: '20 MB',
  },
]
