import diagnosesData from "./data/diagnoses";
import {
  NewPatient,
  Gender,
  BaseEntry,
  Diagnosis,
  EntryType,
  HealthCheckEntry,
  HealthCheckRating,
  HospitalEntry,
  OccupationalHealthcareEntry,
  NewEntry,
} from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseNewPatientData = (data: any): NewPatient => {
  const newPatient: NewPatient = {
    name: parseString(data.name),
    dateOfBirth: parseDate(data.dateOfBirth),
    ssn: parseString(data.ssn),
    gender: parseGender(data.gender),
    occupation: parseString(data.occupation),
  };

  return newPatient;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseNewPatientEntry = (data: any): NewEntry => {
  const baseEntry: Omit<BaseEntry, "id"> = {
    description: parseString(data.description),
    date: parseDate(data.date),
    specialist: parseString(data.specialist),
    diagnosisCodes: parseDiagnosisCodes(data.diagnosisCodes),
  };

  const type = parseEntryType(data.type);

  switch (type) {
    case "HealthCheck":
      const healthCheckEntry: Omit<HealthCheckEntry, "id"> = {
        ...baseEntry,
        type: "HealthCheck",
        healthCheckRating: parseHealthCheckRating(data.healthCheckRating),
      };
      return healthCheckEntry;
    case "Hospital":
      const hospitalEntry: Omit<HospitalEntry, "id"> = {
        ...baseEntry,
        type: "Hospital",
        discharge: parseDischarge(data.discharge),
      };
      return hospitalEntry;
    case "OccupationalHealthcare":
      const occupationalEntry: Omit<OccupationalHealthcareEntry, "id"> = {
        ...baseEntry,
        type: "OccupationalHealthcare",
        employerName: parseString(data.employerName),
        sickLeave: parseSickLeave(data.sickLeave),
      };
      return occupationalEntry;
  }
};

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(Gender).includes(param);
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(HealthCheckRating).includes(param);
};

const isEntryType = (value: string): value is EntryType => {
  return (
    value === "HealthCheck" ||
    value === "OccupationalHealthcare" ||
    value === "Hospital"
  );
};

const parseString = (value: unknown): string => {
  if (!value || !isString(value)) {
    throw new Error("Incorrect or missing value: " + value);
  }
  return value;
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date: " + date);
  }
  return date;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error("Incorrect or missing gender: " + gender);
  }
  return gender;
};
const parseHealthCheckRating = (value: unknown): HealthCheckRating => {
  if (!value || !isHealthCheckRating(value)) {
    throw new Error("Incorrect or missing health check rating: " + value);
  }
  return value;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isDiagnosisCode = (code: unknown) => {
  const isCode = diagnosesData.find((diagnosis) => diagnosis.code === code);
  if (isCode) return true;
  return false;
};

const parseDiagnosisCodes = (
  value: unknown
): Array<Diagnosis["code"]> | undefined => {
  if (!value) return undefined;

  if (!Array.isArray(value) || !value.every((x) => isDiagnosisCode(x))) {
    throw new Error("Incorrect data: " + value);
  }
  return value as Array<Diagnosis["code"]>;
};

const parseEntryType = (value: unknown): EntryType => {
  if (!value || !isString(value) || !isEntryType(value)) {
    throw new Error("Incorrect or missing type: " + value);
  }
  return value;
};

const parseSickLeave = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
): { startDate: string; endDate: string } | undefined => {
  if (!value) return undefined;

  return {
    startDate: parseDate(value.startDate),
    endDate: parseDate(value.endDate),
  };
};

const parseDischarge = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
): { date: string; criteria: string } => {
  if (!value) throw new Error("missing discharge");

  return {
    date: parseDate(value.date),
    criteria: parseString(value.criteria),
  };
};
