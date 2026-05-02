import Navbar from "../components/Navbar";
import PageMeta from "../components/PageMeta";

const EFFECTIVE_DATE = "May 1, 2026";

export default function Terms() {
  return (
    <>
      <PageMeta
        title="Terms of Service | JM Comfort"
        description="The terms and conditions that govern your use of jmcomfort.com and the HVAC services provided by JM Comfort."
      />
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-10">
          <p className="text-sm font-medium uppercase tracking-wider text-indigo-600">
            Legal
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Effective {EFFECTIVE_DATE}
          </p>
        </header>

        <article className="prose prose-gray max-w-none space-y-8 text-gray-700">
          <section>
            <p>
              These Terms of Service (&quot;Terms&quot;) govern your use of
              jmcomfort.com (the &quot;Site&quot;) and any HVAC service you
              request from JM Comfort (&quot;we&quot;, &quot;us&quot;,
              &quot;our&quot;). By using the Site or scheduling work, you
              agree to these Terms. If you do not agree, do not use the
              Site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              1. Who We Are
            </h2>
            <p className="mt-2">
              JM Comfort is a family-owned HVAC contractor serving the
              Greater Sacramento area. Our services include installation,
              repair, and maintenance of residential and commercial heating,
              cooling, and air-quality equipment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              2. Use of the Site
            </h2>
            <p className="mt-2">
              You agree to use the Site for lawful purposes only. You will
              not:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Submit false or misleading information through any form.</li>
              <li>Attempt to access non-public areas of the Site (admin pages, APIs you are not authorized to call).</li>
              <li>Probe, scan, or test the vulnerability of the Site without written permission.</li>
              <li>Upload content that is unlawful, defamatory, infringing, or harmful.</li>
              <li>Interfere with the operation of the Site or other users&apos; access to it.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              3. Quotes, Estimates, and Appointments
            </h2>
            <p className="mt-2">
              Quotes generated through the Site are non-binding estimates
              based on the information you submit. A final price is provided
              after on-site inspection. Submitting a quote request or
              appointment is a request for service — it does not become a
              binding agreement until we confirm the appointment in writing
              (email or text message).
            </p>
            <p className="mt-3">
              If we cannot service your address, we will let you know and
              your information will be deleted at your request.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              4. Service Terms
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>All work is performed by licensed technicians.</li>
              <li>Standard service hours are Monday–Friday 8 AM–6 PM and Saturday 9 AM–2 PM Pacific. After-hours emergency service is billed at a higher rate.</li>
              <li>Parts and labor are warrantied per the manufacturer warranty plus a 1-year workmanship warranty unless otherwise stated in writing.</li>
              <li>Cancellations made less than 4 hours before the scheduled time may incur a trip-charge fee.</li>
              <li>Payment is due upon completion of work unless a written payment plan exists.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              5. Reviews and User Content
            </h2>
            <p className="mt-2">
              When you submit a review or other content through the Site,
              you grant JM Comfort a non-exclusive, royalty-free license to
              display, edit for length and clarity, and reproduce that
              content on the Site and in our marketing materials. You
              represent that the content is accurate, your own, and does not
              infringe on anyone&apos;s rights. We may decline to publish
              any submission and may remove content at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              6. Intellectual Property
            </h2>
            <p className="mt-2">
              The Site, including its design, logos, copy, photographs, and
              source code, is owned by JM Comfort or its licensors and is
              protected by copyright, trademark, and other laws. You may not
              copy, redistribute, or build derivative works from the Site
              without our written permission, except for short quotations
              with attribution.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              7. Third-Party Links and Services
            </h2>
            <p className="mt-2">
              The Site may link to third-party sites (for example, Google
              Maps for directions). We do not control those sites and are
              not responsible for their content or privacy practices. Your
              use of any third-party site is at your own risk and subject to
              that site&apos;s terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              8. Disclaimer of Warranties
            </h2>
            <p className="mt-2">
              The Site is provided &quot;as is&quot; and &quot;as
              available&quot;. Beyond the workmanship warranty for actual
              service work performed, we make no other warranties, express
              or implied, including merchantability, fitness for a
              particular purpose, or non-infringement, regarding the Site
              itself. We do not guarantee that the Site will be
              uninterrupted, error-free, or secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              9. Limitation of Liability
            </h2>
            <p className="mt-2">
              To the maximum extent permitted by law, JM Comfort and its
              officers, employees, and contractors are not liable for any
              indirect, incidental, special, consequential, or punitive
              damages arising out of your use of the Site or any service.
              Our total aggregate liability for any claim related to the
              Site is limited to the greater of $100 or the amount you paid
              us in the 12 months before the claim arose. This limitation
              does not affect any non-waivable consumer rights you have
              under California law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              10. Indemnification
            </h2>
            <p className="mt-2">
              You agree to indemnify and hold harmless JM Comfort from any
              claim, loss, or expense (including reasonable attorneys&apos;
              fees) arising out of your misuse of the Site, your violation
              of these Terms, or your violation of any law or third-party
              right.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              11. Governing Law and Disputes
            </h2>
            <p className="mt-2">
              These Terms are governed by the laws of the State of
              California, without regard to its conflict-of-laws rules. Any
              dispute will be brought exclusively in the state or federal
              courts located in Sacramento County, California, and you
              consent to the personal jurisdiction of those courts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              12. Changes to These Terms
            </h2>
            <p className="mt-2">
              We may update these Terms from time to time. The effective
              date at the top reflects the latest revision. Continued use of
              the Site after a change means you accept the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">
              13. Contact
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
