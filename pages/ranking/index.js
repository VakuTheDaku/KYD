import { Spinner } from "@nextui-org/react";

export default function Ranking() {

  return (
    <div className="bg-black pt-10 text-white grid place-items-center gap-2">
      <div className="mt-2">
        We are preparing a ranking system. 
      </div>
      <Spinner size="lg" />
    </div>
  );
}
