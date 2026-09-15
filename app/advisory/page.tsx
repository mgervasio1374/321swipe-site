import { loadPhotos } from "@/app/lib/photos";
import { AdvisoryPage } from "./AdvisoryPage";

export default function Page() {
  return <AdvisoryPage photos={loadPhotos()} />;
}
