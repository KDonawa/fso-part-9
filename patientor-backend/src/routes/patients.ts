import { Router } from "express";
import patientsService from "../services/patients";
import { parseNewPatientData, parseNewPatientEntry } from "../utils";

const router = Router();

router
  .route("/")
  .get((_req, res) => {
    res.json(patientsService.getPatients());
  })
  .post((req, res) => {
    try {
      const newPatientData = parseNewPatientData(req.body);
      const newPatient = patientsService.addPatient(newPatientData);
      res.status(201).json(newPatient);
    } catch (error) {
      let message;
      if (error instanceof Error) message = error.message;
      else message = String(error);

      res.status(400).send(message);
    }
  });

router.route("/:id").get((req, res) => {
  const id = req.params.id;
  const patient = patientsService.getPatientById(id);

  if (!patient) {
    return res.status(400).send("No patient with that id exists");
  }
  return res.json(patient);
});

router.route("/:id/entries").post((req, res) => {
  const id = req.params.id;

  try {
    const entry = parseNewPatientEntry(req.body);
    const newEntry = patientsService.addPatientEntry(id, entry);

    if (!newEntry) return res.status(400).send("Patient was not found");

    return res.status(201).json(newEntry);
  } catch (error) {
    let message;
    if (error instanceof Error) message = error.message;
    else message = String(error);

    return res.status(400).send(message);
  }
});

export default router;
