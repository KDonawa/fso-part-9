import { CoursePart } from "../types";
import Part from "./Part";

interface Props {
  courseParts: CoursePart[];
}

function Content({ courseParts }: Props) {
  return (
    <div>
      {courseParts.map((part, i) => (
        <div key={i}>
          <Part part={part} />
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Content;
