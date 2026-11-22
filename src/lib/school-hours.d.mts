export type SchoolHoursSettings = { endHour: number; own: boolean; serverEndHour: number; updatedAt: string | null };
export function serverEndHour(): number;
export function schoolHoursSettings(): Promise<SchoolHoursSettings>;
export function schoolEndHour(): Promise<number>;
export function setSchoolEndHour(endHour: number | null): Promise<SchoolHoursSettings>;
