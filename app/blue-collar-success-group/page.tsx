import { loadPhotos } from "@/app/lib/photos";
import { BcsgPage } from "./BcsgPage";

export default function Page() {
  return <BcsgPage photos={loadPhotos()} />;
}
