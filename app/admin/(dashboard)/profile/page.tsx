import { ProfileEditor } from "@/components/admin/profile-editor";
import { getContent } from "@/lib/cms";

export default async function ProfilePage() {
  const { site } = await getContent();

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl">Profile &amp; hero</h1>
      <ProfileEditor initial={site} />
    </div>
  );
}
