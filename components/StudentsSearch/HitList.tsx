import { Hits } from 'react-instantsearch';
import { StudentHit } from './StudentHit';

export function HitsList() {
  return (
    <ul className="space-y-2">
      <Hits hitComponent={StudentHit} classNames={{ list: "ais-Hits-list", item: "ais-Hits-item" }} />
    </ul>
  );
}
