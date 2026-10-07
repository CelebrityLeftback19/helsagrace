import { MediaLibrary } from "@/components/admin/media-library";
import { listMedia } from "@/lib/admin-data";

export default async function MediaPage() {
  const items = await listMedia();

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl">Media</h1>
      <p className="mb-6 text-ink-mid">
        Uploads live in the public <code>media</code> bucket. Copy a URL into any project
        screenshot, or pick one from the library inside the project editor.
      </p>
      <MediaLibrary initial={items} />
    </div>
  );
}
