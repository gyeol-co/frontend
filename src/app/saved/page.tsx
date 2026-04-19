import { SavedPage } from 'src/components/(wishlist)';

/**
 * Auth-gated route. Guest → `/login?next=/saved` via `useAuthRequired` inside
 * the client component.
 */
const SavedRoute = () => <SavedPage />;

export default SavedRoute;
