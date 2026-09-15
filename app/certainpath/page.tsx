import { loadPhotos } from "@/app/lib/photos";
import { CertainPathPage } from "./CertainPathPage";

export default function Page() {
  return <CertainPathPage photos={loadPhotos()} />;
}
