/* Service worker: lets the game open and play with no network after the first visit.
   build_pwa.py fills in VERSION (a hash of every file) and PRECACHE. */
const VERSION = '6759fda49f';
const PRECACHE = [
 "./",
 "index.html",
 "manifest.webmanifest",
 "icons/icon-180.png",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/icon-maskable-512.png",
 "assets/bank.jpg",
 "assets/cu_coin.webp",
 "assets/cu_ingot.webp",
 "assets/cu_parcel.webp",
 "assets/cu_pen.webp",
 "assets/cu_phone.webp",
 "assets/cu_t18.webp",
 "assets/cu_ticket.webp",
 "assets/depot.jpg",
 "assets/fook_armF.png",
 "assets/fook_armN.png",
 "assets/fook_cuffF.png",
 "assets/fook_cuffN.png",
 "assets/fook_h_blink.webp",
 "assets/fook_h_neutral.webp",
 "assets/fook_h_pleased.webp",
 "assets/fook_h_shocked.webp",
 "assets/fook_h_suspicious.webp",
 "assets/fook_h_talka.webp",
 "assets/fook_h_talko.webp",
 "assets/fook_h_tired.webp",
 "assets/fook_head.png",
 "assets/fook_shinF.png",
 "assets/fook_shinN.png",
 "assets/fook_thighF.png",
 "assets/fook_thighN.png",
 "assets/fook_torso.png",
 "assets/hall.jpg",
 "assets/hp_coin.webp",
 "assets/hp_form.webp",
 "assets/hp_ingot.webp",
 "assets/hp_parcel.webp",
 "assets/hp_pen.webp",
 "assets/hp_phone.webp",
 "assets/ic_cert.webp",
 "assets/ic_coin.webp",
 "assets/ic_form.webp",
 "assets/ic_ingot.webp",
 "assets/ic_parcel.webp",
 "assets/ic_pen.webp",
 "assets/ic_phone.webp",
 "assets/ic_stamped.webp",
 "assets/ic_t18.webp",
 "assets/ic_ticket.webp",
 "assets/n_kwai_armleft.webp",
 "assets/n_kwai_armright.webp",
 "assets/n_kwai_armrightthumb.webp",
 "assets/n_kwai_armsraised.webp",
 "assets/n_kwai_armsunwrap.webp",
 "assets/n_kwai_b_blink.webp",
 "assets/n_kwai_b_neutral.webp",
 "assets/n_kwai_b_pleased.webp",
 "assets/n_kwai_b_surprised.webp",
 "assets/n_kwai_b_talk.webp",
 "assets/n_kwai_blink.webp",
 "assets/n_kwai_body.webp",
 "assets/n_kwai_neutral.webp",
 "assets/n_kwai_pleased.webp",
 "assets/n_kwai_surprised.webp",
 "assets/n_kwai_talk.webp",
 "assets/n_ma_armleft.webp",
 "assets/n_ma_armleftlift.webp",
 "assets/n_ma_armright.webp",
 "assets/n_ma_armrightstamp.webp",
 "assets/n_ma_blink.webp",
 "assets/n_ma_body.webp",
 "assets/n_ma_neutral.webp",
 "assets/n_ma_pleased.webp",
 "assets/n_ma_surprised.webp",
 "assets/n_ma_talk.webp",
 "assets/n_ox_armleft.webp",
 "assets/n_ox_armleftgrip.webp",
 "assets/n_ox_armright.webp",
 "assets/n_ox_blink.webp",
 "assets/n_ox_body.webp",
 "assets/n_ox_neutral.webp",
 "assets/n_ox_pleased.webp",
 "assets/n_ox_surprised.webp",
 "assets/n_ox_talk.webp",
 "assets/n_yuk_armleft.webp",
 "assets/n_yuk_armlefthold.webp",
 "assets/n_yuk_armright.webp",
 "assets/n_yuk_armrightgive.webp",
 "assets/n_yuk_armrighthold.webp",
 "assets/n_yuk_blink.webp",
 "assets/n_yuk_blow.webp",
 "assets/n_yuk_body.webp",
 "assets/n_yuk_clipboard.webp",
 "assets/n_yuk_neutral.webp",
 "assets/n_yuk_pleased.webp",
 "assets/n_yuk_surprised.webp",
 "assets/n_yuk_talk.webp",
 "assets/p_cabinet_open.webp",
 "assets/p_cage.webp",
 "assets/p_chain.webp",
 "assets/p_conv0.webp",
 "assets/p_conv2.webp",
 "assets/p_flame0.webp",
 "assets/p_flame1.webp",
 "assets/p_flame2.webp",
 "assets/p_flame3.webp",
 "assets/p_inkdry.webp",
 "assets/p_inkwet.webp",
 "assets/p_parcel17.webp",
 "assets/p_pile.webp",
 "assets/p_pinform.webp",
 "assets/p_slip.webp",
 "assets/p_suitcases.webp",
 "assets/ui_card.jpg",
 "assets/ui_dlg.webp",
 "assets/ui_hint.webp",
 "assets/ui_plaque.webp",
 "assets/ui_ring.webp",
 "assets/ui_rotate.webp",
 "assets/ui_slot.webp",
 "assets/ui_title.jpg",
 "assets/ui_tray.webp"
];
const CACHE = 'hellmoney-' + VERSION;
const FONTS = 'hellmoney-fonts';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('hellmoney-') && k !== CACHE && k !== FONTS).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Google Fonts: serve the saved copy at once, refresh it in the background.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(FONTS).then(async c => {
      const hit = await c.match(req);
      const fresh = fetch(req).then(r => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || fresh;
    }));
    return;
  }
  if (url.origin !== location.origin) return;

  // The page itself: newest copy when online, saved copy when not.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put('./', copy)); return r; })
        .catch(() => caches.match('./').then(r => r || caches.match('index.html')))
    );
    return;
  }

  // Pictures, icons, everything else: saved copy first.
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req)));
});
