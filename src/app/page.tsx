import { redirect } from 'next/navigation';

/**
 * Root entry — server-side redirect to `/discover`. Full landing page
 * (manifesto hero + CTAs) is deferred until post-MVP.
 */
const RootPage = () => {
  redirect('/discover');
};

export default RootPage;
