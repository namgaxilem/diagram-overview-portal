import { readKtDoc } from '../_components/readKtDoc';
import MarkdownView from '../_components/MarkdownView';

export default function AuthAzureAdKt() {
  return <MarkdownView source={readKtDoc('auth-azure-ad')} />;
}
