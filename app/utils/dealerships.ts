/**
 * Dealership data structure
 */
export interface DealershipInfo {
  name: string
  logo: string
  website: string
  logoWidth?: number
  logoHeight?: number
}

/**
 * All onboarded dealerships
 */
export const DEALERSHIPS: DealershipInfo[] = [
  {
    name: "Boardwalk Lotus Redwood City",
    logo: "/lotus-logo.png",
    website: "https://www.boardwalklotus.com/",
    logoWidth: 250,
    logoHeight: 250,
  },
  {
    name: "The Luxury Collection Los Gatos",
    logo: "/lamborghini-logo.png",
    website: "https://www.losgatosluxcars.com/",
    logoWidth: 200,
    logoHeight: 100,
  },
  {
    name: "Lamborghini Newport Beach",
    logo: "/lambonb.png",
    website: "https://www.lamborghininewportbeach.com/",
    logoWidth: 200,
    logoHeight: 100,
  },
  {
    name: "Ferrari Rancho Mirage",
    logo: "/ferrari.png",
    website: "https://www.ferrariofrm.com/",
    logoWidth: 200,
    logoHeight: 100,
  },
]

/**
 * Get dealership info by name
 * @param dealershipName The dealership name
 * @returns The dealership info or undefined if not found
 */
export function getDealershipInfo(dealershipName: string): DealershipInfo | undefined {
  return DEALERSHIPS.find((d) => d.name === dealershipName)
}

/**
 * Get the logo URL for a dealership
 * @param dealershipName The dealership name
 * @returns The path to the dealership logo
 */
export function getDealershipLogo(dealershipName: string): string {
  return getDealershipInfo(dealershipName)?.logo || "/placeholder-logo.png"
}

