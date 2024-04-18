// utils.ts
import { AtBat } from "@/lib/types/types";

const playResultToVariantMap: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  'single': 'default',
  'double': 'default',
  'triple': 'default',
  'homerun': 'secondary',
  'out': 'destructive',
  'walk': 'outline',
  'hitByPitch': 'outline',
  'error': 'destructive',
  'sacrifice': 'default',
  'stolenBase': 'default',
  'fieldersChoice': 'default',
  'balk': 'destructive',
  'wildPitch': 'destructive',
};

export const getVariantFromPlayResult = (atBat: AtBat): 'default' | 'secondary' | 'destructive' | 'outline' => {
  return playResultToVariantMap[atBat.playResult] || 'default';
};