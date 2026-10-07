/**
 * HTML + plain-text email sent to the owner when someone submits the contact
 * form.
 *
 * Email-client constraints: table-based layout, inline styles, web-safe fonts
 * (Georgia for the wordmark/headings, Arial for body) because custom webfonts
 * don't load reliably in mail clients, and no external images.
 */

export type ContactNotificationInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Unique per submission — shown in the email and used to prevent threading. */
  reference?: string;
  /** Base site URL, used for the footer link and the admin link. */
  siteUrl?: string;
  /** Where the message can be read. */
  adminUrl?: string;
  receivedAt?: Date;
};

const INK = "#0f0f14";
const INK_SOFT = "#3a3a45";
const MUTED = "#6b6b7a";
const BORDER = "#e4e4e9";
const BASE = "#f9f9fb";
const ACCENT = "#5b4fe8";
const ACCENT_SOFT = "#a79fff";

const SANS = "Arial, 'Helvetica Neue', Helvetica, sans-serif";
const SERIF = "Georgia, 'Times New Roman', Times, serif";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date);
}

export function renderContactNotification(input: ContactNotificationInput): {
  subject: string;
  html: string;
  text: string;
} {
  const name = escapeHtml(input.name);
  const email = escapeHtml(input.email);
  const subjectLine = input.subject.trim();
  const safeSubject = escapeHtml(subjectLine);
  const message = escapeHtml(input.message);
  const received = formatDate(input.receivedAt ?? new Date());
  const reference = input.reference ?? "";
  const safeReference = escapeHtml(reference);
  const siteUrl = input.siteUrl ?? "https://helsagrace.site";
  const adminUrl = input.adminUrl ?? `${siteUrl}/admin/messages`;

  const replyHref = `mailto:${input.email}${
    subjectLine ? `?subject=${encodeURIComponent(`Re: ${subjectLine}`)}` : ""
  }`;

  const subject = subjectLine
    ? `New enquiry — ${subjectLine}`
    : `New enquiry from ${input.name}`;

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <title>${subject}</title>
  </head>
  <body style="margin:0;padding:0;background:${BASE};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${BASE};">
      New enquiry from ${name}${subjectLine ? ` — ${safeSubject}` : ""}
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BASE};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:#ffffff;border:1px solid ${BORDER};border-radius:16px;overflow:hidden;">

            <tr>
              <td style="background:${INK};padding:22px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-family:${SERIF};font-size:20px;line-height:1;color:#ffffff;">
                      Helsa<span style="font-style:italic;color:${ACCENT_SOFT};">Grace</span>
                    </td>
                    <td align="right" style="font-family:${SANS};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.45);">
                      New enquiry
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:32px 32px 4px;">
                <p style="margin:0 0 10px;font-family:${SANS};font-size:12px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase;color:${ACCENT};">
                  Contact form
                </p>
                <h1 style="margin:0;font-family:${SERIF};font-weight:400;font-size:26px;line-height:1.28;color:${INK};">
                  ${name} would like to work with you.
                </h1>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 32px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="width:96px;padding:12px 0;border-top:1px solid ${BORDER};font-family:${SANS};font-size:12px;color:${MUTED};vertical-align:top;">From</td>
                    <td style="padding:12px 0;border-top:1px solid ${BORDER};font-family:${SANS};font-size:15px;line-height:1.5;color:${INK};">
                      ${name} &middot; <a href="mailto:${input.email}" style="color:${ACCENT};text-decoration:none;">${email}</a>
                    </td>
                  </tr>
                  ${
                    subjectLine
                      ? `<tr>
                    <td style="width:96px;padding:12px 0;border-top:1px solid ${BORDER};font-family:${SANS};font-size:12px;color:${MUTED};vertical-align:top;">Subject</td>
                    <td style="padding:12px 0;border-top:1px solid ${BORDER};font-family:${SANS};font-size:15px;line-height:1.5;color:${INK};">
                      ${safeSubject}
                    </td>
                  </tr>`
                      : ""
                  }
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:22px 32px 0;">
                <div style="background:${BASE};border:1px solid ${BORDER};border-radius:12px;padding:20px 22px;font-family:${SANS};font-size:15px;line-height:1.65;color:${INK_SOFT};white-space:pre-wrap;">${message}</div>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 32px 0;">
                <a href="${replyHref}" style="display:inline-block;background:${ACCENT};color:#ffffff;font-family:${SANS};font-size:15px;font-weight:bold;text-decoration:none;padding:14px 30px;border-radius:9999px;">
                  Reply to ${name}
                </a>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 32px 32px;">
                <p style="margin:0;font-family:${SANS};font-size:13px;line-height:1.6;color:${MUTED};">
                  Replying goes straight to ${name}. This enquiry is also stored in your admin under
                  <a href="${adminUrl}" style="color:${ACCENT};text-decoration:none;">Messages</a>.
                </p>
              </td>
            </tr>

            <tr>
              <td style="background:${BASE};border-top:1px solid ${BORDER};padding:18px 32px;">
                <p style="margin:0;font-family:${SANS};font-size:12px;line-height:1.6;color:${MUTED};">
                  Sent from the contact form on
                  <a href="${siteUrl}" style="color:${MUTED};text-decoration:underline;">helsagrace.site</a>
                  &middot; Received ${received}${reference ? ` &middot; Ref ${safeReference}` : ""}
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const lines: string[] = [`New enquiry from ${input.name} <${input.email}>`];
  if (subjectLine) lines.push(`Subject: ${subjectLine}`);
  lines.push("", input.message, "", `Reply: ${replyHref}`, `Received: ${received}`);
  if (reference) lines.push(`Reference: ${reference}`);
  const text = lines.join("\n");

  return { subject, html, text };
}
