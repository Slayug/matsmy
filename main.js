
const PREFIX = '[MATSMY]';
const ASK_TOKEN = 'ask_token';
const REACTIONS_ENDPOINT = 'https://mattermost.takima.io/api/v4/reactions';
let xCsrfToken= '';
let lastHref = '';
let lastLength = 0;

const emoji = JSON.parse('["birthday","parrot","conga_parrot","ultrafastparrot","shuffle_parrot","cake","rainbow","beer","beers","tada","smile","simple_smile","laughing","blush","smiley","relaxed","smirk","heart_eyes","kissing_heart","kissing_closed_eyes","flushed","relieved","satisfied","grin","wink","stuck_out_tongue_winking_eye","stuck_out_tongue_closed_eyes","grinning","kissing","kissing_smiling_eyes","stuck_out_tongue","sleeping","frowning","open_mouth","grimacing","hushed","sweat_smile","pensive","confounded","joy","astonished","scream","neckbeard","triumph","sleepy","yum","mask","sunglasses","dizzy_face","imp","smiling_imp","neutral_face","innocent","alien","yellow_heart","blue_heart","purple_heart","heart","green_heart","broken_heart","heartbeat","heartpulse","two_hearts","revolving_hearts","cupid","sparkling_heart","sparkles","star","star2","dizzy","boom","collision","anger","exclamation","question","grey_exclamation","grey_question","zzz","dash","sweat_drops","notes","musical_note","fire","hankey","poop","shit","+1","thumbsup","ok_hand","punch","facepunch","fist","v","wave","hand","raised_hand","open_hands","point_up","point_left","point_right","raised_hands","pray","point_up_2","clap","muscle","metal","fu","runner","running","couple","family","two_men_holding_hands","two_women_holding_hands","dancer","dancers","ok_woman","no_good","information_desk_person","raising_hand","bride_with_veil","person_with_pouting_face","person_frowning","bow","couplekiss","couple_with_heart","massage","haircut","nail_care","boy","girl","woman","man","baby","older_woman","older_man","person_with_blond_hair","man_with_gua_pi_mao","man_with_turban","construction_worker","cop","angel","princess","smiley_cat","smile_cat","heart_eyes_cat","kissing_cat","smirk_cat","scream_cat","joy_cat","pouting_cat","japanese_ogre","japanese_goblin","see_no_evil","hear_no_evil","speak_no_evil","guardsman","skull","feet","lips","kiss","droplet","ear","eyes","nose","tongue","love_letter","bust_in_silhouette","busts_in_silhouette","speech_balloon","thought_balloon","feelsgood","finnadie","goberserk","godmode","hurtrealbad","rage1","rage2","rage3","rage4","suspect","clown_face","trollface"]');

const nature = JSON.parse("[\"sunny\",\"umbrella\",\"cloud\",\"snowflake\",\"snowman\",\"zap\",\"cyclone\",\"foggy\",\"ocean\",\"cat\",\"dog\",\"mouse\",\"hamster\",\"rabbit\",\"wolf\",\"frog\",\"tiger\",\"koala\",\"bear\",\"pig\",\"pig_nose\",\"cow\",\"boar\",\"monkey_face\",\"monkey\",\"horse\",\"racehorse\",\"camel\",\"sheep\",\"elephant\",\"panda_face\",\"snake\",\"bird\",\"baby_chick\",\"hatched_chick\",\"hatching_chick\",\"chicken\",\"penguin\",\"turtle\",\"bug\",\"honeybee\",\"ant\",\"beetle\",\"snail\",\"octopus\",\"tropical_fish\",\"fish\",\"whale\",\"whale2\",\"dolphin\",\"cow2\",\"ram\",\"rat\",\"water_buffalo\",\"tiger2\",\"rabbit2\",\"dragon\",\"goat\",\"rooster\",\"dog2\",\"pig2\",\"mouse2\",\"ox\",\"dragon_face\",\"blowfish\",\"crocodile\",\"dromedary_camel\",\"leopard\",\"cat2\",\"poodle\",\"paw_prints\",\"bouquet\",\"cherry_blossom\",\"tulip\",\"four_leaf_clover\",\"rose\",\"sunflower\",\"hibiscus\",\"maple_leaf\",\"leaves\",\"fallen_leaf\",\"herb\",\"mushroom\",\"cactus\",\"palm_tree\",\"evergreen_tree\",\"deciduous_tree\",\"chestnut\",\"seedling\",\"blossom\",\"ear_of_rice\",\"shell\",\"globe_with_meridians\",\"sun_with_face\",\"full_moon_with_face\",\"new_moon_with_face\",\"new_moon\",\"waxing_crescent_moon\",\"first_quarter_moon\",\"waxing_gibbous_moon\",\"full_moon\",\"waning_gibbous_moon\",\"last_quarter_moon\",\"waning_crescent_moon\",\"last_quarter_moon_with_face\",\"first_quarter_moon_with_face\",\"crescent_moon\",\"earth_africa\",\"earth_americas\",\"earth_asia\",\"volcano\",\"milky_way\",\"partly_sunny\",\"octocat\",\"squirrel\"]");


function getUserId() {
    const imageElement = document.getElementsByClassName('Avatar Avatar-lg');
    const srcSplitted = imageElement[0].src.split('/');
    return srcSplitted[srcSplitted.length - 2];
}

function log(message) {
    console.log(PREFIX + ' - ' + message);
}

async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': xCsrfToken
    },
    redirect: 'follow',
    body: JSON.stringify(data)
  });
  return await response.json();
}

/**
 * 
 * @param path from assets folder
 */
function getImageUrl(path) {
    return browser.extension.getURL(`assets/${path}`);
}

function fullFill(messageId) {
    if (confirm("Sure about that?")) {
        emoji.forEach(emo => {
            postData(REACTIONS_ENDPOINT, {
                "user_id": getUserId(),
                "post_id": messageId,
                "emoji_name": emo
            }).then(() => {})
            .catch((err) => {
                console.error(err)
            });
        });
    }
}

function getIdForEmojiButton(messageId) {
    return `matsmy-emoji-button-${messageId}`;
}

function buildEmojiButton(messageId) {
    const element = document.createElement("div");
    element.id = getIdForEmojiButton(messageId);
    element.style.width = '40px';
    element.style.height = '22px';
    element.style.backgroundImage = `url('${getImageUrl('action.png')}')`; 
    element.style.backgroundColor = '#FF77FF';
    element.style.position = 'absolute';
    element.style.bottom = '0px';
    element.style.right = '0px';
    element.style.border = '1px rgba(65, 63, 62, 0.62) solid';
    element.style.cursor = 'pointer';
    element.style.zIndex = '12';

    element.addEventListener('click', () => fullFill(messageId));

    return element;
}

function getMessages() {
    return Array.from(document.getElementsByClassName('post__body')).filter(el => el.id.indexOf('user-activity') === -1);
}

function appendEmojiButtonIfNecessary(el) {
    const messageId = el.id.replace('_message', '');
    if (document.getElementById(getIdForEmojiButton(messageId)) === null) {
        el.appendChild(buildEmojiButton(messageId));
    }
}

function scan() {
    getMessages().forEach(el => {
        appendEmojiButtonIfNecessary(el);
    });
}

browser.runtime.onMessage.addListener(query => {
    xCsrfToken = query.xCsrf;
});
browser.runtime.sendMessage({'action': ASK_TOKEN, 'url': window.location.href});

log('ready to :)');

setInterval(() => {
    if (lastHref !== window.location.href || lastLength === 0) {
        scan();
        lastHref = window.location.href;
        lastLength = getMessages().length;
    }

}, 1000);
