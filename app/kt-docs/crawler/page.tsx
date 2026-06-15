import { readKtDoc } from '../_components/readKtDoc';
import MarkdownView from '../_components/MarkdownView';

export default function CrawlerKt() {
  return <MarkdownView source={readKtDoc('crawler')} />;
}
