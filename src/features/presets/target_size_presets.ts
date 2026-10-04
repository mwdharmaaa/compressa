import type { TargetSizePreset } from '@/core/types/preset.types'

export const TARGET_SIZE_PRESETS: TargetSizePreset[] = [
  {
    id: 'balanced_50mb',
    label: 'Balanced HD',
    category: 'custom',
    targetSizeMb: 50,
    description: 'Sensible balance: pristine 1080p video, untouched audio, and healthy file savings',
    badge: '50 MB',
  },
  {
    id: 'discord_25mb',
    label: 'Discord & Telegram HD',
    category: 'discord',
    targetSizeMb: 25,
    description: 'High definition sharing under standard 25 MB channel limits',
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
    label: 'Compact Share',
    category: 'email',
    targetSizeMb: 10,
    description: 'Fits email attachment limits with auto-adjusted bitrate',
    badge: '10 MB',
  },
  {
    id: 'hd_100mb',
    label: 'Near-Lossless HD',
    category: 'custom',
    targetSizeMb: 100,
    description: 'High-bitrate compression for large files with zero noticeable loss',
    badge: '100 MB',
  },
]
