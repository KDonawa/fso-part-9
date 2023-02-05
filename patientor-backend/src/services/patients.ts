import patientsData from "../data/patients";
import { v1 as uuid } from "uuid";

import {
  NonSensitivePatient,
  NewPatient,
  Patient,
  Entry,
  NewEntry,
} from "../types";

const patients: Patient[] = patientsData;

const getPatients = (): NonSensitivePatient[] => {
  return patients.map((patient) => ({
    id: patient.id,
    name: patient.name,
    dateOfBirth: patient.dateOfBirth,
    gender: patient.gender,
    occupation: patient.occupation,
  }));
};

const addPatient = (newPatient: NewPatient): NonSensitivePatient => {
  const patient: Patient = {
    id: uuid(),
    ...newPatient,
    entries: [],
  };
  patients.push(patient);

  return {
    id: patient.id,
    name: patient.name,
    dateOfBirth: patient.dateOfBirth,
    gender: patient.gender,
    occupation: patient.occupation,
  };
};

const getPatientById = (id: string): Patient | undefined => {
  return patients.find((patient) => patient.id === id);
};

const addPatientEntry = (id: string, newEntry: NewEntry): Entry | undefined => {
  const patient = getPatientById(id);
  if (!patient) return undefined;

  const entry = {
    id: uuid(),
    ...newEntry,
  } as Entry;

  patient.entries.push(entry);
  return entry;
};

export default {
  getPatients,
  addPatient,
  getPatientById,
  addPatientEntry,
};
