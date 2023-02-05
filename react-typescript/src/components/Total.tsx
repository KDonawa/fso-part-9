import { CoursePart } from "../types";

interface Props {
  courseParts: CoursePart[];
}

function Total({ courseParts }: Props) {
  return (
    <p>
      Total number of exercises:{" "}
      {courseParts.reduce((acc, part) => acc + part.exerciseCount, 0)}
    </p>
  );
}

export default Total;
