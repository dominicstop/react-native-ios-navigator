import { Image } from 'react-native';
import {  NavigatorViewConstants, } from 'react-native-ios-navigator';

const { navigationBarHeight } = NavigatorViewConstants;

const PROFILE_SIZE = 80;

export const UI_CONSTANTS = {
  profileSize: PROFILE_SIZE,
  routeHeaderHeight: 150,
  listHeaderTopPadding: (PROFILE_SIZE / 2) + 10,
  postProfileSize: 45,
};

export const SCROLL_OFFSETS = (() => {
  const start = UI_CONSTANTS.routeHeaderHeight;
  const end   = (navigationBarHeight + 20);

  const adj = start - end;
  
  return ({
    '-50%': -(start + (adj * 0.5)),
    '0%'  : -start,
    '24%' : -(start - (adj * 0.24)),
    '25%' : -(start - (adj * 0.25)),
    '50%' : -(start - (adj * 0.50)),
    '75%' : -(start - (adj * 0.75)),
    '100%': -end, 
    '150%': -end + (adj * 0.5),

  });
})();

export const ASSETS = {
  headerBG: require('../../../assets/images/unsplash_diagram.jpg'),
  headerBGBlurred: require('../../../assets/images/unsplash_diagram_blurred.jpg'),
  headerProfile: require('../../../assets/images/domicstop_profile.jpg'),
  chevronBack: Image.resolveAssetSource(require('../../../assets/images/chevron_back.png'))
};

export const COLOR_PRESETS = {
  profileButton: 'rgb(0,132,230)',
  secondaryLabel: 'rgba(230,230,255,0.6)',
  lineSeparator: 'rgba(255,255,255,0.1)',
};

export type PostItem = {
  id: number;
  date: string;
  text?: string;
};

let POST_ID_COUNTER = 0;
export const POST_ITEMS: Array<PostItem> = [{
  id: POST_ID_COUNTER++,
  date: '10/24/20',
  text: 'yes, i am a swift stan: i love taylor swift and also the swift programming language... what of it sweatie? ❤️',
}, {
  id: POST_ID_COUNTER++,
  date: '10/23/20',
  text: `dangling references??? and i oop-`,
}, {
  id: POST_ID_COUNTER++,
  date: '10/22/20',
  text: `text files are non-binary and i love that for them`,
}, {
  id: POST_ID_COUNTER++,
  date: '10/21/20',
  text: `omg my crush just texted me asdfghjklsahadjklgsdjkll \n--- END OF PGP PUBLIC KEY BLOCK ---`,
}, {
  id: POST_ID_COUNTER++,
  date: '10/20/20',
  text: `"well, actually": a christmas romcom about a group of programmers on twitter dealing w/ the complexities of explaining a concept in the most condescending way possible.`
}, {
  id: POST_ID_COUNTER++,
  date: '10/19/20',
  text: `typescript is basically just set-theory in disguise, in this essay i will-`,
}, {
  id: POST_ID_COUNTER++,
  date: '10/18/20',
  text: `sometimes i think about how the majority of oss is maintained by people with anime pfp's and アニメは楽しいね 😌`,
}, {
  id: POST_ID_COUNTER++,
  date: '10/17/20',
  text: `easy async programming is so`,
},  {
  id: POST_ID_COUNTER++,
  date: '10/17/20',
  text: `if they work with compilers, low-level systems, or server infra, there's a 50% chance they're a furry 🥰`,
}, {
  id: POST_ID_COUNTER++,
  date: '10/16/20',
  text: `file << "please stream emotion ✨"; file.close();`,
}, {
  id: POST_ID_COUNTER++,
  date: '10/15/20',
  text: `psh. error handling??? we die like mUNHANDLED EXCEPTION ERROR`,
}, {
  id: POST_ID_COUNTER++,
  date: '10/14/20',
  text: `who needs rust with it's fancy memory safety anyways, asdfghj170w dw1[] psh. error handling??? we die like m`,
}, {
  id: POST_ID_COUNTER++,
  date: '10/13/20',
  text: `go support your local cisadmin in this time of need 😔`,
}, {
  id: POST_ID_COUNTER++,
  date: '10/12/20',
  text: `people keep telling me their pronouns, we get it. you don't have to keep forcing it into every conversation. anyways, i use arch btw`,
}, {
  id: POST_ID_COUNTER++,
  date: '10/11/20',
  text: `software these days, you hardly even know what's in 'em! that's why i like to compile my own software, home made with every single bit fresh from the un-maintained repository i just cloned`,
}, {
  id: POST_ID_COUNTER++,
  date: '10/10/20',
  text: `sorry i was just joking \\0`,
}, {
  id: POST_ID_COUNTER++,
  date: '10/09/20',
  text: `is there an emacs command to fix my crumbling mental health k thnx`,
}, {
  id: POST_ID_COUNTER++,
  date: '10/08/20',
  text: `\`magick convert rose.jpg rose.png\` \nomg congrats on your transition 🥰`,
}, {
  id: POST_ID_COUNTER++,
  date: '10/07/20',
  text: `only the PUREST function for me please`,
}, {
  id: POST_ID_COUNTER++,
  date: '10/06/20',
  text: '**slaps roof** this machine can fit so much state',
}, {
  id: POST_ID_COUNTER++,
  date: '10/05/20',
  text: `these are so cringe, pls don't read them 😔`,
}, {
  id: POST_ID_COUNTER++,
  date: '10/04/20',
  text: `do u use quicktime 'cause ur such a qt :)`,
}, {
  id: POST_ID_COUNTER++,
  date: '10/02/20',
  text: `**drumroll** and today's techtwit main character is...`,
}, {
  id: POST_ID_COUNTER++,
  date: '10/02/20',
  text: `abi stability??? leave her alone, she's doing her best okay`,
}, {
  id: POST_ID_COUNTER++,
  date: '10/02/20',
  text: `objects, outside the oop region of france, are just called pointers`
}, {
  id: POST_ID_COUNTER++,
  date: '10/02/20',
  text: `192.168.254.254 bruh i've got your ip, i'm gonna hack u`,
}, {
  id: POST_ID_COUNTER++,
  date: '10/02/20',
  text: `factory methods?? seize the means of production i guess`,
}, {
  id: POST_ID_COUNTER++,
  date: '10/02/20',
  text: `lorum ipusm or whatever`,
}];