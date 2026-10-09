import { Assessment, MOBILITY } from './schema';

export function formatMobilityLabel(value: string): string {
  return value
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export const MOBILITY_OPTIONS = MOBILITY.map((value) => ({
  value,
  label: formatMobilityLabel(value),
}));

export const SAMPLE_PATIENT: Assessment = {
  mrn: 'MRN-004821',
  patientName: 'Sushila Deshpande',
  dateOfBirth: '1949-03-12',
  assessmentDate: '2026-08-07',
  mobility: 'cane',
  barthelIndex: 80,
  medicationCount: 3,
  pharmacistReviewRequested: false,
  followUpDate: '2026-09-04',
  consentObtained: true,
};

export const INITIAL_VALUES = {
  mrn: '',
  patientName: '',
  dateOfBirth: '',
  assessmentDate: '',
  mobility: '' as unknown as Assessment['mobility'],
  barthelIndex: '' as unknown as number,
  medicationCount: '' as unknown as number,
  pharmacistReviewRequested: false,
  followUpDate: '',
  consentObtained: false,
};
