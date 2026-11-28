/**
 * Joenel Playlist. Audio is Apple's official 30-second preview for each song,
 * streamed from Apple (nothing is hosted here). Looked up with the public
 * iTunes Search API; `link` opens the full song in Apple Music.
 */
export interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  artwork: string;
  preview: string;
  link: string;
}

export const PLAYLIST_NAME = "Joenel Playlist";

export const TRACKS: Track[
  {
    id: 1766905828,
    title: "Multo",
    artist: "Cup of Joe",
    album: "Multo - Single",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/0b/e2/18/0be218a4-45ea-5c35-03f2-b0c2026e3504/cover.jpg/300x300bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/f7/9b/bd/f79bbd43-d609-dc3d-b17c-109421f4b14c/mzaf_8010886528955428923.plus.aac.p.m4a",
    link: "https://music.apple.com/ph/album/multo/1766905823",
  },
  {
    id: 1623878835,
    title: "Tadhana",
    artist: "Up Dharma Down",
    album: "Capacities",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/47/eb/bc/47ebbc0e-7ad4-4ffa-c1ae-2731a36d424a/cover.jpg/300x300bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/0e/f3/96/0ef39644-95d8-f631-8311-a4a3ef3dbc06/mzaf_7005051564435313766.plus.aac.p.m4a",
    link: "https://music.apple.com/ph/album/tadhana/1623878530",
  },
  {
    id: 1776741889,
    title: "Glimpse of Us",
    artist: "Joji",
    album: "Glimpse of Us - Single",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/e4/f6/bd/e4f6bd1d-c969-026d-bb63-f32c77649474/54391890016.jpg/300x300bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/b7/69/a7/b769a755-c169-95d1-2aed-ad408c3510c6/mzaf_6576932891311374530.plus.aac.p.m4a",
    link: "https://music.apple.com/ph/album/glimpse-of-us/1776741467",
  },
  {
    id: 1491991353,
    title: "Heather",
    artist: "Conan Gray",
    album: "Kid Krow",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/e5/43/73/e5437393-f818-e097-76b8-082631284a98/19UM1IM12339.rgb.jpg/300x300bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/25/0c/9d/250c9d4d-1a8e-fbd2-6f29-ba7586073da0/mzaf_9768692436554835353.plus.aac.p.m4a",
    link: "https://music.apple.com/ph/album/heather/1491990424",
  },
  {
    id: 1750030366,
    title: "sining (feat. Jay R)",
    artist: "Dionela",
    album: "sining (feat. Jay R) - Single",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/f6/cf/4e/f6cf4ebc-c0ff-b55f-ee31-f45b49750f48/24UMGIM59253.rgb.jpg/300x300bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/67/de/4a/67de4a10-240a-a590-9527-379bef85821b/mzaf_6509342354671258731.plus.aac.p.m4a",
    link: "https://music.apple.com/ph/album/sining-feat-jay-r/1750030363",
  },
  {
    id: 895611647,
    title: "Little Do You Know",
    artist: "Alex & Sierra",
    album: "It's About Us",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0b/d2/a8/0bd2a89c-0a75-bd3d-057a-12e7ab2fbbeb/886444667234.jpg/300x300bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/90/77/f9/9077f9c1-38e4-a3fb-2a60-1466024d2a91/mzaf_6865480968163164679.plus.aac.p.m4a",
    link: "https://music.apple.com/ph/album/little-do-you-know/895611637",
  },
  {
    id: 1588030260,
    title: "Pagsamo",
    artist: "Arthur Nery",
    album: "Pagsamo - Single",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/23/b7/24/23b72461-4b92-230a-a1c1-041fb75acbaf/cover.jpg/300x300bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/dc/52/a5/dc52a5c9-ec23-6d9b-254b-4ab8c10278a5/mzaf_2362941077511782734.plus.aac.p.m4a",
    link: "https://music.apple.com/ph/album/pagsamo/1588030248",
  },
  {
    id: 1604657975,
    title: "ceilings",
    artist: "Lizzy McAlpine",
    album: "five seconds flat",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/11/6a/64/116a64ee-0db3-4e59-bd86-f44008e47f85/5056167170006.jpg/300x300bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/7b/52/b7/7b52b754-157a-6946-1a7f-3885d0d4b45f/mzaf_11031506980503485356.plus.aac.p.m4a",
    link: "https://music.apple.com/ph/album/ceilings/1604657567",
  },
  {
    id: 1728833440,
    title: "Mundo",
    artist: "IV OF SPADES",
    album: "Mundo - Single",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/34/a1/38/34a13831-bc49-e269-e8f6-084c0c5b2815/4895241431630_3000.jpg/300x300bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/33/4b/5a/334b5a81-a684-f556-2c42-aa4f2e968bf7/mzaf_4537020252269535371.plus.aac.p.m4a",
    link: "https://music.apple.com/ph/album/mundo/1728833436",
  },
  {
    id: 1429663167,
    title: "Liability",
    artist: "Lorde",
    album: "Melodrama",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/8d/0d/15/8d0d1532-493b-52ec-6a29-a239ced6931b/17UMGIM81023.rgb.jpg/300x300bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/93/f7/8a/93f78a0a-11fc-d2b9-44b3-32ccf30ae016/mzaf_3308956915771056638.plus.aac.p.m4a",
    link: "https://music.apple.com/ph/album/liability/1429662346",
  },
  {
    id: 1250510784,
    title: "Kathang Isip",
    artist: "Ben&Ben",
    album: "Kathang Isip - Single",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/9a/b8/5e/9ab85e10-bf98-4ee7-b5b7-1bbfcc4cc3a4/190295825287.jpg/300x300bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/8e/0d/31/8e0d3138-e3d5-c9fd-6ce6-f42ffabd6a82/mzaf_3663898361640707812.plus.aac.p.m4a",
    link: "https://music.apple.com/ph/album/kathang-isip/1250509960",
  },
  {
    id: 1560735859,
    title: "happier",
    artist: "Olivia Rodrigo",
    album: "SOUR",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/02/ed/8c/02ed8cab-c089-2fdd-7ce6-ab334a9a4e19/21UMGIM26093.rgb.jpg/300x300bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/4d/17/85/4d17858d-b001-d33c-1c25-6761b3286540/mzaf_7847579171692049058.plus.aac.p.m4a",
    link: "https://music.apple.com/ph/album/happier/1560734944",
  },
  {
    id: 1650172320,
    title: "Pasilyo",
    artist: "SunKissed Lola",
    album: "Pasilyo - Single",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/73/0c/ef/730cefeb-f4ad-d503-0a25-f34f933c34d6/5063161188159_cover.jpg/300x300bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/6a/bf/69/6abf691d-4092-e079-c66e-1abeed3f57fd/mzaf_8670108549737339170.plus.aac.p.m4a",
    link: "https://music.apple.com/ph/album/pasilyo/1650172316",
  },
  {
    id: 1064992880,
    title: "Another Love",
    artist: "Tom Odell",
    album: "Heartbroken",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music2/v4/22/91/9d/22919d50-e52d-819f-7f69-9aac6cea2866/886445574616.jpg/300x300bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/3b/b7/cf/3bb7cff0-d4a2-fc17-75b8-21c944b281f4/mzaf_2956687567908031543.plus.aac.p.m4a",
    link: "https://music.apple.com/ph/album/another-love/1064992261",
  },
  {
    id: 1396320762,
    title: "Buwan",
    artist: "juan karlos",
    album: "Buwan - Single",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/fb/f2/1d/fbf21dfd-ee84-6c68-2598-8fd32c407aac/18UMGIM30827.rgb.jpg/300x300bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ce/63/d7/ce63d741-e310-f750-9fd9-495423599964/mzaf_813715797676040252.plus.aac.p.m4a",
    link: "https://music.apple.com/ph/album/buwan/1396320273",
  },
  {
    id: 1677006158,
    title: "Die For You",
    artist: "The Weeknd",
    album: "Starboy (Deluxe)",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/b2/c0/1d/b2c01d38-2798-1bce-e6f3-8d0959ca51dd/23UMGIM22528.rgb.jpg/300x300bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/1c/e7/f9/1ce7f9bb-42d3-fc77-1a24-68c187a55208/mzaf_5325098525476847495.plus.aac.p.m4a",
    link: "https://music.apple.com/ph/album/die-for-you/1677005169",
  },
  {
    id: 1737955576,
    title: "Raining In Manila",
    artist: "Lola Amour",
    album: "Lola Amour",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/eb/6f/9e/eb6f9e60-4488-a492-3467-fa73b465471f/5021732269867.jpg/300x300bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d3/d0/25/d3d025fc-fa2d-8738-5e55-7572aa38fb21/mzaf_1870371480266599535.plus.aac.p.m4a",
    link: "https://music.apple.com/ph/album/raining-in-manila/1737955140",
  },
  {
    id: 1485802975,
    title: "Falling",
    artist: "Harry Styles",
    album: "Fine Line",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/2b/c4/c9/2bc4c9d4-3bc6-ab13-3f71-df0b89b173de/886448022213.jpg/300x300bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/34/09/0c/34090cd6-ec90-4348-8367-777bfff9d8a0/mzaf_6081710813683205886.plus.aac.p.m4a",
    link: "https://music.apple.com/ph/album/falling/1485802965",
  },
  {
    id: 1622713759,
    title: "Mahika",
    artist: "Adie & Janine Berdin",
    album: "Mahika - Single",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/e9/99/da/e999da24-a3ad-f1bc-d6b2-4146b8983a84/cover.jpg/300x300bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/10/97/7e/10977eea-d11e-c61c-ceb0-040374165892/mzaf_16308192548002047297.plus.aac.p.m4a",
    link: "https://music.apple.com/ph/album/mahika/1622713746",
  },
  {
    id: 1444895706,
    title: "Hold On",
    artist: "Chord Overstreet",
    album: "Hold On - Single",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/82/f2/6a/82f26ae6-f5c4-4ae7-74c0-72c266cd8406/00602557261615.rgb.jpg/300x300bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/bf/ba/04/bfba04b0-7fd2-93a9-1e13-cb6e00a54d05/mzaf_937057795648088866.plus.aac.p.m4a",
    link: "https://music.apple.com/ph/album/hold-on/1444895686",
  },
];
