import { Link, useParams } from 'react-router-dom';
import Card from '../../components/ui/Card';

const CONTENT = {
  'help-center': {
    title: 'Help Center',
    description: 'Find quick answers about shopping, checkout, and orders.',
  },
  returns: {
    title: 'Returns',
    description: 'Start a return or review return and refund timelines.',
  },
  'contact-us': {
    title: 'Contact Us',
    description: 'Reach support by email at support@shopwave.com.',
  },
  faq: {
    title: 'FAQ',
    description: 'Common questions about payments, shipping, and account settings.',
  },
};

export default function SupportPage() {
  const { slug } = useParams();
  const page = CONTENT[slug] ?? { title: 'Support', description: 'Support page not found.' };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{page.title}</h1>
        <p className="text-sm text-gray-500 mt-1">{page.description}</p>
      </div>

      <Card>
        <p className="text-sm text-gray-600">
          This section is connected and routed. Replace this content with backend-powered CMS/help content when ready.
        </p>
      </Card>

      <Link to="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
        Back to store
      </Link>
    </div>
  );
}

