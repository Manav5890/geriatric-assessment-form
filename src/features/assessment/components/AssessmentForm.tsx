import { useState } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  Code,
  Container,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { schemaResolver, useForm } from '@mantine/form';
import { Assessment, assessmentSchema } from '../schema';
import { INITIAL_VALUES, MOBILITY_OPTIONS, SAMPLE_PATIENT } from '../utils';

export function AssessmentForm({ onSaveSuccess }: { onSaveSuccess?: (data: Assessment) => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<Assessment | null>(null);

  const form = useForm({
    mode: 'controlled',
    initialValues: INITIAL_VALUES,
    validate: schemaResolver(assessmentSchema),
    validateInputOnBlur: true,
  });

  const handleLoadSample = () => {
    form.setValues(SAMPLE_PATIENT);
    form.clearErrors();
    setSubmittedData(null);
  };

  const handleSubmit = async (values: typeof INITIAL_VALUES) => {
    setSubmitting(true);
    setSubmittedData(null);

    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const parsedData = assessmentSchema.parse(values);
      setSubmittedData(parsedData);
      if (onSaveSuccess) {
        onSaveSuccess(parsedData);
      }
    } catch {
      // Validation errors are handled by schemaResolver on submit
    } finally {
      setSubmitting(false);
    }
  };

  const getDateValue = (val: string): string | null => (val ? val : null);

  const handleDateChange =
    (field: 'dateOfBirth' | 'assessmentDate' | 'followUpDate') => (val: string | null) => {
      if (!val) {
        form.setFieldValue(field, '');
        return;
      }
      form.setFieldValue(field, val);
    };

  return (
    <Container size="sm" py="xl">
      <Paper withBorder shadow="sm" p="xl" radius="md">
        <Group justify="space-between" align="flex-start" mb="lg">
          <div>
            <Title order={2}>Geriatric Care Assessment</Title>
            <Text c="dimmed" size="sm">
              Home visit clinical evaluation form for elderly patient check-in.
            </Text>
          </div>
          <Button variant="light" color="blue" onClick={handleLoadSample}>
            Load sample patient
          </Button>
        </Group>

        <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
          <Stack gap="md">
            <TextInput
              label="Medical record number"
              placeholder="MRN-004821"
              required
              {...form.getInputProps('mrn')}
            />

            <TextInput
              label="Patient name"
              placeholder="e.g. Sushila Deshpande"
              required
              {...form.getInputProps('patientName')}
            />

            <DateInput
              label="Date of birth"
              placeholder="YYYY-MM-DD"
              valueFormat="YYYY-MM-DD"
              required
              clearable
              value={getDateValue(form.values.dateOfBirth)}
              onChange={handleDateChange('dateOfBirth')}
              onBlur={() => form.validateField('dateOfBirth')}
              error={form.errors.dateOfBirth}
            />

            <DateInput
              label="Assessment date"
              placeholder="YYYY-MM-DD"
              valueFormat="YYYY-MM-DD"
              maxDate={new Date()}
              required
              clearable
              value={getDateValue(form.values.assessmentDate)}
              onChange={handleDateChange('assessmentDate')}
              onBlur={() => form.validateField('assessmentDate')}
              error={form.errors.assessmentDate}
            />

            <Select
              label="Mobility"
              placeholder="Select mobility status"
              data={MOBILITY_OPTIONS}
              required
              clearable
              {...form.getInputProps('mobility')}
            />

            <NumberInput
              label="Barthel Index"
              placeholder="0 to 100 in steps of 5"
              step={5}
              min={0}
              max={100}
              required
              {...form.getInputProps('barthelIndex')}
            />

            <NumberInput
              label="Regular medications"
              placeholder="0 to 30"
              min={0}
              max={30}
              required
              {...form.getInputProps('medicationCount')}
            />

            <Checkbox
              label="Pharmacist review requested"
              {...form.getInputProps('pharmacistReviewRequested', { type: 'checkbox' })}
            />

            <DateInput
              label="Next review date"
              placeholder="YYYY-MM-DD"
              valueFormat="YYYY-MM-DD"
              required
              clearable
              value={getDateValue(form.values.followUpDate)}
              onChange={handleDateChange('followUpDate')}
              onBlur={() => form.validateField('followUpDate')}
              error={form.errors.followUpDate}
            />

            <Checkbox
              label="Patient or representative has given consent"
              required
              {...form.getInputProps('consentObtained', { type: 'checkbox' })}
            />

            <Button type="submit" loading={submitting} disabled={submitting} mt="md" fullWidth>
              Save Assessment
            </Button>
          </Stack>
        </form>

        {submittedData && (
          <Alert color="green" title="Assessment saved successfully" mt="xl" radius="md">
            <Text size="xs" mb="xs" c="dimmed">
              Parsed output returned by Zod validation schema:
            </Text>
            <Code block data-testid="submitted-output">
              {JSON.stringify(submittedData, null, 2)}
            </Code>
          </Alert>
        )}
      </Paper>
    </Container>
  );
}
