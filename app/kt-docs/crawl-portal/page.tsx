import { readKtDoc } from '../_components/readKtDoc';
import MarkdownView from '../_components/MarkdownView';

export default function CrawlPortalKt() {
  return <MarkdownView source={readKtDoc('crawl-portal')} />;
}
