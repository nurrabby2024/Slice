
import { sdk } from 'https://esm.sh/@farcaster/miniapp-sdk';

window.addEventListener('load', () => {
  (async () => {
    try {
      const isMiniApp = await sdk.isInMiniApp();
      console.log('[Slice] isInMiniApp =', isMiniApp);

      const envLabel = document.getElementById('env-label');
      if (envLabel) {
        envLabel.textContent = isMiniApp ? 'mini app' : 'web';
      }

      if (isMiniApp) {
        await sdk.actions.ready();
        console.log('[Slice] ready() called, splash should be hidden');
      }
    } catch (error) {
      console.error('[Slice] SDK error or not in Mini App context:', error);
    }
  })();
});
