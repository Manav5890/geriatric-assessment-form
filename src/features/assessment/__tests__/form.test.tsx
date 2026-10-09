import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { render } from '../../../../test-utils';
import { AssessmentForm } from '../components/AssessmentForm';
import { SAMPLE_PATIENT } from '../utils';

describe('AssessmentForm rendered test', () => {
  it('loads sample patient, submits form, and calls save handler with parsed values', async () => {
    const onSaveSuccess = vi.fn();
    const user = userEvent.setup();

    render(<AssessmentForm onSaveSuccess={onSaveSuccess} />);

    // 1. Click "Load sample patient"
    const loadButton = screen.getByRole('button', { name: /load sample patient/i });
    await user.click(loadButton);

    // 2. Submit form
    const submitButton = screen.getByRole('button', { name: /save assessment/i });
    await user.click(submitButton);

    // 3. Wait for submission delay (~800ms) and check callback & rendered alert
    await waitFor(
      () => {
        expect(onSaveSuccess).toHaveBeenCalledTimes(1);
      },
      { timeout: 3000 }
    );

    expect(onSaveSuccess).toHaveBeenCalledWith(SAMPLE_PATIENT);

    const alertOutput = await screen.findByTestId('submitted-output');
    expect(alertOutput.textContent).toContain('MRN-004821');
    expect(alertOutput.textContent).toContain('Sushila Deshpande');
  });

  it('renders exactly 9 errors when submitting an empty form', async () => {
    render(<AssessmentForm />);

    const submitButton = screen.getByRole('button', { name: /save assessment/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Must look like MRN-004821')).toBeInTheDocument();
      expect(screen.getByText('Patient name must be at least 2 characters')).toBeInTheDocument();
      expect(screen.getByText('Date of birth is required')).toBeInTheDocument();
      expect(screen.getByText('Assessment date is required')).toBeInTheDocument();
      expect(screen.getByText('Select a mobility status')).toBeInTheDocument();
      expect(screen.getByText('Barthel Index score is required')).toBeInTheDocument();
      expect(screen.getByText('Enter the number of regular medications')).toBeInTheDocument();
      expect(screen.getByText('Next review date is required')).toBeInTheDocument();
      expect(
        screen.getByText('Consent must be obtained before the assessment can be saved')
      ).toBeInTheDocument();
    });
  });
});
