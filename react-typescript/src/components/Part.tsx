import { CoursePart } from "../types";
import { assertNever } from "../utils";

interface Props {
  part: CoursePart;
}

function Part({ part }: Props) {
  switch (part.type) {
    case "normal":
      return (
        <>
          <h2>{part.name}</h2>
          <p>Number of exercises: {part.exerciseCount}</p>
          <p>{part.description}</p>
        </>
      );
    case "groupProject":
      return (
        <>
          <h2>{part.name}</h2>
          <p>Number of exercises: {part.exerciseCount}</p>
          <p>Number of group projects: {part.groupProjectCount}</p>
        </>
      );
    case "submission":
      return (
        <>
          <h2>{part.name}</h2>
          <p>Number of exercises: {part.exerciseCount}</p>
          <p>{part.description}</p>
          <p>
            Submit to:{" "}
            <a href={`${part.exerciseSubmissionLink}`}>
              {part.exerciseSubmissionLink}
            </a>{" "}
          </p>
        </>
      );
    case "special":
      return (
        <>
          <h2>{part.name}</h2>
          <p>Number of exercises: {part.exerciseCount}</p>
          <p>{part.description}</p>
          <p>Requirements: {part.requirements.join(", ")}</p>
        </>
      );
    default:
      return assertNever(part);
  }
}

export default Part;
