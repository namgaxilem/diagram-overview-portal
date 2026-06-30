import { readKtDoc } from '../_components/readKtDoc';
import MarkdownView from '../_components/MarkdownView';

export default function CrawlerKtSession() {
  return <MarkdownView source={readKtDoc('crawler-kt-session')} />;
}
