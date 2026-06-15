import { readKtDoc } from '../_components/readKtDoc';
import MarkdownView from '../_components/MarkdownView';

export default function EmbedUiKt() {
  return <MarkdownView source={readKtDoc('embed-ui')} />;
}
