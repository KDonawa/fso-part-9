import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { setCurrentPatient, useStateValue } from "../state";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import { Patient, Entry, HealthCheckRating } from "../types";
import { Button } from "@material-ui/core";
import AddEntryModal from "../AddEntryModal";
import { EntryFormValues } from "../AddEntryModal/AddEntryForm";

function SinglePatientPage() {
  const [{ currentPatient }, dispatch] = useStateValue();
  const { id } = useParams();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    if (!id) return;

    try {
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        {
          ...values,
          healthCheckRating: "Healthy",
        }
      );
      console.log("🚀 ~ submitNewEntry ~ newEntry", newEntry);
      // dispatch(addEntry(newEntry));
      closeModal();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || "Unrecognized axios error");
        setError(
          String(e?.response?.data?.error) || "Unrecognized axios error"
        );
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  useEffect(() => {
    if (!id) return;

    if (currentPatient && currentPatient.id === id) return;

    async function getPatientById(id: string) {
      const { data: patient } = await axios.get<Patient>(
        `${apiBaseUrl}/patients/${id}`
      );

      dispatch(setCurrentPatient(patient));
    }

    getPatientById(id).catch((e: unknown) => {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || "Unrecognized axios error");
      } else {
        console.error("Unknown error", e);
      }
    });
  }, [id, currentPatient, apiBaseUrl, dispatch]);

  if (!currentPatient) return <div>Loading...</div>;

  return (
    <>
      <div>
        <h2>{currentPatient.name}</h2>
        <p>Gender: {currentPatient.gender}</p>
        <p>SSN: {currentPatient.ssn}</p>
        <p>Occupation: {currentPatient.occupation}</p>
        {currentPatient.entries.length === 0 ? (
          <p>Patient has no entries</p>
        ) : (
          <>
            <h3>Entries</h3>
            <hr />
            {currentPatient.entries.map((entry) => (
              <div key={entry.id}>
                <PatientEntry entry={entry} />
                <hr />
              </div>
            ))}
          </>
        )}
      </div>
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Entry
      </Button>
    </>
  );
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

function PatientEntry({ entry }: { entry: Entry }) {
  const [{ diagnoses }] = useStateValue();

  const { date, description, diagnosisCodes, type } = entry;

  let content = null;
  switch (type) {
    case "HealthCheck":
      content = <p>Rating: {HealthCheckRating[entry.healthCheckRating]}</p>;
      break;
    case "Hospital":
      content = (
        <p>
          Discharge date: {entry.discharge.date}. Criteria:{" "}
          {entry.discharge.criteria}
        </p>
      );
      break;
    case "OccupationalHealthcare":
      content = (
        <>
          <p>Employer: {entry.employerName}</p>
          {entry.sickLeave && (
            <p>
              Sick leave: {entry.sickLeave.startDate} -{" "}
              {entry.sickLeave.endDate}
            </p>
          )}
        </>
      );
      break;
    default:
      return assertNever(entry);
  }

  return (
    <div>
      <p>{date}</p>
      <p>{description}</p>

      <ul>
        {diagnosisCodes?.map((code) => (
          <li key={code}>
            {code} - {diagnoses[code].name}
          </li>
        ))}
      </ul>

      {content}
    </div>
  );
}

export default SinglePatientPage;
