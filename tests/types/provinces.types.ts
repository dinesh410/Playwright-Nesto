/**
 * Canadian provinces and territories
 * Used across multiple features, not just signup
 * Contains province codes (consistent across locales)
 */
export const PROVINCE_CODES = {
  ONTARIO: 'ON',
  QUEBEC: 'QC',
  ALBERTA: 'AB',
  BRITISH_COLUMBIA: 'BC',
  MANITOBA: 'MB',
  NEW_BRUNSWICK: 'NB',
  NOVA_SCOTIA: 'NS',
  NEWFOUNDLAND: 'NL',
  PRINCE_EDWARD_ISLAND: 'PE',
  SASKATCHEWAN: 'SK',
  NORTHWEST_TERRITORIES: 'NT',
  YUKON: 'YT',
  NUNAVUT: 'NU',
} as const;

/**
 * Province key type for type safety
 */
export type ProvinceKey = keyof typeof PROVINCE_CODES;

/**
 * Province information with localized name and code
 */
export interface LocalizedProvince {
  key: ProvinceKey;
  name: string;
  code: string;
}

/**
 * Get localized province information
 * @param provinceKey - The province key (e.g., 'ONTARIO', 'QUEBEC')
 * @param localeConfig - The locale configuration containing province names
 * @returns LocalizedProvince object with name and code
 */
export function getLocalizedProvince(
  provinceKey: ProvinceKey,
  localeConfig: { provinces: Record<ProvinceKey, string> }
): LocalizedProvince {
  return {
    key: provinceKey,
    name: localeConfig.provinces[provinceKey],
    code: PROVINCE_CODES[provinceKey],
  };
}

/**
 * Get all localized provinces
 * @param localeConfig - The locale configuration containing province names
 * @returns Array of LocalizedProvince objects
 */
export function getAllLocalizedProvinces(
  localeConfig: { provinces: Record<ProvinceKey, string> }
): LocalizedProvince[] {
  return (Object.keys(PROVINCE_CODES) as ProvinceKey[]).map((key) =>
    getLocalizedProvince(key, localeConfig)
  );
}

/**
 * Helper: Get province code from localized name
 * @param provinceName - The localized province name
 * @param localeConfig - The locale configuration containing province names
 * @returns Province code or empty string if not found
 */
export function getProvinceCodeFromName(
  provinceName: string,
  localeConfig: { provinces: Record<ProvinceKey, string> }
): string {
  const province = getAllLocalizedProvinces(localeConfig).find(
    (p) => p.name === provinceName
  );
  return province?.code || '';
}
