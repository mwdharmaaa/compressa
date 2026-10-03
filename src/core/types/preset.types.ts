export interface TargetSizePreset {
  id: string
  label: string
  category: 'discord' | 'email' | 'whatsapp' | 'custom'
  targetSizeMb: number
  description: string
  badge?: string
}
