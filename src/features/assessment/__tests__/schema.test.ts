import { describe, expect, it } from 'vitest';
import { assessmentSchema } from '../schema';

const validBasePatient = {
  mrn: 'MRN-004821',
  patientName: 'Sushila Deshpande',
  dateOfBirth: '1949-03-12',
  assessmentDate: '2026-08-07',
  mobility: 'cane' as const,
  barthelIndex: 80,
  medicationCount: 3,
  pharmacistReviewRequested: false,
  followUpDate: '2026-09-04',
  consentObtained: true as const,
};

describe('assessmentSchema dateOfBirth 60-year boundary tests', () => {
  it('accepts a patient who turns exactly 60 on the assessment date (1966-08-07 for 2026-08-07)', () => {
    const result = assessmentSchema.safeParse({
      ...validBasePatient,
      dateOfBirth: '1966-08-07',
      assessmentDate: '2026-08-07',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a patient who is one day short of 60 on the assessment date (1966-08-08 for 2026-08-07)', () => {
    const result = assessmentSchema.safeParse({
      ...validBasePatient,
      dateOfBirth: '1966-08-08',
      assessmentDate: '2026-08-07',
    });
    expect(result.success).toBe(false);

    const issues = result.success ? [] : result.error.issues;
    const dobError = issues.find((issue) => issue.path.includes('dateOfBirth'));
    expect(dobError?.message).toBe('This pathway is for patients aged 60 and over');
  });
});
