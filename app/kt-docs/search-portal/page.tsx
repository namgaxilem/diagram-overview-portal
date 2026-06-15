import { readKtDoc } from '../_components/readKtDoc';
import MarkdownView from '../_components/MarkdownView';

export default function SearchPortalKt() {
  return <MarkdownView source={readKtDoc('search-portal')} />;
}
