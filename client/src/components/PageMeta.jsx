import { Helmet } from 'react-helmet-async';

export default function PageMeta({ title, description }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
}
