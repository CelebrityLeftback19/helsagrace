import { MessagesList } from "@/components/admin/messages-list";
import { listContactMessages } from "@/lib/admin-data";

export default async function MessagesPage() {
  const messages = await listContactMessages();
  const unread = messages.filter((message) => message.status === "new").length;

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl">Messages</h1>
      <p className="mb-6 text-ink-mid">
        Submissions from the contact form. {messages.length} total
        {unread > 0 ? ` · ${unread} unread` : ""}.
      </p>
      <MessagesList initial={messages} />
    </div>
  );
}
