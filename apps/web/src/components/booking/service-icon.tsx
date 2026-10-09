import { CircleDot, Droplets, Gauge, Snowflake, Sparkles, Wrench, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const RULES: ReadonlyArray<[RegExp, LucideIcon]> = [
  [/oil|filter|fluid/i, Droplets],
  [/brake|rotor|disc|pad/i, CircleDot],
  [/diagnos|obd|scan|ecu/i, Gauge],
  [/\bac\b|a\/c|air.?con|cool|gas/i, Snowflake],
  [/tune|spark|plug|ignition|battery|electric/i, Zap],
  [/wash|detail|polish|clean/i, Sparkles],
]

/** An icon that suits a service, from words in its name; a wrench otherwise. */
export function serviceIcon(name: string): LucideIcon {
  return RULES.find(([pattern]) => pattern.test(name))?.[1] ?? Wrench
}
