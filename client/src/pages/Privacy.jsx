import Navbar from "../components/Navbar";
import PageMeta from "../components/PageMeta";

const EFFECTIVE_DATE = "May 1, 2026";

export default function Privacy() {
  return (
    <>
      <PageMeta
        title="Privacy Policy | JM Comfort"
        description="How JM Comfort collects, uses, and protects your information when you use our HVAC services and website."
      />
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-10">
          <p className="text-sm font-medium uppercase tracking-wider text-indigo-600">
            Privacy
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Effective {EFFECTIVE_DATE}
          </p>
        </header>

        <article className="prose prose-gray max-w-none space-y-8 text-gray-700">
          <section>
            <p>
              JM Comfort (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;)
              respects your privacy. This Privacy Policy explains what
              information we collect when you use jmcomfort.com (the
              &quot;Site&quot;) or request HVAC services from us, how we use
              that information, and the choices you have. By using the Site or
              requesting service, you agree to this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              1. Information We Collect
            </h2>
            <p className="mt-2">
              We only collect information that is necessary to deliver our
              services and improve the Site:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong>Contact details</strong> you submit through quote,
                contact, or appointment forms — name, email, phone, service
                address, and the message you send us.
              </li>
              <li>
                <strong>Appointment details</strong> — preferred timeslot,
                service type, and notes you choose to share.
              </li>
              <li>
                <strong>Review content</strong> you submit on the public
                Reviews page — your name, rating, and comment.
              </li>
              <li>
                <strong>Technical data</strong> — IP address, browser type,
                device, referring page, and pages viewed. Collected
                automatically through standard server logs and Google
                Analytics 4.
              </li>
              <li>
                <strong>Error data</strong> — anonymized stack traces sent to
                Sentry when a page errors, so we can fix bugs.
              </li>
            </ul>
            <p className="mt-3">
              We do not collect Social Security numbers, credit card numbers,
              or any government identifiers through the Site. Payment for
              service work is handled offline at the time of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              2. How We Use Your Information
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>To respond to your quote request, contact form, or appointment booking.</li>
              <li>To schedule, perform, and follow up on HVAC service work.</li>
              <li>To send service-related email (confirmations, reminders, follow-ups).</li>
              <li>To publish a review on our Reviews page after your approval.</li>
              <li>To monitor Site performance, diagnose errors, and improve the user experience.</li>
              <li>To comply with applicable law and respond to lawful requests.</li>
            </ul>
            <p className="mt-3">
              We do not sell your personal information. We do not use your
              data for behavioral advertising on third-party platforms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              3. How We Share Information
            </h2>
            <p className="mt-2">
              Your information is shared only with the service providers we
              need to operate the Site and run the business:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li><strong>Vercel</strong> — hosts the website.</li>
              <li><strong>AWS</strong> — stores our database (RDS) and uploaded photos (S3).</li>
              <li><strong>Email provider</strong> — sends transactional email (quote confirmations, appointment notices).</li>
              <li><strong>Google Analytics 4</strong> — aggregates anonymous Site usage statistics.</li>
              <li><strong>Sentry</strong> — captures application errors so we can fix them.</li>
            </ul>
            <p className="mt-3">
              Each provider is bound by its own privacy and security
              commitments. We disclose information when required by law,
              court order, or to protect the rights, safety, or property of
              JM Comfort or others.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              4. Cookies and Analytics
            </h2>
            <p className="mt-2">
              The Site uses a small number of cookies that are required for
              core functionality (for example, keeping the admin signed in).
              Google Analytics 4 sets analytics cookies to count visits and
              measure page performance. You can disable cookies in your
              browser at any time; some features of the Site may not work as
              expected if you do.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              5. Data Retention
            </h2>
            <p className="mt-2">
              Lead and appointment records are kept for as long as needed to
              service the customer and meet legal or accounting obligations.
              Reviews remain published until you ask us to remove them.
              Server and analytics logs are rotated regularly and retained
              for no longer than 30 days for errors and 14 days for combined
              access logs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              6. Your Rights
            </h2>
            <p className="mt-2">
              You can ask us at any time to:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Confirm what personal information we hold about you.</li>
              <li>Correct information that is wrong or out of date.</li>
              <li>Delete your information (subject to records we must keep for legal or tax purposes).</li>
              <li>Unpublish a review you previously submitted.</li>
            </ul>
            <p className="mt-3">
              To make a request, email us at{" "}
              <a href="mailto:hello@jmcomfort.example" className="text-indigo-600 hover:underline">
                hello@jmcomfort.example
              </a>
              . California residents may have additional rights under the
              CCPA / CPRA; we honor those requests on the same channel.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              7. Children
            </h2>
            <p className="mt-2">
              The Site is not directed to children under 13, and we do not
              knowingly collect information from them. If you believe a child
              has provided us information, contact us and we will delete it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              8. Security
            </h2>
            <p className="mt-2">
              We use HTTPS across the Site, hash admin passwords with bcrypt,
              rate-limit login attempts, and store secrets in environment
              variables that are not committed to source control. No system
              is perfectly secure; if you believe your data has been
              compromised, contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              9. Changes to This Policy
            </h2>
            <p className="mt-2">
              We may update this Privacy Policy from time to time. The
              effective date at the top reflects the latest revision.
              Material changes will be highlighted on the Site for at least
              30 days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              10. Contact
            </h2>
            <p className="mt-2">
              JM Comfort
              <br />
              1234 Elm St, Sacramento CA 95819
              <br />
              <a href="tel:+19165551234" className="text-indigo-600 hover:underline">
                (916) 555-1234
              </a>
              <br />
              <a href="mailto:hello@jmcomfort.example" className="text-indigo-600 hover:underline">
                hello@jmcomfort.example
              </a>
            </p>
          </section>
        </article>
      </main>
    </>
  );
}
